"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface AuthFormProps {
    mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const sb = supabaseBrowser();
        if (!sb) {
            setError("Supabase no está configurado. Verificá .env.local");
            setLoading(false);
            return;
        }

        if (mode === "register") {
            const { error: err } = await sb.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/dashboard` },
            });
            if (err) {
                setError(err.message);
                setLoading(false);
                return;
            }
            setError("Revisá tu email para confirmar tu cuenta.");
            setLoading(false);
        } else {
            const { error: err } = await sb.auth.signInWithPassword({
                email,
                password,
            });
            if (err) {
                setError(err.message);
                setLoading(false);
                return;
            }
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>{mode === "login" ? "Ingresar" : "Crear Cuenta"}</h1>
                <p className="auth-subtitle">
                    {mode === "login"
                        ? "Accedé a tu panel de propiedades"
                        : "Publicá tus propiedades en minutos"}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading
                            ? "Procesando..."
                            : mode === "login"
                                ? "Ingresar"
                                : "Crear Cuenta"}
                    </button>
                </form>

                <p className="auth-switch">
                    {mode === "login" ? (
                        <>
                            ¿No tenés cuenta?{" "}
                            <Link href="/registro">Registrate</Link>
                        </>
                    ) : (
                        <>
                            ¿Ya tenés cuenta?{" "}
                            <Link href="/login">Ingresá</Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
