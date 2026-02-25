import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { listing_id, name, phone, email, message } = body;

        /* ---- Validación mínima ---- */
        if (!listing_id || !name) {
            return NextResponse.json(
                { ok: false, error: "listing_id y name son obligatorios" },
                { status: 400 }
            );
        }

        const db = supabase();
        if (!db) {
            return NextResponse.json(
                { ok: false, error: "Supabase no configurado" },
                { status: 500 }
            );
        }
        const { error } = await db.from("leads").insert({
            listing_id,
            name,
            phone: phone || null,
            email: email || null,
            message: message || null,
        });

        if (error) {
            console.error("Supabase insert lead error:", error);
            return NextResponse.json(
                { ok: false, error: "Error al guardar la consulta" },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json(
            { ok: false, error: "Datos inválidos" },
            { status: 400 }
        );
    }
}
