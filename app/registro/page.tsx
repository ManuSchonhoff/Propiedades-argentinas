import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";

export default function RegistroPage() {
    return (
        <>
            <Navbar />
            <AuthForm mode="register" />
        </>
    );
}
