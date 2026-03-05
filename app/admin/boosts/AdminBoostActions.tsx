"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBoostActions({ id, status }: { id: string; status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAction = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/boosts/${id}`, {
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
                <button className="btn-admin btn-admin--approve" onClick={() => handleAction("active")} disabled={loading}>
                    ✅ Aprobar
                </button>
                <button className="btn-admin btn-admin--cancel" onClick={() => handleAction("cancelled")} disabled={loading}>
                    ❌ Rechazar
                </button>
            </div>
        );
    }

    if (status === "active") {
        return (
            <div className="admin-actions">
                <button className="btn-admin btn-admin--cancel" onClick={() => handleAction("expired")} disabled={loading}>
                    ⏹️ Expirar
                </button>
            </div>
        );
    }

    return <span className="admin-no-actions">—</span>;
}
