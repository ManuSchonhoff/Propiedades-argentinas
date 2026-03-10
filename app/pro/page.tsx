import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Para Inmobiliarias | Propiedades Argentinas",
    description: "Publicá y gestioná tus propiedades. Planes flexibles para inmobiliarias y propietarios.",
};

export default async function ProPage() {
    const db = supabase();
    let plans: { id: string; code: string; name: string; price_ars: number; listing_limit: number }[] = [];
    if (db) {
        const { data } = await db
            .from("plans")
            .select("id, code, name, price_ars, listing_limit")
            .order("price_ars", { ascending: true });
        plans = data ?? [];
    }

    const features = [
        { icon: "📸", title: "Publicación Premium", desc: "Fotos HD, descripción completa y ubicación precisa para cada propiedad." },
        { icon: "⚡", title: "Boosts & Destacados", desc: "Posicioná tus propiedades en los primeros resultados del portal." },
        { icon: "📊", title: "Panel de Gestión", desc: "Estadísticas, mensajes de interesados y control total desde tu dashboard." },
        { icon: "🔍", title: "SEO Optimizado", desc: "Tus propiedades aparecen en Google con metadata y rutas SEO." },
        { icon: "📱", title: "100% Responsive", desc: "Tus publicaciones se ven perfectas en celular, tablet y desktop." },
        { icon: "🤝", title: "Soporte Personalizado", desc: "Te acompañamos en cada paso. WhatsApp directo con nuestro equipo." },
    ];

    const steps = [
        { num: "01", title: "Creá tu cuenta", desc: "Registrate en minutos y accedé a tu panel de publicador." },
        { num: "02", title: "Elegí tu plan", desc: "Seleccioná el plan que mejor se adapte a tu volumen de propiedades." },
        { num: "03", title: "Publicá y crecé", desc: "Subí tus propiedades, destacalas y empezá a recibir consultas." },
    ];

    const faqs = [
        { q: "¿Puedo probar antes de pagar?", a: "Sí. Podés crear tu cuenta y explorar el panel antes de activar un plan." },
        { q: "¿Cómo activo mi plan?", a: "Solicitás la activación desde el panel o por WhatsApp. Un administrador la confirma en minutos." },
        { q: "¿Puedo cambiar de plan?", a: "Sí, podés escalar o reducir tu plan en cualquier momento." },
        { q: "¿Hay contrato de permanencia?", a: "No. Todos los planes son mensuales y podés cancelar cuando quieras." },
    ];

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(price);

    return (
        <main>
            {/* HERO */}
            <section className="pro-hero">
                <div className="site-container">
                    <h1 className="pro-hero-title">
                        La plataforma para<br />
                        <span className="pro-hero-accent">publicar propiedades</span>
                    </h1>
                    <p className="pro-hero-sub">
                        Gestioná tus publicaciones, recibí consultas y destacá tus propiedades en el portal inmobiliario de Argentina.
                    </p>
                    <div className="pro-hero-ctas">
                        <Link href="/registro" className="btn-cta">
                            Crear cuenta gratis
                        </Link>
                        <Link href="#como-funciona" className="btn-outline">
                            Ver cómo funciona
                        </Link>
                    </div>
                </div>
            </section>

            {/* PRODUCTO — Beneficios */}
            <section id="producto" className="pro-section">
                <div className="site-container">
                    <h2 className="pro-section-title">Todo lo que necesitás</h2>
                    <p className="pro-section-sub">Herramientas profesionales para publicar y gestionar tus propiedades.</p>
                    <div className="pro-features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="pro-feature-card">
                                <span className="pro-feature-icon">{f.icon}</span>
                                <h3 className="pro-feature-title">{f.title}</h3>
                                <p className="pro-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CÓMO FUNCIONA */}
            <section id="como-funciona" className="pro-section pro-section--alt">
                <div className="site-container">
                    <h2 className="pro-section-title">Cómo funciona</h2>
                    <div className="pro-steps">
                        {steps.map((s, i) => (
                            <div key={i} className="pro-step">
                                <span className="pro-step-num">{s.num}</span>
                                <h3 className="pro-step-title">{s.title}</h3>
                                <p className="pro-step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLANES */}
            <section id="planes" className="pro-section">
                <div className="site-container">
                    <h2 className="pro-section-title">Planes</h2>
                    <p className="pro-section-sub">Todos los precios en pesos argentinos. Sin contratos de permanencia.</p>
                    {plans.length > 0 ? (
                        <div className="pricing-grid">
                            {plans.map((plan, i) => (
                                <div key={plan.id} className={`pricing-card${i === 1 ? " pricing-card--popular" : ""}`}>
                                    {i === 1 && <span className="pricing-badge">Más popular</span>}
                                    <h3 className="pricing-card__name">{plan.name}</h3>
                                    <div className="pricing-card__price">
                                        <span className="pricing-card__amount">{formatPrice(plan.price_ars)}</span>
                                        <span className="pricing-card__period">/mes</span>
                                    </div>
                                    <ul className="pricing-card__features">
                                        <li>✓ {plan.listing_limit} publicaciones activas</li>
                                        <li>✓ Panel de gestión</li>
                                        {i >= 1 && <li>✓ Soporte prioritario</li>}
                                        {i >= 1 && <li>✓ Estadísticas</li>}
                                        {i >= 2 && <li>✓ Destacados incluidos</li>}
                                    </ul>
                                    <Link
                                        href={`/pro/planes?plan=${plan.code}`}
                                        className={`pricing-card__cta ${i === 1 ? "btn-cta" : "btn-outline"}`}
                                    >
                                        Elegir plan
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="pro-section-sub">Los planes estarán disponibles pronto.</p>
                    )}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="pro-section pro-section--alt">
                <div className="site-container">
                    <h2 className="pro-section-title">Preguntas Frecuentes</h2>
                    <div className="pro-faq-list">
                        {faqs.map((f, i) => (
                            <details key={i} className="pro-faq-item">
                                <summary className="pro-faq-q">{f.q}</summary>
                                <p className="pro-faq-a">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="pro-section pro-cta-final">
                <div className="site-container" style={{ textAlign: "center" }}>
                    <h2 className="pro-section-title">¿Listo para empezar?</h2>
                    <p className="pro-section-sub">Creá tu cuenta y publicá tu primera propiedad hoy.</p>
                    <Link href="/registro" className="btn-cta" style={{ marginTop: "1.5rem", display: "inline-block" }}>
                        Crear cuenta gratis
                    </Link>
                </div>
            </section>
        </main>
    );
}
