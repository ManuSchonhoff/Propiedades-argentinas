"use client";

import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

interface ScrollPreviewProps {
    images: { id: string; image: string; title: string }[];
    count: number;
}

export default function ScrollPreview({ images, count }: ScrollPreviewProps) {
    return (
        <div className="flex flex-col overflow-hidden">
            <ContainerScroll
                titleComponent={
                    <h2 className="text-4xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                        Explorá nuestras <br />
                        <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                            {count} propiedades
                        </span>
                    </h2>
                }
            >
                <div className="grid grid-cols-2 gap-1 h-full w-full">
                    {images.map((img) => (
                        <div key={img.id} className="relative overflow-hidden">
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
        </div>
    );
}
