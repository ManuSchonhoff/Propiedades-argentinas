import Navbar from "@/components/Navbar";
import PublishForm from "@/components/PublishForm";

export default function PublicarPage() {
    return (
        <>
            <Navbar />
            <section className="content-section">
                <div className="text-block centered">
                    <h2>Publicar Propiedad</h2>
                    <p>Completá los datos de tu propiedad para publicarla.</p>
                </div>
                <PublishForm />
            </section>
        </>
    );
}
