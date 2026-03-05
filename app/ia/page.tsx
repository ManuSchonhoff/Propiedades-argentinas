import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Asistente IA | Propiedades Argentinas",
    description: "Usá inteligencia artificial para encontrar tu propiedad ideal en Argentina. Búsqueda inteligente y recomendaciones personalizadas.",
};

// Dynamic import for Spline — no SSR
const SplineScene = dynamic(() => import("@/components/ui/spline-scene"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[400px] bg-neutral-50 rounded-2xl animate-pulse">
            <span className="text-[var(--text-secondary)]">Cargando experiencia 3D...</span>
        </div>
    ),
});

export default function IAPage() {
    return (
        <>
            <Navbar />
            <main className="max-w-[1600px] mx-auto px-8 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h1
                        className="text-5xl font-bold tracking-tight mb-4"
                        style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px" }}
                    >
                        Inteligencia Artificial
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Pronto podrás buscar propiedades usando lenguaje natural, recibir recomendaciones
                        personalizadas y explorar con un asistente inteligente.
                    </p>
                </div>

                {/* 3D Scene */}
                <div className="mb-16 rounded-2xl overflow-hidden border border-neutral-200">
                    <SplineScene />
                </div>

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
            <Footer />
        </>
    );
}
