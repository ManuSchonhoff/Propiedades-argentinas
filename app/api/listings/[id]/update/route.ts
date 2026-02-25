import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();

    const sb = createServerClient(url, key, {
        cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) {
                try { cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) => cookieStore.set(name, value, options)); } catch { }
            },
        },
    });

    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await request.json();

    const { error } = await sb
        .from("listings")
        .update({
            title: body.title,
            op: body.op,
            property_type: body.property_type,
            price: body.price,
            currency: body.currency,
            province: body.province,
            city: body.city,
            location_text: body.location_text,
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            area_m2: body.area_m2,
            description: body.description,
        })
        .eq("id", id)
        .eq("owner_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
}
