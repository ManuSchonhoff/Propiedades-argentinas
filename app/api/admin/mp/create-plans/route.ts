/**
 * POST /api/admin/mp/create-plans
 * One-time setup: creates preapproval_plans in MercadoPago and saves IDs to DB.
 * Protect with a secret header in production.
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createPreapprovalPlan } from "@/lib/mercadopago/mp";

export async function POST(req: NextRequest) {
    // Simple auth: require admin secret header
    const adminSecret = process.env.ADMIN_SECRET ?? "dev-secret";
    const provided = req.headers.get("x-admin-secret");
    if (provided !== adminSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = supabaseAdmin();
    if (!db) {
        return NextResponse.json({ error: "DB not configured" }, { status: 500 });
    }

    // Get all plans without MP plan IDs
    const { data: plans } = await db
        .from("plans")
        .select("id, code, name, price_ars, mp_preapproval_plan_id")
        .order("price_ars", { ascending: true });

    if (!plans || plans.length === 0) {
        return NextResponse.json({ error: "No plans found. Run migration first." }, { status: 404 });
    }

    const results = [];

    for (const plan of plans) {
        if (plan.mp_preapproval_plan_id) {
            results.push({ code: plan.code, status: "already_configured", mpId: plan.mp_preapproval_plan_id });
            continue;
        }

        try {
            const mpPlan = await createPreapprovalPlan({
                code: plan.code,
                name: plan.name,
                priceArs: plan.price_ars,
            });

            await db
                .from("plans")
                .update({ mp_preapproval_plan_id: mpPlan.id })
                .eq("id", plan.id);

            results.push({ code: plan.code, status: "created", mpId: mpPlan.id });
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            results.push({ code: plan.code, status: "error", error: message });
        }
    }

    return NextResponse.json({ ok: true, results });
}
