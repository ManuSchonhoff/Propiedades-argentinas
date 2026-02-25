import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFloater from "@/components/SearchFloater";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase/server";
import { toPropertyView } from "@/lib/supabase/types";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 60;

async function getFeaturedProperties() {
    const db = supabase();
    if (!db) return [];

    const { data: listings, error } = await db
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

    if (error || !listings) return [];

    const ids = listings.map((l: ListingRow) => l.id);
    const { data: media } = await db
        .from("listing_media")
        .select("*")
        .in("listing_id", ids)
        .order("sort_order", { ascending: true });

    return listings.map((listing: ListingRow) => {
        const listingMedia = (media ?? []).filter(
            (m: ListingMediaRow) => m.listing_id === listing.id
        );
        return toPropertyView(listing, listingMedia);
    });
}

export default async function Home() {
    const featured = await getFeaturedProperties();

    return (
        <>
            <Navbar />
            <Hero />

            <div className="hero-banner-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/exterior.png"
                    alt="Mansión Moderna"
                    className="hero-banner"
                />
                <SearchFloater />
            </div>

            <section className="content-section">
                <div className="text-block centered">
                    <h2>Selección Exclusiva</h2>
                    <p>
                        Nuestros proyectos tratan sobre armonía, estilo y calidad de vida.
                    </p>
                </div>

                {featured.length > 0 ? (
                    <div className="prop-grid-styled">
                        {featured.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-block centered">
                        <p>Configurá Supabase en .env.local para ver propiedades.</p>
                    </div>
                )}
            </section>

            <section className="content-section" style={{ textAlign: "center", paddingBottom: "1rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>Explorá como nunca antes</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Descubrí propiedades en modo inmersivo, estilo reel.</p>
                <Link href="/explorar" className="btn-cta" style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                    <i className="ph ph-play-circle"></i> Modo Reel
                </Link>
            </section>

            <Footer />
        </>
    );
}
