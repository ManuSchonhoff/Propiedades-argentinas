"use client";

import { useState } from "react";

interface BoostProduct {
    id: string;
    code: string;
    name: string;
    price_ars: number;
    duration_hours: number;
}

interface BoostButtonProps {
    listingId: string;
    boostProducts: BoostProduct[];
    hasActiveBoost?: boolean;
}

export default function BoostButton({ listingId, boostProducts, hasActiveBoost }: BoostButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (hasActiveBoost) {
        return <span className="boost-badge-active">⚡ Destacada</span>;
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(price);

    const handleBoost = async (productId: string) => {
        setLoading(productId);
        setError(null);
        try {
            const res = await fetch("/api/boosts/create-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listing_id: listingId, boost_product_id: productId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Error al procesar");
                return;
            }
            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch {
            setError("Error de conexión");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="boost-container">
            <button className="boost-btn" onClick={() => setOpen(!open)}>⚡ Destacar</button>

            {open && (
                <div className="boost-modal">
                    <div className="boost-modal-content">
                        <h3>Destacar publicación</h3>
                        <p>Tu propiedad aparecerá primero en los resultados.</p>
                        {error && <p className="boost-error">{error}</p>}
                        <div className="boost-options">
                            {boostProducts.map((p) => (
                                <button
                                    key={p.id}
                                    className="boost-option"
                                    onClick={() => handleBoost(p.id)}
                                    disabled={loading !== null}
                                >
                                    <span className="boost-option-name">{p.name}</span>
                                    <span className="boost-option-price">{formatPrice(p.price_ars)}</span>
                                    {loading === p.id && <span className="boost-loading">...</span>}
                                </button>
                            ))}
                        </div>
                        <button className="boost-close" onClick={() => setOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
