import Link from "next/link";
import ReelCard from "@/components/ReelCard";
import { supabase } from "@/lib/supabase/server";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 60;

export default async function ExplorarPage() {
    const sb = supabase();
    let properties: {
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
    }[] = [];

    if (sb) {
        const { data: listings } = await sb
            .from("listings")
            .select("*")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(20);

        const ids = (listings ?? []).map((l: ListingRow) => l.id);
        const { data: media } = ids.length
            ? await sb
                .from("listing_media")
                .select("*")
                .in("listing_id", ids)
                .order("sort_order", { ascending: true })
            : { data: [] };

        const mediaMap = new Map<string, string>();
        (media ?? []).forEach((m: ListingMediaRow) => {
            if (!mediaMap.has(m.listing_id)) {
                mediaMap.set(m.listing_id, m.url);
            }
        });

        properties = (listings ?? []).map((l: ListingRow) => ({
            id: l.id,
            title: l.title,
            location: l.location_text,
            price: `${l.currency} ${l.price.toLocaleString("en-US")}`,
            op: l.op,
            bedrooms: l.bedrooms,
            bathrooms: l.bathrooms,
            area: l.area_m2,
            image: mediaMap.get(l.id) ?? "/images/exterior.png",
            badge: l.badge ?? undefined,
        }));
    }

    return (
        <div className="reel-container">
            {/* Top nav overlay */}
            <nav className="reel-nav">
                <Link href="/" className="reel-logo">PROPIEDADES ARGENTINAS</Link>
                <Link href="/propiedades?op=buy" className="reel-nav-link">
                    <i className="ph ph-squares-four"></i> Grilla
                </Link>
            </nav>

            {properties.length === 0 ? (
                <div className="reel-card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "white", fontSize: "1.2rem" }}>No hay propiedades para explorar.</p>
                </div>
            ) : (
                properties.map((p) => <ReelCard key={p.id} property={p} />)
            )}

            {/* Scroll hint */}
            <div className="reel-scroll-hint">
                <i className="ph ph-caret-down"></i>
                <span>Deslizá para explorar</span>
            </div>
        </div>
    );
}
