"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
    title: string;
    words: string[];
    subtitle?: string;
}

function Hero({ title, words, subtitle }: HeroProps) {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(() => words, [words]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full">
            <div className="site-container">
                <div style={{ display: "flex", gap: "1rem", padding: "3rem 0 1.5rem", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            letterSpacing: "-1.5px",
                            textAlign: "center",
                            lineHeight: 1.1,
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}>
                            <span>{title}</span>
                            <span style={{ position: "relative", display: "flex", width: "100%", justifyContent: "center", overflow: "hidden", textAlign: "center", paddingBottom: "0.25rem", paddingTop: "0.15rem", minHeight: "1.3em" }}>
                                &nbsp;
                                {titles.map((word, index) => (
                                    <motion.span
                                        key={index}
                                        style={{ position: "absolute", fontWeight: 600 }}
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? { y: 0, opacity: 1 }
                                                : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                                        }
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        {subtitle && (
                            <p style={{
                                fontSize: "1rem",
                                lineHeight: 1.6,
                                color: "var(--text-secondary)",
                                maxWidth: "500px",
                                textAlign: "center",
                                margin: "0 auto",
                            }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero };
