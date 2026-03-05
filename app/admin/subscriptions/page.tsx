import { supabaseAuth } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSubActions from "./AdminSubActions";

export const metadata = {
    title: "Admin — Suscripciones",
};

export const revalidate = 0;

export default async function AdminSubscriptionsPage() {
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

    // Get all subscriptions with plan and user info
    const { data: subscriptions } = await sb
        .from("subscriptions")
        .select("id, status, created_at, user_id, plan_id, plans(code, name, price_ars, listing_limit)")
        .order("created_at", { ascending: false });

    return (
        <main className="admin-page">
            <div className="admin-header">
                <h1>Suscripciones</h1>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Link href="/admin/boosts" className="btn-outline btn-sm">Boosts</Link>
                    <Link href="/dashboard" className="btn-outline btn-sm">← Dashboard</Link>
                </div>
            </div>

            {(!subscriptions || subscriptions.length === 0) ? (
                <p className="admin-empty">No hay suscripciones.</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Plan</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const plan = (sub as any).plans;
                                return (
                                    <tr key={sub.id} className={sub.status === "manual_pending" ? "admin-row--pending" : ""}>
                                        <td className="admin-cell-user">{sub.user_id.slice(0, 8)}…</td>
                                        <td>{plan?.name ?? "—"}</td>
                                        <td>
                                            <span className={`admin-status admin-status--${sub.status}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td>{new Date(sub.created_at).toLocaleDateString("es-AR")}</td>
                                        <td>
                                            <AdminSubActions id={sub.id} status={sub.status} />
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
