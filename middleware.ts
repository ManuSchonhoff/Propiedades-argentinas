import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function middleware(request: NextRequest) {
    if (!url || !key) return NextResponse.next();

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Protected routes → redirect to /auth if not logged in
    if (
        !user &&
        (path.startsWith("/dashboard") || path.startsWith("/publicar") || path.startsWith("/admin"))
    ) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/auth";
        loginUrl.searchParams.set("next", path);
        return NextResponse.redirect(loginUrl);
    }

    // Plan gate for /publicar — logged in but no authorized subscription → redirect to /pro/planes
    if (user && path.startsWith("/publicar")) {
        const { data: sub } = await supabase
            .from("subscriptions")
            .select("status")
            .eq("user_id", user.id)
            .eq("status", "authorized")
            .limit(1)
            .maybeSingle();

        if (!sub) {
            const planesUrl = request.nextUrl.clone();
            planesUrl.pathname = "/pro/planes";
            planesUrl.searchParams.set("next", "/publicar");
            return NextResponse.redirect(planesUrl);
        }
    }

    // Auth pages → redirect to /dashboard if logged in
    if (
        user &&
        (path.startsWith("/login") || path.startsWith("/registro"))
    ) {
        const dashUrl = request.nextUrl.clone();
        dashUrl.pathname = "/dashboard";
        return NextResponse.redirect(dashUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/dashboard/:path*", "/publicar/:path*", "/admin/:path*", "/login", "/registro"],
};
