/* ---- DB row types ---- */

export interface ListingRow {
    id: string;
    op: string;
    title: string;
    price: number;
    currency: string;
    province: string;
    city: string;
    location_text: string;
    property_type: string;
    bedrooms: number | null;
    bathrooms: number | null;
    area_m2: number | null;
    badge: string | null;
    description: string | null;
    status: string;
    created_at: string;
}

export interface ListingMediaRow {
    id: string;
    listing_id: string;
    url: string;
    sort_order: number;
    created_at: string;
}

/* ---- View type used by components ---- */

export interface PropertyView {
    id: string;
    title: string;
    location: string;
    price: string;
    currency: string;
    operation: string;
    type: string;
    sqm: number;
    bedrooms: number;
    bathrooms: number;
    badge: string;
    image: string;
    images: string[];
    description: string;
}

/* ---- Mapper: DB row → component view ---- */

function formatPrice(n: number): string {
    return n.toLocaleString("en-US");
}

export function toPropertyView(
    row: ListingRow,
    media: ListingMediaRow[] = []
): PropertyView {
    const sortedMedia = [...media].sort((a, b) => a.sort_order - b.sort_order);
    const images = sortedMedia.map((m) => m.url);

    return {
        id: row.id,
        title: row.title,
        location: row.location_text,
        price: formatPrice(row.price),
        currency: row.currency,
        operation: row.op,
        type: row.property_type,
        sqm: row.area_m2 ?? 0,
        bedrooms: row.bedrooms ?? 0,
        bathrooms: row.bathrooms ?? 0,
        badge: row.badge ?? "",
        image: images[0] ?? "/images/exterior.png",
        images: images.length > 0 ? images : ["/images/exterior.png"],
        description: row.description ?? "",
    };
}
