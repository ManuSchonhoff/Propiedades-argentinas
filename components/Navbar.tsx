"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [menuOpen]);

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

            <div
                className={`mobile-menu-overlay${menuOpen ? " open" : ""}`}
                onClick={closeMenu}
            />

            <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
                <div className="nav-links">
                    {/* Dropdown for Propiedades */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="nav-dropdown-trigger">
                            Propiedades <span className="nav-caret">▾</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => router.push("/propiedades")}>
                                Ver todas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push("/propiedades?op=buy")}>
                                Comprar
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/propiedades?op=rent")}>
                                Alquilar
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/propiedades?op=temp")}>
                                Temporario
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push("/propiedades?type=casa")}>
                                Casas
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/propiedades?type=depto")}>
                                Departamentos
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/propiedades?type=terreno")}>
                                Terrenos
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/explorar">
                        Explorar <span className="nav-tag">Reel</span>
                    </Link>
                    <Link href="/ia">IA <span className="tag-new">New</span></Link>
                    <Link href="/nosotros">Nosotros</Link>
                </div>
                <div className="nav-actions">
                    <Link href="/pro" className="btn-publish">
                        Publicar propiedad
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
}
