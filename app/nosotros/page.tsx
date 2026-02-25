import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NosotrosPage() {
    return (
        <>
            <Navbar />
            <section className="content-section">
                <div className="about-hero">
                    <h1 className="dash-title">Sobre Nosotros</h1>
                    <p className="about-lead">
                        En Propiedades Argentinas conectamos personas con los espacios que transformarán su vida.
                        Desde departamentos premium en Buenos Aires hasta casas de campo en la Patagonia.
                    </p>
                </div>

                <div className="about-grid">
                    <div className="about-card">
                        <i className="ph ph-buildings"></i>
                        <h3>+500 Propiedades</h3>
                        <p>Cubrimos todo el territorio argentino con las mejores ofertas inmobiliarias.</p>
                    </div>
                    <div className="about-card">
                        <i className="ph ph-handshake"></i>
                        <h3>Confianza</h3>
                        <p>Verificamos cada propiedad y trabajamos con inmobiliarias certificadas.</p>
                    </div>
                    <div className="about-card">
                        <i className="ph ph-rocket-launch"></i>
                        <h3>Tecnología</h3>
                        <p>Plataforma moderna con búsqueda inteligente y experiencias inmersivas.</p>
                    </div>
                </div>

                <div className="about-mission">
                    <h2>Nuestra Misión</h2>
                    <p>
                        Democratizar el acceso a propiedades de calidad en Argentina, combinando tecnología
                        de vanguardia con el trato humano que caracteriza al sector inmobiliario. Creemos que
                        encontrar tu próximo hogar debería ser una experiencia inspiradora, no un dolor de cabeza.
                    </p>
                </div>
            </section>
            <Footer />
        </>
    );
}
