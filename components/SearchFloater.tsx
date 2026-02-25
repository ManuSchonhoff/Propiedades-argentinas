"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
    { label: "Comprar", value: "buy" },
    { label: "Alquilar", value: "rent" },
    { label: "Temporario", value: "temp" },
] as const;

const LOCATIONS = [
    "Buenos Aires, Todo el país",
    "CABA",
    "GBA Norte",
    "GBA Sur",
    "Córdoba",
    "Mendoza",
    "Rosario",
];

const TYPES = [
    { label: "Casa / Depto", value: "" },
    { label: "Departamento", value: "departamento" },
    { label: "Casa", value: "casa" },
    { label: "PH", value: "ph" },
    { label: "Terreno", value: "terreno" },
    { label: "Local", value: "local" },
    { label: "Oficina", value: "oficina" },
];

const PRICES = [
    { label: "Indistinto", value: "" },
    { label: "Hasta USD 100,000", value: "100000" },
    { label: "Hasta USD 200,000", value: "200000" },
    { label: "Hasta USD 500,000", value: "500000" },
    { label: "Hasta USD 1,000,000", value: "1000000" },
];

export default function SearchFloater() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>("buy");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("op", activeTab);
        if (location) params.set("loc", location);
        if (type) params.set("type", type);
        if (price) params.set("price", price);
        router.push(`/propiedades?${params.toString()}`);
    };

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
                <div className="input-group">
                    <label>Ubicación</label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="divider"></div>
                <div className="input-group">
                    <label>Tipo de Propiedad</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        {TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="divider"></div>
                <div className="input-group">
                    <label>Rango de Precio</label>
                    <select value={price} onChange={(e) => setPrice(e.target.value)}>
                        {PRICES.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn-search-dark" onClick={handleSearch}>
                    Buscar
                </button>
            </div>
        </div>
    );
}
