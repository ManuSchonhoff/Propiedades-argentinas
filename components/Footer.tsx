import Link from "next/link";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <Link href="/" className="footer-logo">PROPIEDADES ARGENTINAS</Link>
                    <p>Experiencias inmobiliarias premium en Argentina.</p>
                </div>

                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Explorar</h4>
                        <Link href="/propiedades?op=buy">Comprar</Link>
                        <Link href="/propiedades?op=rent">Alquilar</Link>
                        <Link href="/propiedades?op=temp">Temporario</Link>
                        <Link href="/explorar">Modo Reel</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Empresa</h4>
                        <Link href="/nosotros">Nosotros</Link>
                        <Link href="#">Blog</Link>
                        <Link href="#">Contacto</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Publicar</h4>
                        <Link href="/publicar">Publicar propiedad</Link>
                        <Link href="/registro">Crear cuenta</Link>
                        <Link href="/login">Ingresar</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Propiedades Argentinas. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
