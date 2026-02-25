import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { supabaseAuth } from "@/lib/supabase/auth";
import type { ListingRow, ListingMediaRow } from "@/lib/supabase/types";

export const revalidate = 0; // Always fresh

const statusLabels: Record<string, string> = {
    draft: "Borrador",
    pending: "Pendiente",
    active: "Activa",
    paused: "Pausada",
    sold: "Vendida",
    rented: "Alquilada",
    archived: "Archivada",
};

const statusColors: Record<string, string> = {
    active: "#16a34a",
    paused: "#d97706",
    draft: "#6b7280",
    pending: "#3b82f6",
    sold: "#dc2626",
    rented: "#dc2626",
    archived: "#6b7280",
};

export default async function DashboardPage() {
    const sb = await supabaseAuth();
    const {
        data: { user },
    } = await sb.auth.getUser();

    if (!user) redirect("/login");

    /* Fetch user's listings (all statuses — RLS bypass via owner check) */
    const { data: listings } = await sb
        .from("listings")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    /* Fetch media for thumbnails */
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

    return (
        <>
            <Navbar />
            <section className="content-section">
                <div className="dash-header">
                    <div>
                        <h1 className="dash-title">Mi Panel</h1>
                        <p className="dash-subtitle">
                            {(listings ?? []).length} propiedad
                            {(listings ?? []).length !== 1 ? "es" : ""} publicada
                            {(listings ?? []).length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <Link href="/publicar" className="btn-cta">
                        <i className="ph ph-plus"></i> Publicar Propiedad
                    </Link>
                </div>

                {(listings ?? []).length === 0 ? (
                    <div className="text-block centered" style={{ paddingTop: "3rem" }}>
                        <p>Todavía no publicaste ninguna propiedad.</p>
                        <Link href="/publicar" className="btn-cta" style={{ marginTop: "1rem", display: "inline-block" }}>
                            Publicar tu primera propiedad
                        </Link>
                    </div>
                ) : (
                    <div className="dash-listing-list">
                        {(listings ?? []).map((listing: ListingRow) => (
                            <div key={listing.id} className="dash-listing-row">
                                <div className="dash-listing-thumb">
                                    <Image
                                        src={mediaMap.get(listing.id) ?? "/images/exterior.png"}
                                        alt={listing.title}
                                        width={120}
                                        height={80}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                </div>
                                <div className="dash-listing-info">
                                    <h3>{listing.title}</h3>
                                    <p>{listing.location_text}</p>
                                    <p className="dash-listing-price">
                                        {listing.currency} {listing.price.toLocaleString("en-US")}
                                    </p>
                                </div>
                                <div className="dash-listing-status">
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: statusColors[listing.status] ?? "#6b7280" }}
                                    >
                                        {statusLabels[listing.status] ?? listing.status}
                                    </span>
                                </div>
                                <div className="dash-listing-actions">
                                    <Link href={`/dashboard/${listing.id}/editar`} className="btn-action" title="Editar">
                                        <i className="ph ph-pencil-simple"></i>
                                    </Link>
                                    <form action={`/api/listings/${listing.id}/toggle`} method="POST">
                                        <button type="submit" className="btn-action" title={listing.status === "active" ? "Pausar" : "Activar"}>
                                            <i className={`ph ph-${listing.status === "active" ? "pause" : "play"}`}></i>
                                        </button>
                                    </form>
                                    <form action={`/api/listings/${listing.id}/delete`} method="POST">
                                        <button type="submit" className="btn-action btn-danger" title="Eliminar">
                                            <i className="ph ph-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
