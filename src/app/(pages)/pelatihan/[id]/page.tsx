import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { getPelatihan } from "@/lib/getPelatihan";
import { getPelatihanById } from "@/lib/getPelatihanById";
import PelatihanDetail from "@/components/ClientCompo/PelatihanDetail";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = await params;
    const data = await getPelatihanById(id);
    if (!data) return { title: "Pelatihan Tidak Ditemukan" };

    return {
        title: `Disnakertrans - ${data.Judul}`,
        description: data.Deskripsi?.slice(0, 150),
    };
}

export default async function PelatihanDetailPage({ params }: { params: { id: string } }) {
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