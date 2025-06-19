import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { getPelatihan } from "@/lib/getPelatihan";
import { getPelatihanById } from "@/lib/getPelatihanById";
import PelatihanDetail from "@/components/ClientCompo/PelatihanDetail";

export default async function PelatihanDetailPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const pelatihan = await getPelatihanById(id);
    const semuaPelatihan = await getPelatihan();

    if (!pelatihan) return notFound();

    return (
        <>
            <Navbar />
            <PelatihanDetail pelatihan={pelatihan} semuaPelatihan={semuaPelatihan} />
            <Footer />
        </>
    );
}