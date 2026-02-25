/**
 * POST /api/mercadopago/webhook
 * Receives MP notifications, validates signature, logs event, processes.
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateWebhookSignature, getPaymentInfo, getSubscriptionStatus } from "@/lib/mercadopago/mp";

export async function POST(req: NextRequest) {
    const db = supabaseAdmin();
    if (!db) {
        return NextResponse.json({ error: "DB not configured" }, { status: 500 });
    }

    // Extract headers & query params
    const xSignature = req.headers.get("x-signature") ?? "";
    const xRequestId = req.headers.get("x-request-id") ?? "";
    const body = await req.json().catch(() => ({}));

    const dataId = (body?.data?.id ?? req.nextUrl.searchParams.get("data.id") ?? "").toString();
    const topic = body?.type ?? body?.topic ?? req.nextUrl.searchParams.get("type") ?? req.nextUrl.searchParams.get("topic") ?? "unknown";

    // Validate signature
    if (xSignature && dataId) {
        const valid = validateWebhookSignature({ xSignature, xRequestId, dataId });
        if (!valid) {
            console.error("[webhook] Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
    }

    // Idempotency: check if already processed
    const { data: existing } = await db
        .from("mp_webhook_events")
        .select("id, processed")
        .eq("topic", topic)
        .eq("resource_id", dataId)
        .maybeSingle();

    if (existing?.processed) {
        return NextResponse.json({ ok: true, message: "Already processed" });
    }

    // Log event (upsert for idempotency)
    await db.from("mp_webhook_events").upsert(
        {
            topic,
            resource_id: dataId,
            payload: body,
            received_at: new Date().toISOString(),
            processed: false,
        },
        { onConflict: "topic,resource_id" }
    );

    try {
        // ─── Process subscription events ─────────────────
        if (topic === "subscription_preapproval" || topic === "subscription_authorized_payment") {
            await processSubscriptionEvent(db, dataId);
        }

        // ─── Process payment events (boost) ──────────────
        if (topic === "payment") {
            await processPaymentEvent(db, dataId);
        }

        // Mark as processed
        await db
            .from("mp_webhook_events")
            .update({ processed: true })
            .eq("topic", topic)
            .eq("resource_id", dataId);
    } catch (err) {
        console.error("[webhook] Processing error:", err);
        // Don't fail — MP will retry
    }

    return NextResponse.json({ ok: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processSubscriptionEvent(db: any, preapprovalId: string) {
    const mpData = await getSubscriptionStatus(preapprovalId);

    // Map MP status to our status
    const statusMap: Record<string, string> = {
        authorized: "authorized",
        pending: "pending",
        paused: "paused",
        cancelled: "cancelled",
        expired: "expired",
    };
    const status = statusMap[mpData.status] ?? "pending";

    // Find subscription by mp_preapproval_id
    const { data: sub } = await db
        .from("subscriptions")
        .select("id")
        .eq("mp_preapproval_id", preapprovalId)
        .maybeSingle();

    if (sub) {
        await db
            .from("subscriptions")
            .update({
                status,
                current_period_end: mpData.next_payment_date ?? null,
            })
            .eq("id", sub.id);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processPaymentEvent(db: any, paymentId: string) {
    const payment = await getPaymentInfo(paymentId);

    if (payment.status !== "approved") return;

    const boostId = payment.external_reference;
    if (!boostId) return;

    // Find boost by id (external_reference = boost.id)
    const { data: boost } = await db
        .from("boosts")
        .select("id, boost_product_id")
        .eq("id", boostId)
        .eq("status", "pending")
        .maybeSingle();

    if (!boost) return;

    // Get duration
    const { data: product } = await db
        .from("boost_products")
        .select("duration_hours")
        .eq("id", boost.boost_product_id)
        .single();

    const now = new Date();
    const endsAt = new Date(now.getTime() + (product?.duration_hours ?? 24) * 60 * 60 * 1000);

    await db
        .from("boosts")
        .update({
            status: "active",
            starts_at: now.toISOString(),
            ends_at: endsAt.toISOString(),
            mp_payment_id: paymentId,
        })
        .eq("id", boost.id);
}
