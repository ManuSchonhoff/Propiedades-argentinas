import NavbarPro from "@/components/NavbarPro";
import Footer from "@/components/Footer";

export default function ProLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarPro />
            {children}
            <Footer />
        </>
    );
}
