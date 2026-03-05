import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IAContent from "./IAContent";

export const metadata: Metadata = {
    title: "Asistente IA | Propiedades Argentinas",
    description: "Usá inteligencia artificial para encontrar tu propiedad ideal en Argentina. Búsqueda inteligente y recomendaciones personalizadas.",
};

export default function IAPage() {
    return (
        <>
            <Navbar />
            <IAContent />
            <Footer />
        </>
    );
}
