import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase/server";
import ProPlanesClient from "./ProPlanesClient";

export const metadata: Metadata = {
    title: "Planes para Publicadores | Propiedades Argentinas",
    description: "Elegí tu plan y empezá a publicar propiedades.",
};

interface Props {
    searchParams: Promise<{ next?: string; plan?: string }>;
}

export default async function ProPlanesPage({ searchParams }: Props) {
    const params = await searchParams;
    const nextUrl = params.next || "/publicar";
    const selectedPlan = params.plan || "";

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
        <main>
            <section className="pro-section">
                <div className="site-container">
                    <h1 className="pro-section-title">Elegí tu plan</h1>
                    <p className="pro-section-sub">
                        Para publicar propiedades necesitás un plan activo. Elegí el que mejor se adapte a tu negocio.
                    </p>
                    <ProPlanesClient plans={plans} nextUrl={nextUrl} selectedPlan={selectedPlan} />
                </div>
            </section>
        </main>
    );
}
