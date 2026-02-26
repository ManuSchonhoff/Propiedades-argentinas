"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Close menu on ESC key
    useEffect(() => {
        if (!menuOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [menuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const toggleMenu = useCallback(() => {
        setMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
    }, []);

    return (
        <nav className="clean-nav">
            <Link href="/" className="logo">
                PROPIEDADES ARGENTINAS
            </Link>

            {/* Hamburger toggle — visible only <900px via CSS */}
            <button
                className="nav-toggle"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
            >
                <span className={`nav-toggle-bar${menuOpen ? " open" : ""}`} />
                <span className={`nav-toggle-bar${menuOpen ? " open" : ""}`} />
                <span className={`nav-toggle-bar${menuOpen ? " open" : ""}`} />
            </button>

            {/* Overlay backdrop */}
            <div
                className={`mobile-menu-overlay${menuOpen ? " open" : ""}`}
                onClick={closeMenu}
            />

            {/* Mobile drawer / desktop inline */}
            <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
                <div className="nav-links">
                    <Link href="/propiedades?op=buy">
                        Propiedades <i className="ph ph-caret-down"></i>
                    </Link>
                    <Link href="/explorar">
                        Explorar <span className="nav-tag">Reel</span>
                    </Link>
                    <Link href="/nosotros">Nosotros</Link>
                    <Link href="/pricing">Planes</Link>
                </div>
                <div className="nav-actions">
                    <Link href="/publicar" className="btn-publish">
                        Publicar propiedad
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
}
