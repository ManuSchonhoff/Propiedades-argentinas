/**
 * POST /api/boosts/request
 * Creates a manual boost request (status = manual_pending).
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAuth } from "@/lib/supabase/auth";

export async function POST(req: NextRequest) {
    const sb = await supabaseAuth();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { listing_id, boost_product_id } = await req.json();
    if (!listing_id || !boost_product_id) {
        return NextResponse.json(
            { error: "listing_id y boost_product_id requeridos" },
            { status: 400 }
        );
    }

    // Verify listing belongs to user
    const { data: listing } = await sb
        .from("listings")
        .select("id, title, owner_id")
        .eq("id", listing_id)
        .single();

    if (!listing || listing.owner_id !== user.id) {
        return NextResponse.json({ error: "Publicación no encontrada" }, { status: 404 });
    }

    // Check no active or pending boost on this listing
    const { data: existingBoost } = await sb
        .from("boosts")
        .select("id, status")
        .eq("listing_id", listing_id)
        .in("status", ["active", "manual_pending"])
        .maybeSingle();

    if (existingBoost?.status === "active") {
        return NextResponse.json(
            { error: "Esta publicación ya tiene un boost activo" },
            { status: 409 }
        );
    }

    if (existingBoost?.status === "manual_pending") {
        return NextResponse.json(
            { error: "Ya hay una solicitud de boost pendiente para esta publicación" },
            { status: 409 }
        );
    }

    // Verify boost product exists
    const { data: product } = await sb
        .from("boost_products")
        .select("id, code, name")
        .eq("id", boost_product_id)
        .single();

    if (!product) {
        return NextResponse.json({ error: "Producto boost no encontrado" }, { status: 404 });
    }

    // Create boost with manual_pending status
    const { data: boost, error: boostErr } = await sb
        .from("boosts")
        .insert({
            listing_id,
            user_id: user.id,
            boost_product_id: product.id,
            status: "manual_pending",
        })
        .select("id")
        .single();

    if (boostErr || !boost) {
        console.error("[boosts/request] Error:", boostErr);
        return NextResponse.json({ error: "Error al crear la solicitud" }, { status: 500 });
    }

    return NextResponse.json({
        ok: true,
        boost_id: boost.id,
        message: `Solicitud de ${product.name} para "${listing.title}" creada. Un administrador la aprobará pronto.`,
    });
}
