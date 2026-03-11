"use client";
import React from "react";
import { motion } from "motion/react";

export type Testimonial = {
    text: string;
    image: string;
    name: string;
    role: string;
};

export const TestimonialsColumn = ({
    testimonials,
    className = "",
    duration = 15,
}: {
    testimonials: Testimonial[];
    className?: string;
    duration?: number;
}) => {
    return (
        <div className={`w-[320px] shrink-0 ${className}`}>
            <motion.div
                initial={{ y: 0 }}
                animate={{
                    y: "-50%",
                }}
                style={{ willChange: "transform" }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2).fill(0)].map((_, index) => (
                    <React.Fragment key={index}>
                        {testimonials.map(({ text, image, name, role }, i) => (
                            <div
                                className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-background"
                                key={i}
                            >
                                <div className="text-foreground">{text}</div>
                                <div className="flex items-center gap-2 mt-5">
                                    <img
                                        width={40}
                                        height={40}
                                        src={image}
                                        alt={name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <div className="font-medium tracking-tight leading-5 text-foreground">
                                            {name}
                                        </div>
                                        <div className="leading-5 opacity-60 tracking-tight text-foreground">
                                            {role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};
