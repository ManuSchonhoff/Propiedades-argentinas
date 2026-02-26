"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface UserInfo {
    id: string;
    email?: string;
}

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sb = supabaseBrowser();
        if (!sb) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const init = async () => {
            const { data } = await sb.auth.getUser();
            if (cancelled) return;
            const u = data.user;
            setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
            setLoading(false);
        };

        init();

        const {
            data: { subscription },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } = sb.auth.onAuthStateChange((_event: any, session: any) => {
            const u = session?.user;
            setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const sb = supabaseBrowser();
        if (!sb) return;
        await sb.auth.signOut();
        setUser(null);
        router.push("/");
        router.refresh();
    };

    if (loading) return null;

    if (user) {
        return (
            <div className="auth-buttons">
                <Link href="/dashboard" className="nav-link-auth">
                    Mi Panel
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                    Salir
                </button>
            </div>
        );
    }

    return (
        <Link href="/login" className="btn-publish">
            Ingresar
        </Link>
    );
}
