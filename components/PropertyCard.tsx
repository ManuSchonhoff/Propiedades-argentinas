import Link from "next/link";
import Image from "next/image";
import type { PropertyView } from "@/lib/supabase/types";

interface PropertyCardProps {
    property: PropertyView;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <article className="prop-card-minimal">
            <div className="img-wrapper">
                <Image
                    src={property.image}
                    alt={property.title}
                    width={800}
                    height={500}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {property.badge && (
                    <div className="card-badge">{property.badge}</div>
                )}
            </div>
            <div className="card-info">
                <div className="card-top">
                    <h3>{property.title}</h3>
                    <span className="price">
                        {property.currency} {property.price}
                    </span>
                </div>
                <p className="card-sub">{property.location}</p>
                <div className="card-meta">
                    <span>
                        <i className="ph ph-ruler"></i> {property.sqm}m²
                    </span>
                    {property.bedrooms > 0 && (
                        <span>
                            <i className="ph ph-bed"></i> {property.bedrooms} Dorm.
                        </span>
                    )}
                    <span>
                        <i className="ph ph-shower"></i> {property.bathrooms} Baños
                    </span>
                </div>
                <Link href={`/propiedades/${property.id}`}>
                    <button className="btn-check">Ver Detalles</button>
                </Link>
            </div>
        </article>
    );
}
