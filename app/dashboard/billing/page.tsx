import { supabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Mi Plan — Dashboard",
};

export default async function BillingPage() {
    const db = supabase();
    if (!db) return redirect("/login");

    const { data: { user } } = await db.auth.getUser();
    if (!user) return redirect("/login");

    // Get active subscription
    const { data: sub } = await db
        .from("subscriptions")
        .select("id, status, current_period_end, plan_id, plans(code, name, price_ars, listing_limit)")
        .eq("user_id", user.id)
        .in("status", ["authorized", "pending", "paused"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    // Count active listings
    const { count: activeListings } = await db
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id)
        .eq("status", "active");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = sub ? (sub as any).plans : null;
    const listingLimit = plan?.listing_limit ?? 1;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(price);

    const statusLabels: Record<string, string> = {
        authorized: "✅ Activa",
        pending: "⏳ Pendiente",
        paused: "⏸️ Pausada",
        cancelled: "❌ Cancelada",
        expired: "⌛ Expirada",
    };

    return (
        <main className="billing-page">
            <div className="billing-header">
                <h1>Mi Plan</h1>
                <Link href="/dashboard" className="btn-outline btn-sm">← Volver al panel</Link>
            </div>

            {sub && plan ? (
                <div className="billing-card">
                    <div className="billing-plan-info">
                        <h2>{plan.name}</h2>
                        <span className={`billing-status billing-status--${sub.status}`}>
                            {statusLabels[sub.status] ?? sub.status}
                        </span>
                    </div>
                    <div className="billing-details">
                        <div className="billing-detail">
                            <span className="billing-label">Precio</span>
                            <span className="billing-value">{formatPrice(plan.price_ars)}/mes</span>
                        </div>
                        <div className="billing-detail">
                            <span className="billing-label">Publicaciones</span>
                            <span className="billing-value">{activeListings ?? 0} / {listingLimit}</span>
                        </div>
                        {sub.current_period_end && (
                            <div className="billing-detail">
                                <span className="billing-label">Próximo cobro</span>
                                <span className="billing-value">
                                    {new Date(sub.current_period_end).toLocaleDateString("es-AR")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="billing-card billing-card--empty">
                    <h2>Sin plan activo</h2>
                    <p>
                        Actualmente podés publicar hasta <strong>1 propiedad</strong>.
                        Elegí un plan para publicar más.
                    </p>
                    <div className="billing-detail">
                        <span className="billing-label">Publicaciones</span>
                        <span className="billing-value">{activeListings ?? 0} / 1</span>
                    </div>
                    <Link href="/pricing" className="btn-cta">Ver Planes</Link>
                </div>
            )}

            {sub && (
                <div className="billing-actions">
                    <Link href="/pricing" className="btn-outline">Cambiar Plan</Link>
                </div>
            )}
        </main>
    );
}
