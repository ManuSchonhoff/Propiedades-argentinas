"use client";

import { TestimonialsColumn, TestimonialItem } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials: TestimonialItem[] = [
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

const Testimonials = () => {
    return (
        <section style={{ margin: "5rem 0", position: "relative", overflow: "hidden" }}>
            <div className="site-container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "540px",
                        margin: "0 auto 2.5rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "0.25rem 1rem",
                            fontSize: "0.8rem",
                            marginBottom: "1rem",
                            color: "#6e6e73",
                        }}
                    >
                        Testimonios
                    </div>

                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                            letterSpacing: "-0.5px",
                            lineHeight: 1.1,
                            marginBottom: "0.75rem",
                            color: "#121212",
                        }}
                    >
                        Lo que dicen las inmobiliarias
                    </h2>
                    <p style={{ color: "#6e6e73", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
                        Experiencias reales de equipos que ya publican y gestionan propiedades en la plataforma.
                    </p>
                </motion.div>

                {/* Columns */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1.5rem",
                        maxHeight: "740px",
                        overflow: "hidden",
                        maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
                    }}
                >
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
