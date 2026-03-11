"use client";

import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

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

const Testimonials = () => {
    return (
        <section className="bg-background my-20 relative">
            <div className="site-container z-10 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[640px] mx-auto"
                >
                    <div className="flex justify-center">
                        <div className="border py-1 px-4 rounded-lg">Testimonios</div>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter mt-5 text-center">
                        Lo que dicen las inmobiliarias
                    </h2>

                    <p className="text-center mt-5 opacity-75">
                        Experiencias reales de equipos que ya publican y gestionan propiedades en la plataforma.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
