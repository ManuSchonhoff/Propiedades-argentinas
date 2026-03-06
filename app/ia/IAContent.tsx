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
            <div style={{
                width: "100%",
                height: "420px",
                background: "rgba(0,0,0,0.96)",
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                marginBottom: "3rem",
                border: "1px solid #333",
            }}>
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />

                <div style={{ display: "flex", height: "100%" }}>
                    {/* Left */}
                    <div style={{ flex: 1, padding: "2.5rem", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center" }}>
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

                    {/* Right — Spline 3D (desktop only) */}
                    <div className="ia-spline-container">
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="ia-features-grid">
                <div className="ia-feature-card">
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                        Búsqueda Natural
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                        Describí lo que buscás en tus palabras: &ldquo;departamento luminoso en Palermo con balcón&rdquo;
                    </p>
                </div>

                <div className="ia-feature-card">
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💡</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                        Recomendaciones
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                        El sistema aprende de tus preferencias y te sugiere propiedades relevantes.
                    </p>
                </div>

                <div className="ia-feature-card">
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📊</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                        Análisis de Mercado
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                        Compará precios, tendencias y valoraciones para tomar mejores decisiones.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center", padding: "3rem 0 1rem", borderTop: "1px solid #f0f0f0" }}>
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                    Estamos trabajando en esta funcionalidad. ¡Pronto disponible!
                </p>
                <span style={{
                    display: "inline-block",
                    padding: "0.5rem 1.25rem",
                    background: "#f5f5f5",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                }}>
                    🚧 Próximamente
                </span>
            </div>
        </main>
    );
}
