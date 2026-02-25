import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Navbar() {
    return (
        <nav className="clean-nav">
            <Link href="/" className="logo">
                PROPIEDADES ARGENTINAS
            </Link>
            <div className="nav-links">
                <Link href="/propiedades?op=buy">
                    Propiedades <i className="ph ph-caret-down"></i>
                </Link>
                <Link href="/explorar">
                    Explorar <span className="nav-tag">Reel</span>
                </Link>
                <Link href="/nosotros">Nosotros</Link>
                <Link href="#">Blog</Link>
            </div>
            <div className="nav-actions">
                <Link href="/publicar" className="btn-publish">
                    Publicar propiedad
                </Link>
                <AuthButton />
            </div>
        </nav>
    );
}
