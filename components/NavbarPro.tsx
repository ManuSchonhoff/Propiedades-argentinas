"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function NavbarPro() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <nav className={`pro-nav${scrolled ? " pro-nav--scrolled" : ""}`}>
            <div className="pro-nav-inner site-container">
                <Link href="/" className="logo">
                    PROPIEDADES ARGENTINAS
                </Link>

                <div className="pro-nav-links">
                    <button onClick={() => scrollTo("producto")} className="pro-nav-link">
                        Producto
                    </button>
                    <button onClick={() => scrollTo("como-funciona")} className="pro-nav-link">
                        Cómo funciona
                    </button>
                    <button onClick={() => scrollTo("planes")} className="pro-nav-link">
                        Planes
                    </button>
                    <button onClick={() => scrollTo("faq")} className="pro-nav-link">
                        FAQ
                    </button>
                </div>

                <div className="pro-nav-actions">
                    <Link href="/login" className="pro-nav-link">
                        Ingresar
                    </Link>
                    <Link href="/registro" className="btn-publish">
                        Crear cuenta
                    </Link>
                </div>
            </div>
        </nav>
    );
}
