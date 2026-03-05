import { supabaseAuth } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminBoostActions from "./AdminBoostActions";

export const metadata = {
    title: "Admin — Boosts",
};

export const revalidate = 0;

export default async function AdminBoostsPage() {
    const sb = await supabaseAuth();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return redirect("/login");

    // Admin check
    const { data: profile } = await sb
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        return redirect("/dashboard");
    }

    // Get all boosts with product and listing info
    const { data: boosts } = await sb
        .from("boosts")
        .select("id, status, created_at, starts_at, ends_at, listing_id, user_id, boost_product_id, boost_products(code, name, price_ars, duration_hours), listings(title)")
        .order("created_at", { ascending: false });

    return (
        <main className="admin-page">
            <div className="admin-header">
                <h1>Boosts</h1>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Link href="/admin/subscriptions" className="btn-outline btn-sm">Suscripciones</Link>
                    <Link href="/dashboard" className="btn-outline btn-sm">← Dashboard</Link>
                </div>
            </div>

            {(!boosts || boosts.length === 0) ? (
                <p className="admin-empty">No hay boosts.</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Publicación</th>
                                <th>Producto</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Vigencia</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boosts.map((boost) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const product = (boost as any).boost_products;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const listing = (boost as any).listings;
                                return (
                                    <tr key={boost.id} className={boost.status === "manual_pending" ? "admin-row--pending" : ""}>
                                        <td className="admin-cell-listing" title={listing?.title}>
                                            {listing?.title?.slice(0, 30) ?? "—"}{listing?.title?.length > 30 ? "…" : ""}
                                        </td>
                                        <td>{product?.name ?? "—"}</td>
                                        <td>
                                            <span className={`admin-status admin-status--${boost.status}`}>
                                                {boost.status}
                                            </span>
                                        </td>
                                        <td>{new Date(boost.created_at).toLocaleDateString("es-AR")}</td>
                                        <td>
                                            {boost.starts_at && boost.ends_at
                                                ? `${new Date(boost.starts_at).toLocaleDateString("es-AR")} — ${new Date(boost.ends_at).toLocaleDateString("es-AR")}`
                                                : "—"}
                                        </td>
                                        <td>
                                            <AdminBoostActions id={boost.id} status={boost.status} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
