"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

// Dynamic import — real Spline 3D scene, no SSR
const SplineScene = dynamic(
    () => import("@/components/ui/splite").then((mod) => ({ default: mod.SplineScene })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--text-secondary)]">Cargando experiencia 3D...</span>
            </div>
        ),
    }
);

export default function IAContent() {
    return (
        <main className="max-w-[1600px] mx-auto px-8 py-12">
            {/* Hero with Spline */}
            <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden mb-16">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />

                <div className="flex h-full">
                    {/* Left content */}
                    <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                            Inteligencia Artificial
                        </h1>
                        <p className="mt-4 text-neutral-300 max-w-lg">
                            Pronto podrás buscar propiedades usando lenguaje natural, recibir recomendaciones
                            personalizadas y explorar con un asistente inteligente.
                        </p>
                    </div>

                    {/* Right content — Spline 3D */}
                    <div className="flex-1 relative hidden md:block">
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="p-8 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-colors">
                    <div className="text-3xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Búsqueda Natural
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        Describí lo que buscás en tus palabras: &ldquo;departamento luminoso en Palermo con balcón&rdquo;
                    </p>
                </div>

                <div className="p-8 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-colors">
                    <div className="text-3xl mb-4">💡</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Recomendaciones
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        El sistema aprende de tus preferencias y te sugiere propiedades relevantes.
                    </p>
                </div>

                <div className="p-8 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-colors">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        Análisis de Mercado
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        Compará precios, tendencias y valoraciones para tomar mejores decisiones.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center py-12 border-t border-neutral-100">
                <p className="text-[var(--text-secondary)] mb-4">
                    Estamos trabajando en esta funcionalidad. ¡Pronto disponible!
                </p>
                <span className="inline-block px-6 py-3 bg-neutral-100 rounded-full text-sm font-medium text-[var(--text-secondary)]">
                    🚧 Próximamente
                </span>
            </div>
        </main>
    );
}
