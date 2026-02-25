"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ReelProperty {
    id: string;
    title: string;
    location: string;
    price: string;
    op: string;
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    image: string;
    badge?: string;
}

export default function ReelCard({ property }: { property: ReelProperty }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.6 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const opLabels: Record<string, string> = {
        buy: "Venta",
        rent: "Alquiler",
        temp: "Temporario",
    };

    return (
        <div ref={ref} className="reel-card">
            <div className="reel-image">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
                <div className="reel-gradient" />
            </div>

            <div className={`reel-content ${visible ? "reel-visible" : ""}`}>
                {property.badge && <span className="reel-badge">{property.badge}</span>}
                <span className="reel-op">{opLabels[property.op] ?? property.op}</span>

                <h2 className="reel-title">{property.title}</h2>
                <p className="reel-location">
                    <i className="ph ph-map-pin"></i> {property.location}
                </p>
                <p className="reel-price">{property.price}</p>

                <div className="reel-features">
                    {property.bedrooms && (
                        <span><i className="ph ph-bed"></i> {property.bedrooms}</span>
                    )}
                    {property.bathrooms && (
                        <span><i className="ph ph-bathtub"></i> {property.bathrooms}</span>
                    )}
                    {property.area && (
                        <span><i className="ph ph-ruler"></i> {property.area} m²</span>
                    )}
                </div>

                <Link href={`/propiedades/${property.id}`} className="reel-cta">
                    Ver Detalles <i className="ph ph-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
}
