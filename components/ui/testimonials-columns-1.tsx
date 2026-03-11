"use client";
import React from "react";
import { motion } from "motion/react";

export type TestimonialItem = {
    text: string;
    image: string;
    name: string;
    role: string;
};

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: TestimonialItem[];
    duration?: number;
}) => {
    return (
        <div className={props.className} style={{ width: "320px", flexShrink: 0 }}>
            <motion.div
                animate={{ translateY: "-50%" }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "1.5rem" }}
            >
                {[...new Array(2).fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        {props.testimonials.map(({ text, image, name, role }, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "2rem",
                                    borderRadius: "1.5rem",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.06)",
                                    background: "#ffffff",
                                    width: "100%",
                                    maxWidth: "300px",
                                    boxSizing: "border-box",
                                }}
                            >
                                <p style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "#121212", margin: 0 }}>{text}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "1.25rem" }}>
                                    <img
                                        width={40}
                                        height={40}
                                        src={image}
                                        alt={name}
                                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                    />
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{ fontWeight: 600, fontSize: "0.875rem", lineHeight: "1.25", letterSpacing: "-0.01em", color: "#121212" }}>
                                            {name}
                                        </span>
                                        <span style={{ fontSize: "0.8rem", lineHeight: "1.25", color: "#6e6e73" }}>
                                            {role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))]}
            </motion.div>
        </div>
    );
};
