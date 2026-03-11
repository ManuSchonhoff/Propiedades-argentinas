"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { PricingSection } from "@/components/ui/pricing-section";

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

    const tiers = plans.map((plan, i) => {
        const isHighlight = i === 1; // "Most popular" for the middle plan
        const iconClasses = `w-6 h-6 ${isHighlight ? "text-zinc-900" : "text-zinc-600"}`;

        const mappedFeatures = (features[plan.code] ?? [`${plan.listing_limit} publicaciones activas`]).map((f) => ({
            name: f,
            included: true
        }));

        return {
            name: plan.name,
            price: {
                monthly: plan.price_ars,
                yearly: Math.floor((plan.price_ars * 12) * 0.8) // Simulated yearly logic (no active toggle rn)
            },
            highlight: isHighlight,
            badge: isHighlight ? "Más Popular" : undefined,
            features: mappedFeatures,
            loading: loading === plan.id,
            buttonText: selectedPlan === plan.code ? "Plan Seleccionado (Solicitar)" : "Activar plan",
            onAction: () => handleRequest(plan.id, plan.name),
            secondaryAction: (
                <a
                    href={whatsappLink(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors inline-flex items-center gap-1.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                    Hablar por WhatsApp
                </a>
            )
        };
    });

    return (
        <div className="w-full">
            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium max-w-lg mx-auto border border-red-100">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-8 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-center font-medium max-w-lg mx-auto border border-emerald-100">
                    {success}
                </div>
            )}

            <PricingSection
                title=""
                subtitle=""
                hideToggle={true}
                tiers={tiers}
            />

            {hasAuthorized && (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <button
                        className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-medium transition-colors shadow-lg shadow-zinc-900/20"
                        onClick={() => router.push(nextUrl)}
                    >
                        Continuar a publicar →
                    </button>
                </div>
            )}
        </div>
    );
}
