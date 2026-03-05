import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase/server";
import { getBaseUrl, toSlug, validOps } from "@/lib/seo";

interface SitemapListing {
    id: string;
    op: string;
    province: string;
    city: string;
    updated_at?: string;
    created_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = getBaseUrl();
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
        { url: `${base}/propiedades`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
        { url: `${base}/explorar`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
        { url: `${base}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
        { url: `${base}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ];

    const db = supabase();
    if (!db) return staticPages;

    // Property detail pages (top 500)
    const { data: listings } = await db
        .from("listings")
        .select("id, op, province, city, updated_at, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(500);

    const detailPages: MetadataRoute.Sitemap = (listings ?? []).map((l: SitemapListing) => ({
        url: `${base}/propiedades/${l.id}`,
        lastModified: new Date(l.updated_at ?? l.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    // SEO routes per operation/province/city (unique combos)
    const citySet = new Set<string>();
    const seoPages: MetadataRoute.Sitemap = [];

    for (const l of (listings ?? []) as SitemapListing[]) {
        for (const op of validOps) {
            const key = `${op}|${l.province}|${l.city}`;
            if (!citySet.has(key)) {
                citySet.add(key);
                seoPages.push({
                    url: `${base}/buscar/${op}/${toSlug(l.province)}/${toSlug(l.city)}`,
                    lastModified: now,
                    changeFrequency: "daily" as const,
                    priority: 0.8,
                });
            }
        }
    }

    return [...staticPages, ...detailPages, ...seoPages];
}
