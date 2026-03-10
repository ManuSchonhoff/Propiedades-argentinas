import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Elegí tu perfil | Propiedades Argentinas",
    description: "¿Buscás propiedades o querés publicar? Elegí cómo querés usar Propiedades Argentinas.",
};

export default function AuthSelectorPage() {
    return (
        <>
            <Navbar />
            <main className="auth-container">
                <div className="auth-selector">
                    <h1 className="auth-selector-title">¿Cómo querés usar la plataforma?</h1>
                    <p className="auth-selector-sub">Elegí tu perfil para personalizar tu experiencia.</p>

                    <div className="auth-selector-cards">
                        {/* Buyer */}
                        <Link href="/login" className="auth-role-card">
                            <span className="auth-role-icon">🔍</span>
                            <h2 className="auth-role-title">Buscar propiedades</h2>
                            <p className="auth-role-desc">
                                Explorá el catálogo, guardá favoritos y contactá a publicadores.
                            </p>
                            <span className="auth-role-cta">Ingresar como comprador →</span>
                        </Link>

                        {/* Publisher */}
                        <Link href="/pro" className="auth-role-card auth-role-card--pro">
                            <span className="auth-role-icon">📋</span>
                            <h2 className="auth-role-title">Publicar propiedades</h2>
                            <p className="auth-role-desc">
                                Gestioná tus publicaciones, destacá propiedades y recibí consultas.
                            </p>
                            <span className="auth-role-cta">Ver planes para publicadores →</span>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
