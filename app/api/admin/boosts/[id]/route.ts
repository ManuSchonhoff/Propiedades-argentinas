/**
 * PATCH /api/admin/boosts/[id]
 * Admin-only: approve, cancel, or expire a boost.
 * When approving: sets starts_at/ends_at based on boost_product duration.
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
    const validStatuses = ["active", "cancelled", "expired"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { error: `Status inválido. Valores permitidos: ${validStatuses.join(", ")}` },
            { status: 400 }
        );
    }

    const admin = supabaseAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Service role not configured" }, { status: 500 });
    }

    // Get boost with product info for duration
    const { data: boost } = await admin
        .from("boosts")
        .select("id, listing_id, boost_product_id, boost_products(duration_hours)")
        .eq("id", id)
        .single();

    if (!boost) {
        return NextResponse.json({ error: "Boost no encontrado" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const durationHours = (boost as any).boost_products?.duration_hours ?? 24;

    const updateData: Record<string, unknown> = { status };

    if (status === "active") {
        const now = new Date();
        const endsAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
        updateData.starts_at = now.toISOString();
        updateData.ends_at = endsAt.toISOString();

        // Expire any other active boosts on the same listing
        await admin
            .from("boosts")
            .update({ status: "expired" })
            .eq("listing_id", boost.listing_id)
            .eq("status", "active")
            .neq("id", id);
    }

    const { data: updated, error: updateErr } = await admin
        .from("boosts")
        .update(updateData)
        .eq("id", id)
        .select("id, status, starts_at, ends_at")
        .single();

    if (updateErr || !updated) {
        console.error("[admin/boosts] Error:", updateErr);
        return NextResponse.json({ error: "Error al actualizar boost" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, boost: updated });
}
