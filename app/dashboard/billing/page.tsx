import { supabaseAuth } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Mi Plan — Dashboard",
};

const WA_NUMBER = "5491100000000"; // TODO: Replace with real WhatsApp number

export default async function BillingPage() {
    const sb = await supabaseAuth();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return redirect("/login");

    // Get active or pending subscription
    const { data: sub } = await sb
        .from("subscriptions")
        .select("id, status, created_at, updated_at, plan_id, plans(code, name, price_ars, listing_limit)")
        .eq("user_id", user.id)
        .in("status", ["authorized", "manual_pending", "paused"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    // Count active listings
    const { count: activeListings } = await sb
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
        manual_pending: "⏳ Pendiente de aprobación",
        paused: "⏸️ Pausada",
        cancelled: "❌ Cancelada",
        expired: "⌛ Expirada",
        pending: "⏳ Pendiente",
    };

    const waLink = plan
        ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola! Solicité el ${plan.name} y estoy esperando aprobación. Mi email: ${user.email}`)}`
        : `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola! Quiero información sobre los planes de Propiedades Argentinas.")}`;

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
                            <span className="billing-value">
                                {activeListings ?? 0} / {sub.status === "authorized" ? listingLimit : 1}
                            </span>
                        </div>
                    </div>

                    {sub.status === "manual_pending" && (
                        <div className="billing-pending-notice">
                            <p>Tu solicitud está siendo revisada por un administrador.</p>
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-cta btn-wa">
                                💬 Consultar por WhatsApp
                            </a>
                        </div>
                    )}
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
                    <div className="billing-actions-row">
                        <Link href="/pricing" className="btn-cta">Ver Planes</Link>
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                            💬 WhatsApp
                        </a>
                    </div>
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
