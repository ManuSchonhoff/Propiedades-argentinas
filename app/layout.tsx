import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Propiedades Argentinas | Inicio",
    description:
        "Encontrá tu próximo hogar en Argentina. Alquiler, venta y experiencias inmobiliarias premium.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
                <Script
                    src="https://unpkg.com/@phosphor-icons/web"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
