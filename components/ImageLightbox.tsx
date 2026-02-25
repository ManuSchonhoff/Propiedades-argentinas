"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface LightboxProps {
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
    const [idx, setIdx] = useState(initialIndex);

    const prev = useCallback(() => setIdx((i) => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
    const next = useCallback(() => setIdx((i) => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose, prev, next]);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={onClose}>
                    <i className="ph ph-x"></i>
                </button>

                <button className="lightbox-arrow lightbox-prev" onClick={prev}>
                    <i className="ph ph-caret-left"></i>
                </button>

                <div className="lightbox-image">
                    <Image
                        src={images[idx]}
                        alt={`Imagen ${idx + 1}`}
                        fill
                        style={{ objectFit: "contain" }}
                        priority
                    />
                </div>

                <button className="lightbox-arrow lightbox-next" onClick={next}>
                    <i className="ph ph-caret-right"></i>
                </button>

                <div className="lightbox-counter">
                    {idx + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}
