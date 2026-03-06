"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
    { label: "Comprar", value: "buy" },
    { label: "Alquilar", value: "rent" },
    { label: "Temporario", value: "temp" },
] as const;

const LOCATIONS = [
    { label: "Todas las ubicaciones", value: "" },
    { label: "CABA", value: "CABA" },
    { label: "GBA Norte", value: "GBA Norte" },
    { label: "GBA Sur", value: "GBA Sur" },
    { label: "Córdoba", value: "Córdoba" },
    { label: "Mendoza", value: "Mendoza" },
    { label: "Rosario", value: "Rosario" },
];

const TYPES = [
    { label: "Todos los tipos", value: "" },
    { label: "Departamento", value: "departamento" },
    { label: "Casa", value: "casa" },
    { label: "PH", value: "ph" },
    { label: "Terreno", value: "terreno" },
    { label: "Local", value: "local" },
    { label: "Oficina", value: "oficina" },
];

const PRICES = [
    { label: "Cualquier precio", value: "" },
    { label: "Hasta USD 100.000", value: "100000" },
    { label: "Hasta USD 200.000", value: "200000" },
    { label: "Hasta USD 500.000", value: "500000" },
    { label: "Hasta USD 1.000.000", value: "1000000" },
];

export default function SearchFloater() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>("buy");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");

    const [locOpen, setLocOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("op", activeTab);
        if (location) params.set("loc", location);
        if (type) params.set("type", type);
        if (price) params.set("price", price);
        router.push(`/propiedades?${params.toString()}`);
    };

    const getLocLabel = () => LOCATIONS.find(l => l.value === location)?.label ?? "Ubicación";
    const getTypeLabel = () => TYPES.find(t => t.value === type)?.label ?? "Tipo";
    const getPriceLabel = () => PRICES.find(p => p.value === price)?.label ?? "Precio";

    return (
        <div className="glass-search-floater">
            <div className="search-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        className={activeTab === tab.value ? "active" : ""}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="search-inputs">
                {/* Location */}
                <div className="input-group">
                    <label>Ubicación</label>
                    <div className="styled-select-wrapper">
                        <button
                            className="styled-select-trigger"
                            onClick={() => { setLocOpen(!locOpen); setTypeOpen(false); setPriceOpen(false); }}
                        >
                            <span>{getLocLabel()}</span>
                            <span className="styled-select-caret">▾</span>
                        </button>
                        {locOpen && (
                            <div className="styled-select-options">
                                {LOCATIONS.map((loc) => (
                                    <button
                                        key={loc.value}
                                        className={`styled-select-option${location === loc.value ? " selected" : ""}`}
                                        onClick={() => { setLocation(loc.value); setLocOpen(false); }}
                                    >
                                        {loc.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="divider"></div>

                {/* Type */}
                <div className="input-group">
                    <label>Tipo de Propiedad</label>
                    <div className="styled-select-wrapper">
                        <button
                            className="styled-select-trigger"
                            onClick={() => { setTypeOpen(!typeOpen); setLocOpen(false); setPriceOpen(false); }}
                        >
                            <span>{getTypeLabel()}</span>
                            <span className="styled-select-caret">▾</span>
                        </button>
                        {typeOpen && (
                            <div className="styled-select-options">
                                {TYPES.map((t) => (
                                    <button
                                        key={t.value}
                                        className={`styled-select-option${type === t.value ? " selected" : ""}`}
                                        onClick={() => { setType(t.value); setTypeOpen(false); }}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="divider"></div>

                {/* Price */}
                <div className="input-group">
                    <label>Rango de Precio</label>
                    <div className="styled-select-wrapper">
                        <button
                            className="styled-select-trigger"
                            onClick={() => { setPriceOpen(!priceOpen); setLocOpen(false); setTypeOpen(false); }}
                        >
                            <span>{getPriceLabel()}</span>
                            <span className="styled-select-caret">▾</span>
                        </button>
                        {priceOpen && (
                            <div className="styled-select-options">
                                {PRICES.map((p) => (
                                    <button
                                        key={p.value}
                                        className={`styled-select-option${price === p.value ? " selected" : ""}`}
                                        onClick={() => { setPrice(p.value); setPriceOpen(false); }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button className="btn-search-dark" onClick={handleSearch}>
                    Buscar
                </button>
            </div>
        </div>
    );
}
