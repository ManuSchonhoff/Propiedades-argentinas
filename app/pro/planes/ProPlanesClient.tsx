"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface Plan {
    id: string;
    code: string;
    name: string;
    price_ars: number;
    listing_limit: number;
}

const WA_NUMBER = "5491100000000";

const features: Record<string, string[]> = {
    S: ["5 publicaciones activas", "Soporte por email", "Panel de gestión"],
    M: ["20 publicaciones activas", "Soporte prioritario", "Estadísticas básicas", "Panel de gestión"],
    L: ["100 publicaciones activas", "Soporte dedicado", "Estadísticas avanzadas", "Panel de gestión", "Destacados incluidos"],
};

export default function ProPlanesClient({
    plans,
    nextUrl,
    selectedPlan,
}: {
    plans: Plan[];
    nextUrl: string;
    selectedPlan: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hasAuthorized, setHasAuthorized] = useState(false);

    useEffect(() => {
        const checkSub = async () => {
            const sb = supabaseBrowser();
            if (!sb) return;
            const { data: { user } } = await sb.auth.getUser();
            if (!user) return;
            const { data: sub } = await sb
                .from("subscriptions")
                .select("status")
                .eq("user_id", user.id)
                .eq("status", "authorized")
                .limit(1)
                .maybeSingle();
            if (sub) setHasAuthorized(true);
        };
        checkSub();
    }, []);

    const handleRequest = async (planId: string, planName: string) => {
        setLoading(planId);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch("/api/billing/request-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan_id: planId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Error al procesar");
                return;
            }
            setSuccess(`✅ Solicitud de ${planName} enviada. Un administrador la aprobará pronto.`);
        } catch {
            setError("Error de conexión");
        } finally {
            setLoading(null);
        }
    };

    const whatsappLink = (plan: Plan) => {
        const msg = encodeURIComponent(
            `Hola! Quiero activar el ${plan.name} ($${plan.price_ars.toLocaleString("es-AR")}/mes) en Propiedades Argentinas.`
        );
        return `https://wa.me/${WA_NUMBER}?text=${msg}`;
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(price);

    return (
        <>
            {error && <p className="pricing-error">{error}</p>}
            {success && <p className="pricing-success">{success}</p>}

            <div className="pricing-grid">
                {plans.map((plan, i) => (
                    <div
                        key={plan.id}
                        className={`pricing-card${i === 1 ? " pricing-card--popular" : ""}${selectedPlan === plan.code ? " pricing-card--selected" : ""}`}
                    >
                        {i === 1 && <span className="pricing-badge">Más popular</span>}
                        <h3 className="pricing-card__name">{plan.name}</h3>
                        <div className="pricing-card__price">
                            <span className="pricing-card__amount">{formatPrice(plan.price_ars)}</span>
                            <span className="pricing-card__period">/mes</span>
                        </div>
                        <ul className="pricing-card__features">
                            {(features[plan.code] ?? [`${plan.listing_limit} publicaciones activas`]).map((f, j) => (
                                <li key={j}>✓ {f}</li>
                            ))}
                        </ul>
                        <button
                            className={`pricing-card__cta ${i === 1 ? "btn-cta" : "btn-outline"}`}
                            onClick={() => handleRequest(plan.id, plan.name)}
                            disabled={loading !== null}
                        >
                            {loading === plan.id ? "Procesando..." : "Solicitar activación"}
                        </button>
                        <a
                            href={whatsappLink(plan)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pricing-card__wa"
                        >
                            💬 Hablar por WhatsApp
                        </a>
                    </div>
                ))}
            </div>

            {hasAuthorized && (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <button
                        className="btn-cta"
                        onClick={() => router.push(nextUrl)}
                    >
                        Continuar a publicar →
                    </button>
                </div>
            )}
        </>
    );
}
