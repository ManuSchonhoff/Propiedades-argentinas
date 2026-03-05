import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    const base = getBaseUrl();
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard/", "/admin/", "/api/", "/login", "/registro", "/publicar"],
            },
        ],
        sitemap: `${base}/sitemap.xml`,
    };
}
