"use client";

import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-columns-1";

const testimonials: Testimonial[] = [
    {
        text: "Publicamos 40 propiedades en una semana y empezamos a recibir consultas reales desde el día 1.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        name: "Briana Patton",
        role: "Dueña de Inmobiliaria",
    },
    {
        text: "El panel es simple, la carga es rápida y el soporte responde. Nos ahorró muchísimo tiempo.",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        name: "Bilal Ahmed",
        role: "Gerente Comercial",
    },
    {
        text: "El diseño y la experiencia se sienten premium. La gente confía más y eso se nota en las consultas.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        name: "Saman Malik",
        role: "Broker Inmobiliario",
    },
    {
        text: "Pasamos de publicar en mil lados a concentrar todo acá. El resultado fue mejor conversión.",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        name: "Omar Raza",
        role: "Socio Director",
    },
    {
        text: "Las estadísticas nos ayudaron a entender qué propiedades estaban flojas y optimizarlas.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        name: "Zainab Hussain",
        role: "Operaciones",
    },
    {
        text: "La implementación fue rápida. En 1 día ya estábamos publicando y recibiendo mensajes.",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
        name: "Aliza Khan",
        role: "Administración",
    },
    {
        text: "Para nuestro equipo fue clave que sea simple. Nadie se pierde, nadie pregunta.",
        image: "https://randomuser.me/api/portraits/men/7.jpg",
        name: "Farhan Siddiqui",
        role: "Coordinador",
    },
    {
        text: "El sistema de destacados nos sirve para empujar lo que necesitamos mover primero.",
        image: "https://randomuser.me/api/portraits/women/8.jpg",
        name: "Sana Sheikh",
        role: "Ventas",
    },
    {
        text: "El tráfico y la calidad del lead es mejor. Menos curiosos, más interesados reales.",
        image: "https://randomuser.me/api/portraits/men/9.jpg",
        name: "Hassan Ali",
        role: "Marketing",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
    return (
        <section className="relative w-full overflow-hidden bg-white py-24 sm:py-32">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

                {/* Heading Block */}
                <div className="mx-auto flex max-w-[640px] flex-col items-center justify-center text-center">
                    <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
                        Testimonios
                    </div>
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        Lo que dicen las inmobiliarias
                    </h2>
                    <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                        Experiencias reales de equipos que ya publican y gestionan propiedades en la plataforma.
                    </p>
                </div>

                {/* Columns Wrapper */}
                <div
                    className="relative mt-16 flex h-[700px] w-full justify-center gap-6 overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
                    }}
                >
                    <TestimonialsColumn testimonials={firstColumn} duration={35} />
                    <TestimonialsColumn testimonials={secondColumn} duration={40} className="hidden md:flex" />
                    <TestimonialsColumn testimonials={thirdColumn} duration={37} className="hidden lg:flex" />
                </div>

            </div>
        </section>
    );
}
