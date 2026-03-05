"use client";

import { Hero } from "@/components/ui/animated-hero";

export default function HeroSection() {
    return (
        <Hero
            title="Encontrá tu próximo"
            words={["hogar", "departamento", "lugar", "espacio"]}
            subtitle="La plataforma inmobiliaria de Argentina. Venta, alquiler y temporario."
        />
    );
}
