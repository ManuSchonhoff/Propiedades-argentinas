"use client";

import dynamic from "next/dynamic";
import { Spotlight } from "@/components/ui/spotlight";

const SplineScene = dynamic(
    () => import("@/components/ui/splite").then((mod) => ({ default: mod.SplineScene })),
    {
        ssr: false,
        loading: () => (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "var(--text-secondary)" }}>Cargando experiencia 3D...</span>
            </div>
        ),
    }
);

export default function IAContent() {
    return (
        <main className="site-container" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
            {/* Hero with Spline */}
            <div className="ia-hero-banner">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <div style={{ display: "flex", height: "100%" }}>
                    <div className="ia-hero-text">
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                            letterSpacing: "-1px",
                            background: "linear-gradient(to bottom, #fafafa, #a3a3a3)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            Inteligencia Artificial
                        </h1>
                        <p style={{ marginTop: "1rem", color: "#d4d4d4", maxWidth: "400px", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            Pronto podrás buscar propiedades usando lenguaje natural, recibir recomendaciones
                            personalizadas y explorar con un asistente inteligente.
                        </p>
                    </div>
                    <div className="ia-spline-container">
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Features Grid — normalized to site design */}
            <div className="ia-features-grid">
                <article className="ia-feature-card">
                    <span className="ia-feature-icon">🔍</span>
                    <h3 className="ia-feature-title">Búsqueda Natural</h3>
                    <p className="ia-feature-desc">
                        Describí lo que buscás en tus palabras: &ldquo;departamento luminoso en Palermo con balcón&rdquo;
                    </p>
                </article>

                <article className="ia-feature-card">
                    <span className="ia-feature-icon">💡</span>
                    <h3 className="ia-feature-title">Recomendaciones</h3>
                    <p className="ia-feature-desc">
                        El sistema aprende de tus preferencias y te sugiere propiedades relevantes.
                    </p>
                </article>

                <article className="ia-feature-card">
                    <span className="ia-feature-icon">📊</span>
                    <h3 className="ia-feature-title">Análisis de Mercado</h3>
                    <p className="ia-feature-desc">
                        Compará precios, tendencias y valoraciones para tomar mejores decisiones.
                    </p>
                </article>
            </div>

            {/* CTA */}
            <div className="ia-cta">
                <p>Estamos trabajando en esta funcionalidad. ¡Pronto disponible!</p>
                <span className="ia-cta-badge">🚧 Próximamente</span>
            </div>
        </main>
    );
}
