import { supabase } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";

export const metadata = {
    title: "Planes — Propiedades Argentinas",
    description: "Elegí el plan ideal para tu inmobiliaria. Publicá propiedades y destacalas.",
};

export default async function PricingPage() {
    const db = supabase();
    let plans: { id: string; code: string; name: string; price_ars: number; listing_limit: number }[] = [];

    if (db) {
        const { data } = await db
            .from("plans")
            .select("id, code, name, price_ars, listing_limit")
            .order("price_ars", { ascending: true });
        plans = data ?? [];
    }

    return (
        <>
            <Navbar />
            <main className="pricing-page">
                <section className="pricing-hero">
                    <h1>Planes para tu Inmobiliaria</h1>
                    <p>Elegí el plan que mejor se adapte a tu negocio. Todos los precios en pesos argentinos.</p>
                </section>
                {plans.length > 0 ? (
                    <PricingCards plans={plans} />
                ) : (
                    <p className="pricing-empty">Los planes estarán disponibles pronto.</p>
                )}
            </main>
            <Footer />
        </>
    );
}
