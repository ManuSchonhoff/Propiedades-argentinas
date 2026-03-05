import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase/server";
import { toPropertyView } from "@/lib/supabase/types";
import { fromSlug, opLabels, validOps, getBaseUrl } from "@/lib/seo";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 300;

const ITEMS_PER_PAGE = 20;

interface Props {
    params: Promise<{ segments: string[] }>;
    searchParams: Promise<{ page?: string }>;
}

function parseSegments(segments: string[]) {
    // /buscar/[op]/[provincia]/[ciudad]  (3 segments)
    // /buscar/[op]/[provincia]/[ciudad]/[tipo]  (4 segments)
    if (segments.length < 3 || segments.length > 4) return null;
    const [op, provincia, ciudad, tipo] = segments;
    if (!validOps.includes(op)) return null;
    return {
        op,
        provinceName: fromSlug(provincia),
        cityName: fromSlug(ciudad),
        typeName: tipo ? fromSlug(tipo) : null,
        provinceSlug: provincia,
        citySlug: ciudad,
        typeSlug: tipo ?? null,
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { segments } = await params;
    const parsed = parseSegments(segments);
    if (!parsed) return {};

    const { op, provinceName, cityName, typeName } = parsed;
    const opLabel = opLabels[op] ?? "Venta";

    const titleParts = typeName
        ? `${typeName} en ${opLabel} en ${cityName}, ${provinceName}`
        : `Propiedades en ${opLabel} en ${cityName}, ${provinceName}`;

    const title = `${titleParts} | Propiedades Argentinas`;
    const description = typeName
        ? `${typeName} en ${opLabel.toLowerCase()} en ${cityName}, ${provinceName}. Encontrá tu propiedad ideal.`
        : `Encontrá propiedades en ${opLabel.toLowerCase()} en ${cityName}, ${provinceName}. Departamentos, casas y más.`;

    const url = `${getBaseUrl()}/buscar/${segments.join("/")}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: "Propiedades Argentinas",
            type: "website",
            locale: "es_AR",
        },
    };
}

export default async function SeoListingPage({ params, searchParams }: Props) {
    const { segments } = await params;
    const parsed = parseSegments(segments);
    if (!parsed) return notFound();

    const sp = await searchParams;
    const { op, provinceName, cityName, typeName, provinceSlug, citySlug, typeSlug } = parsed;
    const page = Math.max(1, parseInt(sp.page ?? "1", 10));
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const opLabel = opLabels[op] ?? "Venta";

    const db = supabase();
    if (!db) return notFound();

    // Build query
    let query = db
        .from("listings")
        .select("*", { count: "exact" })
        .eq("op", op)
        .ilike("province", `%${provinceName}%`)
        .ilike("city", `%${cityName}%`)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (typeName) {
        query = query.ilike("property_type", `%${typeName}%`);
    }

    const { data: listings, count, error } = await query;
    if (error) return notFound();

    // Fetch media
    const ids = (listings ?? []).map((l: ListingRow) => l.id);
    const { data: media } = ids.length
        ? await db.from("listing_media").select("*").in("listing_id", ids).order("sort_order", { ascending: true })
        : { data: [] };

    // Fetch active boosts
    const now = new Date().toISOString();
    const { data: activeBoosts } = ids.length
        ? await db.from("boosts").select("listing_id").in("listing_id", ids).eq("status", "active").gt("ends_at", now)
        : { data: [] };

    const boostedIds = new Set((activeBoosts ?? []).map((b: { listing_id: string }) => b.listing_id));

    const properties = (listings ?? []).map((listing: ListingRow) => {
        const listingMedia = (media ?? []).filter((m: ListingMediaRow) => m.listing_id === listing.id);
        return { ...toPropertyView(listing, listingMedia), isBoosted: boostedIds.has(listing.id) };
    }).sort((a, b) => (a.isBoosted === b.isBoosted ? 0 : a.isBoosted ? -1 : 1));

    const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

    const heading = typeName
        ? `${typeName} en ${opLabel} en ${cityName}, ${provinceName}`
        : `Propiedades en ${opLabel} en ${cityName}, ${provinceName}`;

    const basePath = typeSlug
        ? `/buscar/${op}/${provinceSlug}/${citySlug}/${typeSlug}`
        : `/buscar/${op}/${provinceSlug}/${citySlug}`;

    return (
        <>
            <Navbar />
            <section className="content-section">
                <div className="text-block centered">
                    <h1>{heading}</h1>
                    <p>
                        {count ?? 0} {(count ?? 0) === 1 ? "resultado" : "resultados"} encontrados
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
                        <p>No se encontraron propiedades{typeName ? ` de tipo ${typeName.toLowerCase()}` : ""} en {cityName}.</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="seo-pagination">
                        {page > 1 && (
                            <a href={`${basePath}?page=${page - 1}`} className="btn-outline btn-sm">
                                ← Anterior
                            </a>
                        )}
                        <span className="seo-page-info">Página {page} de {totalPages}</span>
                        {page < totalPages && (
                            <a href={`${basePath}?page=${page + 1}`} className="btn-outline btn-sm">
                                Siguiente →
                            </a>
                        )}
                    </div>
                )}
            </section>
            <Footer />
        </>
    );
}
