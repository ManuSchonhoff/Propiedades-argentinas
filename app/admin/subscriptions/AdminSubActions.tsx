"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSubActions({ id, status }: { id: string; status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAction = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/subscriptions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    };

    if (status === "manual_pending") {
        return (
            <div className="admin-actions">
                <button className="btn-admin btn-admin--approve" onClick={() => handleAction("authorized")} disabled={loading}>
                    ✅ Aprobar
                </button>
                <button className="btn-admin btn-admin--cancel" onClick={() => handleAction("cancelled")} disabled={loading}>
                    ❌ Rechazar
                </button>
            </div>
        );
    }

    if (status === "authorized") {
        return (
            <div className="admin-actions">
                <button className="btn-admin btn-admin--pause" onClick={() => handleAction("paused")} disabled={loading}>
                    ⏸️ Pausar
                </button>
                <button className="btn-admin btn-admin--cancel" onClick={() => handleAction("cancelled")} disabled={loading}>
                    ❌ Cancelar
                </button>
            </div>
        );
    }

    if (status === "paused") {
        return (
            <div className="admin-actions">
                <button className="btn-admin btn-admin--approve" onClick={() => handleAction("authorized")} disabled={loading}>
                    ▶️ Reactivar
                </button>
            </div>
        );
    }

    return <span className="admin-no-actions">—</span>;
}
