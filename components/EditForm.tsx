"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface EditFormProps {
    listing: {
        id: string;
        title: string;
        op: string;
        property_type: string;
        price: number;
        currency: string;
        province: string;
        city: string;
        location_text: string;
        bedrooms: number | null;
        bathrooms: number | null;
        area_m2: number | null;
        description: string | null;
    };
}

export default function EditForm({ listing }: EditFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [title, setTitle] = useState(listing.title);
    const [op, setOp] = useState(listing.op);
    const [propertyType, setPropertyType] = useState(listing.property_type);
    const [price, setPrice] = useState(String(listing.price));
    const [currency, setCurrency] = useState(listing.currency);
    const [province, setProvince] = useState(listing.province);
    const [city, setCity] = useState(listing.city);
    const [locationText, setLocationText] = useState(listing.location_text);
    const [bedrooms, setBedrooms] = useState(listing.bedrooms ? String(listing.bedrooms) : "");
    const [bathrooms, setBathrooms] = useState(listing.bathrooms ? String(listing.bathrooms) : "");
    const [areaM2, setAreaM2] = useState(listing.area_m2 ? String(listing.area_m2) : "");
    const [description, setDescription] = useState(listing.description ?? "");

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => router.push("/dashboard"), 1500);
            return () => clearTimeout(t);
        }
    }, [success, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const sb = supabaseBrowser();
        if (!sb) {
            setError("Supabase no configurado");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/listings/${listing.id}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    op,
                    property_type: propertyType,
                    price: parseFloat(price),
                    currency,
                    province,
                    city,
                    location_text: locationText || `${city}, ${province}`,
                    bedrooms: bedrooms ? parseInt(bedrooms) : null,
                    bathrooms: bathrooms ? parseInt(bathrooms) : null,
                    area_m2: areaM2 ? parseFloat(areaM2) : null,
                    description,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Error al actualizar");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
        } catch {
            setError("Error inesperado");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="publish-form">
            <div className="publish-grid">
                <div>
                    <h2>Editar propiedad</h2>

                    <div className="form-group">
                        <label htmlFor="title">Título *</label>
                        <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="op">Operación</label>
                            <select id="op" value={op} onChange={(e) => setOp(e.target.value)}>
                                <option value="buy">Venta</option>
                                <option value="rent">Alquiler</option>
                                <option value="temp">Temporario</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ptype">Tipo</label>
                            <select id="ptype" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                                <option value="departamento">Departamento</option>
                                <option value="casa">Casa</option>
                                <option value="ph">PH</option>
                                <option value="oficina">Oficina</option>
                                <option value="local">Local</option>
                                <option value="terreno">Terreno</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Precio *</label>
                            <input id="price" type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="currency">Moneda</label>
                            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="USD">USD</option>
                                <option value="ARS">ARS</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="province">Provincia</label>
                            <input id="province" type="text" required value={province} onChange={(e) => setProvince(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ciudad</label>
                            <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="loc">Ubicación detallada</label>
                        <input id="loc" type="text" value={locationText} onChange={(e) => setLocationText(e.target.value)} />
                    </div>

                    <div className="form-row form-row-3">
                        <div className="form-group">
                            <label htmlFor="beds">Dormitorios</label>
                            <input id="beds" type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="baths">Baños</label>
                            <input id="baths" type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="area">Superficie m²</label>
                            <input id="area" type="number" min="0" value={areaM2} onChange={(e) => setAreaM2(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="desc">Descripción</label>
                        <textarea id="desc" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>

                <div>
                    <h2>Vista previa</h2>
                    <div className="edit-preview-card">
                        <h3>{title || "Sin título"}</h3>
                        <p>{locationText || `${city}, ${province}`}</p>
                        <p className="dash-listing-price">{currency} {price ? parseFloat(price).toLocaleString("en-US") : "0"}</p>
                        <p style={{ fontSize: "0.85rem", color: "#6e6e73", marginTop: "1rem" }}>
                            {bedrooms && `${bedrooms} dorm · `}
                            {bathrooms && `${bathrooms} baños · `}
                            {areaM2 && `${areaM2} m²`}
                        </p>
                    </div>
                </div>
            </div>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-error" style={{ background: "#f0fdf4", color: "#16a34a" }}>✓ Propiedad actualizada. Redirigiendo…</p>}

            <button type="submit" className="btn-cta publish-submit" disabled={loading || success}>
                {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
        </form>
    );
}
