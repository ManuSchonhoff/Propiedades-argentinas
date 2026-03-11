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
                animate={{
                    translateY: "-50%",
                }}
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
                                key={i}
                                className="w-full max-w-[320px] rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]"
                            >
                                <p className="text-[15px] leading-relaxed text-gray-700">{text}</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <img
                                        src={image}
                                        alt={name}
                                        width={44}
                                        height={44}
                                        className="h-11 w-11 shrink-0 rounded-full object-cover shadow-sm"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                                            {name}
                                        </span>
                                        <span className="text-[13px] text-gray-500">{role}</span>
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
