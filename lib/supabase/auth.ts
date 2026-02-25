import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Supabase client aware of the user's session (cookies).
 * Use in Server Components, Server Actions, and Route Handlers.
 */
export async function supabaseAuth() {
    const cookieStore = await cookies();

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // setAll can fail in Server Components (read-only).
                    // This is expected — cookies are set by middleware instead.
                }
            },
        },
    });
}
