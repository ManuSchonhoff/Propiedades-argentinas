"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ContainerScrollProps {
    children: React.ReactNode;
    titleComponent?: React.ReactNode;
    className?: string;
}

export function ContainerScroll({ children, titleComponent, className }: ContainerScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn("relative flex flex-col items-center py-16", className)}
            ref={containerRef}
        >
            {titleComponent && (
                <div className="mb-10 text-center max-w-3xl mx-auto px-4">
                    {titleComponent}
                </div>
            )}
            <div className="relative w-full max-w-5xl mx-auto px-4">
                <div
                    className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/50
                               transform transition-all duration-700
                               hover:scale-[1.02] hover:shadow-3xl"
                    style={{
                        perspective: "1000px",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-10 rounded-2xl" />
                    {children}
                </div>
            </div>
        </div>
    );
}
