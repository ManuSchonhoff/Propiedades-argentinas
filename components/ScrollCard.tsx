"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface ScrollCardProps {
    children: ReactNode;
    delay?: number;
}

export default function ScrollCard({ children, delay = 0 }: ScrollCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect prefers-reduced-motion
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`scroll-card${inView ? " in-view" : ""}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
