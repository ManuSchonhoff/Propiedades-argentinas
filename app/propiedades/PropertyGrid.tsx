"use client";

import PropertyCard from "@/components/PropertyCard";
import ScrollCard from "@/components/ScrollCard";
import type { PropertyView } from "@/lib/supabase/types";

interface PropertyGridProps {
    properties: (PropertyView & { isBoosted?: boolean })[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
    return (
        <div className="prop-grid-styled">
            {properties.map((property, i) => (
                <ScrollCard key={property.id} delay={Math.min(i * 60, 300)}>
                    <div style={{ position: "relative" }}>
                        {property.isBoosted && (
                            <span className="property-badge-boost">⚡ Destacada</span>
                        )}
                        <PropertyCard property={property} />
                    </div>
                </ScrollCard>
            ))}
        </div>
    );
}
