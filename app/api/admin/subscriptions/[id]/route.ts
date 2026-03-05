/**
 * PATCH /api/admin/subscriptions/[id]
 * Admin-only: update subscription status (authorize, pause, cancel).
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAuth } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Auth check
    const sb = await supabaseAuth();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await sb
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { status } = await req.json();
    const validStatuses = ["authorized", "paused", "cancelled"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { error: `Status inválido. Valores permitidos: ${validStatuses.join(", ")}` },
            { status: 400 }
        );
    }

    // Use admin client to bypass RLS
    const admin = supabaseAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Service role not configured" }, { status: 500 });
    }

    const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
    };

    const { data: sub, error: updateErr } = await admin
        .from("subscriptions")
        .update(updateData)
        .eq("id", id)
        .select("id, status, user_id")
        .single();

    if (updateErr || !sub) {
        console.error("[admin/subscriptions] Error:", updateErr);
        return NextResponse.json({ error: "Error al actualizar suscripción" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, subscription: sub });
}
