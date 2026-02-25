import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { supabase } from "@/lib/supabase/server";
import { toPropertyView } from "@/lib/supabase/types";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 60;

interface Props {
    params: Promise<{ id: string }>;
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

    return (
        <>
            <Navbar />
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
