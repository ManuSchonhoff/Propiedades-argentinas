"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
    listingId: string;
    listingTitle: string;
}

export default function ContactForm({
    listingId,
    listingTitle,
}: ContactFormProps) {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
        "idle"
    );
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState(
        `Hola, me interesa "${listingTitle}". ¿Podrían darme más información?`
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listing_id: listingId,
                    name,
                    phone,
                    email,
                    message,
                }),
            });

            const data = await res.json();
            setStatus(data.ok ? "sent" : "error");
        } catch {
            setStatus("error");
        }
    };

    if (status === "sent") {
        return (
            <div className="contact-card">
                <h3>¡Consulta enviada!</h3>
                <p style={{ color: "#6e6e73", lineHeight: 1.6 }}>
                    Recibimos tu mensaje. El anunciante se pondrá en contacto a la
                    brevedad.
                </p>
            </div>
        );
    }

    return (
        <div className="contact-card">
            <h3>Contactar al anunciante</h3>

            <a
                href={`https://wa.me/5491100000000?text=${encodeURIComponent(
                    `Hola, me interesa la propiedad "${listingTitle}". ¿Podrían darme más información?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
            >
                <i className="ph ph-whatsapp-logo"></i> Enviar WhatsApp
            </a>

            <form onSubmit={handleSubmit} style={{ display: "contents" }}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Tu nombre *"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        placeholder="Tu teléfono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Tu mensaje"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn-submit"
                    disabled={status === "sending"}
                >
                    {status === "sending" ? "Enviando..." : "Enviar Consulta"}
                </button>
                {status === "error" && (
                    <p style={{ color: "#e11d48", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                        Hubo un error. Intentá de nuevo.
                    </p>
                )}
            </form>
        </div>
    );
}
