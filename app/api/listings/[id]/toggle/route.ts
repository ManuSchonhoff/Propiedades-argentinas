import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();

    const sb = createServerClient(url, key, {
        cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) {
                try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { }
            },
        },
    });

    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Get current status
    const { data: listing } = await sb
        .from("listings")
        .select("status, owner_id")
        .eq("id", id)
        .single();

    if (!listing || listing.owner_id !== user.id) {
        return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const newStatus = listing.status === "active" ? "paused" : "active";

    const { error } = await sb
        .from("listings")
        .update({ status: newStatus })
        .eq("id", id)
        .eq("owner_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Redirect back to dashboard
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_SUPABASE_URL ? undefined : "http://localhost:3000"), 303);
}
