import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { supabase } from "@/lib/supabase/server";
import { toPropertyView } from "@/lib/supabase/types";
import { getBaseUrl, opLabels } from "@/lib/seo";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 900;

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const db = supabase();
    if (!db) return {};

    const { data: listing } = await db
        .from("listings")
        .select("title, op, province, city, location_text, price, currency, property_type, area_m2, bedrooms, description")
        .eq("id", id)
        .single();

    if (!listing) return {};

    const opLabel = opLabels[listing.op] ?? "Venta";
    const title = `${listing.title} — ${opLabel} en ${listing.city}, ${listing.province} | Propiedades Argentinas`;
    const description = listing.description?.slice(0, 160) ??
        `${listing.property_type} en ${opLabel.toLowerCase()} en ${listing.location_text}. ${listing.bedrooms ? listing.bedrooms + " dormitorios. " : ""}${listing.area_m2 ? listing.area_m2 + "m². " : ""}${listing.currency} ${listing.price.toLocaleString("en-US")}.`;

    const url = `${getBaseUrl()}/propiedades/${id}`;

    // Get first image for OG
    const { data: media } = await db
        .from("listing_media")
        .select("url")
        .eq("listing_id", id)
        .order("sort_order", { ascending: true })
        .limit(1);

    const ogImage = media?.[0]?.url ?? "/images/exterior.png";

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
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
    };
}

export default async function PropertyDetailPage({ params }: Props) {
    const { id } = await params;
    const db = supabase();

    if (!db) return notFound();

    const { data: listing, error } = await db
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !listing) return notFound();

    const { data: media } = await db
        .from("listing_media")
        .select("*")
        .eq("listing_id", id)
        .order("sort_order", { ascending: true });

    const property = toPropertyView(
        listing as ListingRow,
        (media ?? []) as ListingMediaRow[]
    );

    // JSON-LD Schema.org
    const baseUrl = getBaseUrl();
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description,
        url: `${baseUrl}/propiedades/${id}`,
        image: property.images,
        offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: listing.currency,
            availability: listing.status === "active"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: listing.city,
            addressRegion: listing.province,
            addressCountry: "AR",
        },
        ...(listing.area_m2 ? { floorSize: { "@type": "QuantitativeValue", value: listing.area_m2, unitCode: "MTK" } } : {}),
        ...(listing.bedrooms ? { numberOfRooms: listing.bedrooms } : {}),
        ...(listing.bathrooms ? { numberOfBathroomsTotal: listing.bathrooms } : {}),
    };

    return (
        <>
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="detail-container">
                <Link href={`/propiedades?op=${property.operation}`} className="detail-back">
                    <i className="ph ph-arrow-left"></i> Volver a resultados
                </Link>

                {/* Galería */}
                <div className="detail-gallery">
                    <div className="detail-gallery-main">
                        <Image
                            src={property.images[0]}
                            alt={property.title}
                            width={1200}
                            height={750}
                            priority
                            sizes="(max-width: 768px) 100vw, 60vw"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <div className="detail-gallery-side">
                        {property.images.slice(1).map((img, i) => (
                            <div key={i}>
                                <Image
                                    src={img}
                                    alt={`${property.title} ${i + 2}`}
                                    width={600}
                                    height={375}
                                    sizes="(max-width: 768px) 50vw, 30vw"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid info + contacto */}
                <div className="detail-grid">
                    <div>
                        <h1 className="detail-title">{property.title}</h1>
                        <p className="detail-location">
                            <i className="ph ph-map-pin"></i> {property.location}
                        </p>
                        <p className="detail-price">
                            {property.currency} {property.price}
                            {property.operation === "temp" && (
                                <span style={{ fontSize: "1rem", color: "#6e6e73" }}>
                                    {" "}
                                    /noche
                                </span>
                            )}
                        </p>

                        <div className="detail-features">
                            <div className="feat">
                                <strong>{property.sqm}m²</strong>
                                <span>Superficie</span>
                            </div>
                            {property.bedrooms > 0 && (
                                <div className="feat">
                                    <strong>{property.bedrooms}</strong>
                                    <span>Dormitorios</span>
                                </div>
                            )}
                            <div className="feat">
                                <strong>{property.bathrooms}</strong>
                                <span>Baños</span>
                            </div>
                            <div className="feat">
                                <strong style={{ textTransform: "capitalize" }}>
                                    {property.type}
                                </strong>
                                <span>Tipo</span>
                            </div>
                        </div>

                        <div className="detail-description">
                            <h3>Descripción</h3>
                            <p>{property.description}</p>
                        </div>
                    </div>

                    {/* Sidebar contacto — Client Component */}
                    <div className="detail-sidebar">
                        <ContactForm
                            listingId={property.id}
                            listingTitle={property.title}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
