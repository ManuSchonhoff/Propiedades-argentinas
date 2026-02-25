"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const STEPS = [
    { num: 1, label: "Ubicación" },
    { num: 2, label: "Detalles" },
    { num: 3, label: "Fotos" },
];

export default function PublishForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    /* Step 1: ubicación */
    const [op, setOp] = useState("buy");
    const [propertyType, setPropertyType] = useState("departamento");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [locationText, setLocationText] = useState("");

    /* Step 2: detalles */
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [areaM2, setAreaM2] = useState("");
    const [description, setDescription] = useState("");

    const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const canNext = () => {
        if (step === 1) return op && propertyType && province && city;
        if (step === 2) return title && price;
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const sb = supabaseBrowser();
            if (!sb) {
                setError("Supabase no configurado");
                setLoading(false);
                return;
            }

            const {
                data: { user },
            } = await sb.auth.getUser();

            if (!user) {
                setError("Debés estar logueado para publicar.");
                setLoading(false);
                return;
            }

            /* Plan limit check */
            const { count: activeCount } = await sb
                .from("listings")
                .select("id", { count: "exact", head: true })
                .eq("owner_id", user.id)
                .eq("status", "active");

            // Get user's active subscription limit
            const { data: activeSub } = await sb
                .from("subscriptions")
                .select("plan_id, plans(listing_limit)")
                .eq("user_id", user.id)
                .eq("status", "authorized")
                .limit(1)
                .maybeSingle();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const listingLimit = (activeSub as any)?.plans?.listing_limit ?? 1;
            if ((activeCount ?? 0) >= listingLimit) {
                setError(
                    `Alcanzaste el límite de ${listingLimit} publicación${listingLimit !== 1 ? "es" : ""} activa${listingLimit !== 1 ? "s" : ""}. Actualizá tu plan para publicar más.`
                );
                setLoading(false);
                return;
            }

            /* 1. Create listing */
            const { data: listing, error: insertErr } = await sb
                .from("listings")
                .insert({
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
                    status: "active",
                    owner_id: user.id,
                })
                .select("id")
                .single();

            if (insertErr || !listing) {
                setError(insertErr?.message ?? "Error al crear la publicación");
                setLoading(false);
                return;
            }

            /* 2. Upload images to Storage */
            const mediaInserts: { listing_id: string; url: string; sort_order: number }[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const ext = file.name.split(".").pop();
                const path = `${user.id}/${listing.id}/${i}.${ext}`;

                const { error: uploadErr } = await sb.storage
                    .from("property-images")
                    .upload(path, file, { upsert: true });

                if (!uploadErr) {
                    const {
                        data: { publicUrl },
                    } = sb.storage.from("property-images").getPublicUrl(path);

                    mediaInserts.push({
                        listing_id: listing.id,
                        url: publicUrl,
                        sort_order: i,
                    });
                }
            }

            /* If no images, use defaults */
            if (mediaInserts.length === 0) {
                mediaInserts.push(
                    { listing_id: listing.id, url: "/images/exterior.png", sort_order: 0 },
                    { listing_id: listing.id, url: "/images/interior.png", sort_order: 1 }
                );
            }

            /* 3. Insert listing_media */
            await sb.from("listing_media").insert(mediaInserts);

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Error inesperado. Intentá de nuevo.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="publish-form">
            {/* Progress bar */}
            <div className="wizard-progress">
                {STEPS.map((s) => (
                    <div key={s.num} className={`wizard-step ${step >= s.num ? "wizard-active" : ""} ${step > s.num ? "wizard-done" : ""}`}>
                        <div className="wizard-dot">
                            {step > s.num ? <i className="ph ph-check"></i> : s.num}
                        </div>
                        <span>{s.label}</span>
                    </div>
                ))}
                <div className="wizard-line">
                    <div className="wizard-line-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                </div>
            </div>

            {/* Step 1: Ubicación y tipo */}
            {step === 1 && (
                <div className="wizard-panel">
                    <h2>¿Qué querés publicar?</h2>
                    <p className="wizard-desc">Definí el tipo de operación y la ubicación de tu propiedad.</p>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="op">Operación *</label>
                            <select id="op" value={op} onChange={(e) => setOp(e.target.value)}>
                                <option value="buy">Venta</option>
                                <option value="rent">Alquiler</option>
                                <option value="temp">Temporario</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="propertyType">Tipo de propiedad *</label>
                            <select id="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
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
                            <label htmlFor="province">Provincia *</label>
                            <input id="province" type="text" required value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Ej: Buenos Aires" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ciudad *</label>
                            <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ej: Palermo" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="locationText">Ubicación detallada (opcional)</label>
                        <input id="locationText" type="text" value={locationText} onChange={(e) => setLocationText(e.target.value)} placeholder="Ej: Palermo Soho, cerca de Plaza Serrano" />
                    </div>
                </div>
            )}

            {/* Step 2: Detalles */}
            {step === 2 && (
                <div className="wizard-panel">
                    <h2>Detalles de la propiedad</h2>
                    <p className="wizard-desc">Agregá el título, precio y características de tu propiedad.</p>

                    <div className="form-group">
                        <label htmlFor="title">Título *</label>
                        <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Departamento 3 ambientes con balcón" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Precio *</label>
                            <input id="price" type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="450000" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="currency">Moneda</label>
                            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="USD">USD</option>
                                <option value="ARS">ARS</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row form-row-3">
                        <div className="form-group">
                            <label htmlFor="bedrooms">Dormitorios</label>
                            <input id="bedrooms" type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="2" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bathrooms">Baños</label>
                            <input id="bathrooms" type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="1" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="areaM2">Superficie m²</label>
                            <input id="areaM2" type="number" min="0" value={areaM2} onChange={(e) => setAreaM2(e.target.value)} placeholder="85" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describí la propiedad con el mayor detalle posible..." />
                    </div>
                </div>
            )}

            {/* Step 3: Fotos */}
            {step === 3 && (
                <div className="wizard-panel">
                    <h2>Fotos de la propiedad</h2>
                    <p className="wizard-desc">Subí imágenes para que tu publicación destaque. Si no subís fotos, se usarán imágenes genéricas.</p>

                    <div className="upload-zone">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFiles}
                            id="file-input"
                            className="upload-input"
                        />
                        <label htmlFor="file-input" className="upload-label">
                            <i className="ph ph-cloud-arrow-up"></i>
                            <span>Arrastrá o hacé click para subir imágenes</span>
                            <span className="upload-hint">JPG, PNG, WebP — Máx. 5MB cada una</span>
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="upload-preview-grid">
                            {files.map((f, i) => (
                                <div key={i} className="upload-preview-item">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={URL.createObjectURL(f)} alt={f.name} />
                                    <button type="button" className="upload-remove" onClick={() => removeFile(i)}>
                                        <i className="ph ph-x"></i>
                                    </button>
                                    <span>{f.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="upload-note">
                        {files.length > 0
                            ? `${files.length} imagen${files.length > 1 ? "es" : ""} seleccionada${files.length > 1 ? "s" : ""}`
                            : "Si no subís imágenes, se usarán fotos genéricas."}
                    </p>
                </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            {/* Navigation buttons */}
            <div className="wizard-nav">
                {step > 1 && (
                    <button type="button" className="btn-wizard-back" onClick={() => setStep(step - 1)}>
                        <i className="ph ph-arrow-left"></i> Anterior
                    </button>
                )}
                <div className="wizard-nav-spacer" />
                {step < 3 ? (
                    <button
                        type="button"
                        className="btn-cta"
                        disabled={!canNext()}
                        onClick={() => setStep(step + 1)}
                    >
                        Siguiente <i className="ph ph-arrow-right"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn-cta publish-submit" disabled={loading}>
                        {loading ? "Publicando..." : "Publicar Propiedad"}
                    </button>
                )}
            </div>
        </form>
    );
}
