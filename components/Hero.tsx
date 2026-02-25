import Link from "next/link";

export default function Hero() {
    return (
        <section className="editorial-hero">
            <div className="hero-left">
                <h1 className="display-title">
                    Encuentra el lugar
                    <br />
                    al que llamarás hogar
                </h1>
                <Link href="/propiedades?op=buy" className="btn-dark">
                    Contactar Asesor
                </Link>
            </div>
            <div className="hero-right">
                <p className="hero-desc">
                    Con nosotros no solo encontrarás alojamiento, sino un lugar donde
                    comienza tu nueva vida. Experiencias inmobiliarias premium en
                    Argentina.
                </p>
            </div>
        </section>
    );
}
