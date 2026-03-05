"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface AnimatedHeroProps {
    title: string;
    rotatingWords: string[];
    subtitle?: string;
    className?: string;
}

export function AnimatedHero({ title, rotatingWords, subtitle, className }: AnimatedHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const rotate = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % rotatingWords.length);
            setIsVisible(true);
        }, 300);
    }, [rotatingWords.length]);

    useEffect(() => {
        const interval = setInterval(rotate, 3000);
        return () => clearInterval(interval);
    }, [rotate]);

    return (
        <div className={cn("text-center py-12 px-4", className)}>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-[var(--text-primary)] font-[var(--font-display)]"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px" }}>
                {title}{" "}
                <span
                    className={cn(
                        "inline-block transition-all duration-300 bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    )}
                >
                    {rotatingWords[currentIndex]}
                </span>
            </h1>
            {subtitle && (
                <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
