"use client";

import { cn } from "@/lib/utils";

interface GlowingEffectProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    disabled?: boolean;
}

export function GlowingEffect({ children, className, glowColor, disabled }: GlowingEffectProps) {
    if (disabled) return <>{children}</>;

    return (
        <div className={cn("relative group", className)}>
            {/* Glow background */}
            <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                    background: glowColor ??
                        "linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.15), rgba(0,0,0,0.08))",
                }}
            />
            {/* Border glow */}
            <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: glowColor ??
                        "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.05))",
                }}
            />
            {/* Content */}
            <div className="relative bg-white rounded-2xl">
                {children}
            </div>
        </div>
    );
}
