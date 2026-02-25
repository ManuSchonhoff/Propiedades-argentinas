/**
 * Supabase service-role client for server-side operations that bypass RLS.
 * Use ONLY in trusted server contexts (webhooks, admin endpoints).
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function supabaseAdmin() {
    if (!url || !serviceKey) {
        console.warn("[supabaseAdmin] Missing SUPABASE_SERVICE_ROLE_KEY");
        return null;
    }
    return createClient(url, serviceKey);
}
