import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import EditForm from "@/components/EditForm";
import { supabaseAuth } from "@/lib/supabase/auth";

export const revalidate = 0;

export default async function EditarListingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const sb = await supabaseAuth();
    const {
        data: { user },
    } = await sb.auth.getUser();

    if (!user) redirect("/login");

    const { data: listing } = await sb
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("owner_id", user.id)
        .single();

    if (!listing) redirect("/dashboard");

    return (
        <>
            <Navbar />
            <section className="content-section">
                <div className="text-block centered">
                    <h2>Editar Propiedad</h2>
                    <p>Modificá los datos y guardá los cambios.</p>
                </div>
                <EditForm listing={listing} />
            </section>
        </>
    );
}
