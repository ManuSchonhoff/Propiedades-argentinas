/**
 * POST /api/billing/request-subscription
 * Creates a manual subscription request (status = manual_pending).
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAuth } from "@/lib/supabase/auth";

export async function POST(req: NextRequest) {
    const sb = await supabaseAuth();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { plan_id } = await req.json();
    if (!plan_id) {
        return NextResponse.json({ error: "plan_id requerido" }, { status: 400 });
    }

    // Verify plan exists
    const { data: plan } = await sb
        .from("plans")
        .select("id, code, name")
        .eq("id", plan_id)
        .single();

    if (!plan) {
        return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    // Check for existing active or pending subscription
    const { data: existingSub } = await sb
        .from("subscriptions")
        .select("id, status")
        .eq("user_id", user.id)
        .in("status", ["authorized", "manual_pending"])
        .maybeSingle();

    if (existingSub?.status === "authorized") {
        return NextResponse.json(
            { error: "Ya tenés una suscripción activa. Cancelá primero para cambiar de plan." },
            { status: 409 }
        );
    }

    if (existingSub?.status === "manual_pending") {
        return NextResponse.json(
            { error: "Ya tenés una solicitud pendiente. Esperá la aprobación o contactanos por WhatsApp." },
            { status: 409 }
        );
    }

    // Create subscription with manual_pending status
    const { data: sub, error: subErr } = await sb
        .from("subscriptions")
        .insert({
            user_id: user.id,
            plan_id: plan.id,
            status: "manual_pending",
        })
        .select("id")
        .single();

    if (subErr || !sub) {
        console.error("[request-subscription] Error:", subErr);
        return NextResponse.json({ error: "Error al crear la solicitud" }, { status: 500 });
    }

    return NextResponse.json({
        ok: true,
        subscription_id: sub.id,
        message: `Solicitud de ${plan.name} creada. Un administrador la aprobará pronto.`,
    });
}
