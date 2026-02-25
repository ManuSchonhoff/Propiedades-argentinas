/**
 * POST /api/boosts/create-preference
 * Creates a Checkout Pro preference for a listing boost.
 */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { createBoostPreference } from "@/lib/mercadopago/mp";

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

    const { listing_id, boost_product_id } = await req.json();
    if (!listing_id || !boost_product_id) {
        return NextResponse.json(
            { error: "listing_id y boost_product_id requeridos" },
            { status: 400 }
        );
    }

    // Verify listing belongs to user
    const { data: listing } = await db
        .from("listings")
        .select("id, title, owner_id")
        .eq("id", listing_id)
        .single();

    if (!listing || listing.owner_id !== user.id) {
        return NextResponse.json({ error: "Publicación no encontrada" }, { status: 404 });
    }

    // Check no active boost on this listing
    const { data: activeBoost } = await db
        .from("boosts")
        .select("id")
        .eq("listing_id", listing_id)
        .eq("status", "active")
        .gt("ends_at", new Date().toISOString())
        .maybeSingle();

    if (activeBoost) {
        return NextResponse.json(
            { error: "Esta publicación ya tiene un boost activo" },
            { status: 409 }
        );
    }

    // Get boost product
    const { data: product } = await db
        .from("boost_products")
        .select("id, code, name, price_ars, duration_hours")
        .eq("id", boost_product_id)
        .single();

    if (!product) {
        return NextResponse.json({ error: "Producto boost no encontrado" }, { status: 404 });
    }

    // Create pending boost row
    const { data: boost, error: boostErr } = await db
        .from("boosts")
        .insert({
            listing_id,
            user_id: user.id,
            boost_product_id: product.id,
            status: "pending",
        })
        .select("id")
        .single();

    if (boostErr || !boost) {
        return NextResponse.json({ error: "Error al crear boost" }, { status: 500 });
    }

    // Create MP preference
    try {
        const pref = await createBoostPreference({
            boostId: boost.id,
            title: `${product.name} — ${listing.title}`,
            priceArs: product.price_ars,
            payerEmail: user.email ?? undefined,
        });

        return NextResponse.json({
            ok: true,
            init_point: pref.init_point,
            sandbox_init_point: pref.sandbox_init_point,
            boost_id: boost.id,
        });
    } catch (err) {
        // Cleanup
        await db.from("boosts").delete().eq("id", boost.id);
        console.error("[boost] MP error:", err);
        return NextResponse.json(
            { error: "Error al conectar con MercadoPago" },
            { status: 502 }
        );
    }
}
