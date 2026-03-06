"use client";

import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

interface ScrollPreviewProps {
    images: { id: string; image: string; title: string }[];
    count: number;
}

export default function ScrollPreview({ images, count }: ScrollPreviewProps) {
    return (
        <ContainerScroll
            titleComponent={
                <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    letterSpacing: "-0.5px",
                }}>
                    Explorá nuestras{" "}
                    <strong style={{ fontWeight: 700 }}>{count} propiedades</strong>
                </h2>
            }
        >
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2px",
                height: "100%",
                width: "100%",
            }}>
                {images.map((img) => (
                    <div key={img.id} style={{ position: "relative", overflow: "hidden" }}>
                        <Image
                            src={img.image}
                            alt={img.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </div>
                ))}
            </div>
        </ContainerScroll>
    );
}
