/**
 * MercadoPago server-side helper (REST API — no SDK).
 * All prices in ARS.  Server-only: never import in client components.
 */

import crypto from "crypto";

const MP_BASE = "https://api.mercadopago.com";

function getAccessToken(): string {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) throw new Error("MP_ACCESS_TOKEN not configured");
    return token;
}

function getBaseUrl(): string {
    return (
        process.env.APP_BASE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    );
}

async function mpFetch<T = unknown>(
    path: string,
    options: { method?: string; body?: unknown; idempotencyKey?: string } = {}
): Promise<T> {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
    };
    if (options.idempotencyKey) {
        headers["X-Idempotency-Key"] = options.idempotencyKey;
    }
    const res = await fetch(`${MP_BASE}${path}`, {
        method: options.method ?? "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`MP API ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
}

// ─── Preapproval Plans (create once) ─────────────────────────
interface MPPlanResponse {
    id: string;
    init_point: string;
    [key: string]: unknown;
}

export async function createPreapprovalPlan(plan: {
    code: string;
    name: string;
    priceArs: number;
}): Promise<MPPlanResponse> {
    return mpFetch<MPPlanResponse>("/preapproval_plan", {
        method: "POST",
        body: {
            reason: plan.name,
            auto_recurring: {
                frequency: 1,
                frequency_type: "months",
                transaction_amount: plan.priceArs,
                currency_id: "ARS",
            },
            back_url: `${getBaseUrl()}/dashboard/billing`,
        },
        idempotencyKey: `plan-${plan.code}`,
    });
}

// ─── Subscriptions (per user) ────────────────────────────────
interface MPSubscriptionResponse {
    id: string;
    init_point: string;
    status: string;
    [key: string]: unknown;
}

export async function createSubscription(opts: {
    preapprovalPlanId: string;
    payerEmail: string;
    externalReference: string;
}): Promise<MPSubscriptionResponse> {
    return mpFetch<MPSubscriptionResponse>("/preapproval", {
        method: "POST",
        body: {
            preapproval_plan_id: opts.preapprovalPlanId,
            payer_email: opts.payerEmail,
            external_reference: opts.externalReference,
            back_url: `${getBaseUrl()}/dashboard/billing`,
            status: "pending",
        },
        idempotencyKey: `sub-${opts.externalReference}`,
    });
}

export async function getSubscriptionStatus(
    preapprovalId: string
): Promise<{ status: string; next_payment_date?: string;[key: string]: unknown }> {
    return mpFetch(`/preapproval/${preapprovalId}`);
}

// ─── Checkout Pro (Boost) ────────────────────────────────────
interface MPPreferenceResponse {
    id: string;
    init_point: string;
    sandbox_init_point: string;
    [key: string]: unknown;
}

export async function createBoostPreference(opts: {
    boostId: string;
    title: string;
    priceArs: number;
    payerEmail?: string;
}): Promise<MPPreferenceResponse> {
    return mpFetch<MPPreferenceResponse>("/checkout/preferences", {
        method: "POST",
        body: {
            items: [
                {
                    title: opts.title,
                    quantity: 1,
                    unit_price: opts.priceArs,
                    currency_id: "ARS",
                },
            ],
            external_reference: opts.boostId,
            notification_url: `${getBaseUrl()}/api/mercadopago/webhook`,
            back_urls: {
                success: `${getBaseUrl()}/dashboard?boost=success`,
                failure: `${getBaseUrl()}/dashboard?boost=failure`,
                pending: `${getBaseUrl()}/dashboard?boost=pending`,
            },
            auto_return: "approved",
            ...(opts.payerEmail ? { payer: { email: opts.payerEmail } } : {}),
        },
        idempotencyKey: `boost-${opts.boostId}`,
    });
}

// ─── Webhook Signature Validation ────────────────────────────
export function validateWebhookSignature(opts: {
    xSignature: string;
    xRequestId: string;
    dataId: string;
}): boolean {
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (!secret) {
        console.warn("MP_WEBHOOK_SECRET not set — skipping validation");
        return true; // allow in dev
    }

    // Parse ts and v1 from x-signature header
    const parts: Record<string, string> = {};
    opts.xSignature.split(",").forEach((part) => {
        const [key, ...val] = part.split("=");
        parts[key.trim()] = val.join("=").trim();
    });

    const ts = parts["ts"];
    const v1 = parts["v1"];
    if (!ts || !v1) return false;

    // CRITICAL: data.id must be lowercase for validation
    const dataIdLower = opts.dataId.toLowerCase();

    const manifest = `id:${dataIdLower};request-id:${opts.xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    return hmac === v1;
}

// ─── Payment info ────────────────────────────────────────────
export async function getPaymentInfo(
    paymentId: string
): Promise<{ status: string; external_reference?: string;[key: string]: unknown }> {
    return mpFetch(`/v1/payments/${paymentId}`);
}
