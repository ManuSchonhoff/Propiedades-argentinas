import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function middleware(request: NextRequest) {
    // Skip if Supabase is not configured
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

    // Protected routes → redirect to /login
    if (
        !user &&
        (path.startsWith("/dashboard") || path.startsWith("/publicar"))
    ) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("next", path);
        return NextResponse.redirect(loginUrl);
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
    matcher: ["/dashboard/:path*", "/publicar/:path*", "/login", "/registro"],
};
