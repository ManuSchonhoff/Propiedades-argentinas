/**
 * SEO slug utilities for URL-friendly paths.
 */

/** Convert a string to a URL-friendly slug (lowercase, hyphens, no accents) */
export function toSlug(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Convert a slug back to title case for display */
export function fromSlug(slug: string): string {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

/** Operation labels */
export const opLabels: Record<string, string> = {
    buy: "Venta",
    rent: "Alquiler",
    temp: "Temporario",
};

/** Valid operations */
export const validOps = ["buy", "rent", "temp"];

/** Get base URL for sitemap/canonical */
export function getBaseUrl(): string {
    if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
}
