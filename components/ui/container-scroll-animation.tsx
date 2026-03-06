"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
    titleComponent,
    children,
}: {
    titleComponent: string | React.ReactNode;
    children: React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReduced, setPrefersReduced] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReduced(mq.matches);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

    const rotate = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, -100]);

    // Static fallback on mobile or reduced motion
    if (isMobile || prefersReduced) {
        return (
            <div className="site-container" style={{ padding: "3rem 2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>{titleComponent}</div>
                <div style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e5e5e5",
                }}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                height: "40rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "0 2rem",
            }}
        >
            <div
                style={{
                    padding: "2rem 0",
                    width: "100%",
                    position: "relative",
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} />
                <Card rotate={rotate} translate={translate} scale={scale}>
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, titleComponent }: any) => {
    return (
        <motion.div
            style={{ translateY: translate, maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
        >
            {titleComponent}
        </motion.div>
    );
};

export const Card = ({
    rotate,
    scale,
    children,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    children: React.ReactNode;
}) => {
    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                boxShadow:
                    "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
                maxWidth: "900px",
                marginTop: "-0.5rem",
                marginLeft: "auto",
                marginRight: "auto",
                height: "22rem",
                width: "100%",
                border: "3px solid #6C6C6C",
                padding: "0.5rem",
                background: "#222222",
                borderRadius: "20px",
            }}
        >
            <div style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                borderRadius: "14px",
                background: "#f5f5f5",
            }}>
                {children}
            </div>
        </motion.div>
    );
};
