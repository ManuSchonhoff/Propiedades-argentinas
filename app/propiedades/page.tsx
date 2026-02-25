import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase/server";
import { toPropertyView } from "@/lib/supabase/types";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 30;

interface Props {
    searchParams: Promise<{
        op?: string;
        loc?: string;
        type?: string;
        price?: string;
    }>;
}

export default async function PropiedadesPage({ searchParams }: Props) {
    const params = await searchParams;
    const op = params.op || "buy";
    const loc = params.loc || "";
    const type = params.type || "";
    const priceMax = params.price ? parseInt(params.price, 10) : 0;

    const db = supabase();
    let properties: (ReturnType<typeof toPropertyView> & { isBoosted?: boolean })[] = [];

    if (db) {
        let query = db.from("listings").select("*").eq("op", op);

        if (type) {
            query = query.eq("property_type", type);
        }

        if (loc && loc !== "Buenos Aires, Todo el país") {
            query = query.or(
                `city.ilike.%${loc}%,province.ilike.%${loc}%,location_text.ilike.%${loc}%`
            );
        }

        if (priceMax > 0) {
            query = query.lte("price", priceMax);
        }

        query = query.order("created_at", { ascending: false });

        const { data: listings, error } = await query;

        if (!error && listings && listings.length > 0) {
            const ids = listings.map((l: ListingRow) => l.id);
            const { data: media } = await db
                .from("listing_media")
                .select("*")
                .in("listing_id", ids)
                .order("sort_order", { ascending: true });

            // Fetch active boosts
            const now = new Date().toISOString();
            const { data: activeBoosts } = await db
                .from("boosts")
                .select("listing_id")
                .in("listing_id", ids)
                .eq("status", "active")
                .gt("ends_at", now);

            const boostedIds = new Set((activeBoosts ?? []).map((b: { listing_id: string }) => b.listing_id));

            const mapped = listings.map((listing: ListingRow) => {
                const listingMedia = (media ?? []).filter(
                    (m: ListingMediaRow) => m.listing_id === listing.id
                );
                return {
                    ...toPropertyView(listing, listingMedia),
                    isBoosted: boostedIds.has(listing.id),
                };
            });

            // Sort: boosted first, then by created_at (already sorted from query)
            properties = mapped.sort((a, b) => {
                if (a.isBoosted && !b.isBoosted) return -1;
                if (!a.isBoosted && b.isBoosted) return 1;
                return 0;
            });
        }
    }

    const opLabels: Record<string, string> = {
        buy: "Venta",
        rent: "Alquiler",
        temp: "Temporario",
    };

    return (
        <>
            <Navbar />
            <section className="content-section">
                <div className="text-block centered">
                    <h2>Propiedades en {opLabels[op] || "Venta"}</h2>
                    <p>
                        {properties.length}{" "}
                        {properties.length === 1 ? "resultado" : "resultados"} encontrados
                        {loc ? ` en ${loc}` : ""}
                    </p>
                </div>

                {properties.length > 0 ? (
                    <div className="prop-grid-styled">
                        {properties.map((property) => (
                            <div key={property.id} style={{ position: "relative" }}>
                                {property.isBoosted && (
                                    <span className="property-badge-boost">⚡ Destacada</span>
                                )}
                                <PropertyCard property={property} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-block centered" style={{ paddingTop: "2rem" }}>
                        <p>No se encontraron propiedades con esos filtros.</p>
                    </div>
                )}
            </section>
        </>
    );
}
