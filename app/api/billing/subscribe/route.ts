/**
 * POST /api/billing/subscribe
 * Creates a MercadoPago subscription for the authenticated user.
 */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { createSubscription } from "@/lib/mercadopago/mp";

export async function POST(req: NextRequest) {
    const db = supabase();
    if (!db) {
        return NextResponse.json({ error: "DB not configured" }, { status: 500 });
    }

    // Auth check
    const { data: { user } } = await db.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { plan_id } = await req.json();
    if (!plan_id) {
        return NextResponse.json({ error: "plan_id requerido" }, { status: 400 });
    }

    // Get plan
    const { data: plan } = await db
        .from("plans")
        .select("id, code, name, price_ars, mp_preapproval_plan_id")
        .eq("id", plan_id)
        .single();

    if (!plan || !plan.mp_preapproval_plan_id) {
        return NextResponse.json(
            { error: "Plan no encontrado o no configurado en MP" },
            { status: 404 }
        );
    }

    // Check for existing active subscription
    const { data: existingSub } = await db
        .from("subscriptions")
        .select("id, status")
        .eq("user_id", user.id)
        .in("status", ["authorized", "pending"])
        .maybeSingle();

    if (existingSub?.status === "authorized") {
        return NextResponse.json(
            { error: "Ya tenés una suscripción activa. Cancelá primero para cambiar de plan." },
            { status: 409 }
        );
    }

    // Create subscription row
    const { data: sub, error: subErr } = await db
        .from("subscriptions")
        .insert({
            user_id: user.id,
            plan_id: plan.id,
            status: "pending",
        })
        .select("id")
        .single();

    if (subErr || !sub) {
        return NextResponse.json({ error: "Error al crear suscripción" }, { status: 500 });
    }

    // Create MP subscription
    try {
        const mpSub = await createSubscription({
            preapprovalPlanId: plan.mp_preapproval_plan_id,
            payerEmail: user.email ?? "",
            externalReference: `${sub.id}`,
        });

        // Save MP preapproval ID
        await db
            .from("subscriptions")
            .update({ mp_preapproval_id: mpSub.id })
            .eq("id", sub.id);

        return NextResponse.json({
            ok: true,
            init_point: mpSub.init_point,
            subscription_id: sub.id,
        });
    } catch (err) {
        // Cleanup failed sub
        await db.from("subscriptions").delete().eq("id", sub.id);
        console.error("[subscribe] MP error:", err);
        return NextResponse.json(
            { error: "Error al conectar con MercadoPago" },
            { status: 502 }
        );
    }
}
