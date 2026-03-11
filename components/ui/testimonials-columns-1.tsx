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
                                className="w-full max-w-xs rounded-3xl border border-zinc-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                                key={i}
                            >
                                <div className="text-[15px] leading-[1.6] text-zinc-600">"{text}"</div>
                                <div className="mt-5 flex items-center gap-3">
                                    <img
                                        width={40}
                                        height={40}
                                        src={image}
                                        alt={name}
                                        className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm"
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-[14px] font-semibold leading-5 tracking-tight text-zinc-900">
                                            {name}
                                        </div>
                                        <div className="text-[13px] leading-5 tracking-tight text-zinc-400">
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
