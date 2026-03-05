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

const WA_NUMBER = "5491100000000"; // TODO: Replace with real WhatsApp number

export default function BoostButton({ listingId, boostProducts, hasActiveBoost }: BoostButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (hasActiveBoost) {
        return <span className="boost-badge-active">⚡ Destacada</span>;
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(price);

    const handleBoost = async (productId: string, productName: string) => {
        setLoading(productId);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch("/api/boosts/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listing_id: listingId, boost_product_id: productId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Error al procesar");
                return;
            }
            setSuccess(`✅ Solicitud de ${productName} enviada.`);
            setTimeout(() => setOpen(false), 3000);
        } catch {
            setError("Error de conexión");
        } finally {
            setLoading(null);
        }
    };

    const whatsappLink = (product: BoostProduct) => {
        const msg = encodeURIComponent(
            `Hola! Quiero activar ${product.name} (${formatPrice(product.price_ars)}) para mi publicación.`
        );
        return `https://wa.me/${WA_NUMBER}?text=${msg}`;
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
                        {success && <p className="boost-success">{success}</p>}
                        <div className="boost-options">
                            {boostProducts.map((p) => (
                                <div key={p.id} className="boost-option-row">
                                    <button
                                        className="boost-option"
                                        onClick={() => handleBoost(p.id, p.name)}
                                        disabled={loading !== null || success !== null}
                                    >
                                        <span className="boost-option-name">{p.name}</span>
                                        <span className="boost-option-price">{formatPrice(p.price_ars)}</span>
                                        {loading === p.id && <span className="boost-loading">...</span>}
                                    </button>
                                    <a
                                        href={whatsappLink(p)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="boost-wa-link"
                                        title="Consultar por WhatsApp"
                                    >
                                        💬
                                    </a>
                                </div>
                            ))}
                        </div>
                        <button className="boost-close" onClick={() => { setOpen(false); setSuccess(null); setError(null); }}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
