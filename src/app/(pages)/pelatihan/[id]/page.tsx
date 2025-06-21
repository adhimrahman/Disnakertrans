import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { getPelatihan } from "@/lib/getPelatihan";
import { getPelatihanById } from "@/lib/getPelatihanById";
import PelatihanDetail from "@/components/ClientCompo/PelatihanDetail";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params; 
	const { id } = resolvedParams;
    const data = await getPelatihanById(id);
    if (!data) return { title: "Pelatihan Tidak Ditemukan" };

    return {
        title: `Disnakertrans - ${data.judul}`,
        description: data.deskripsi?.slice(0, 150),
    };
}

export default async function PelatihanDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params; 
	const { id } = resolvedParams;
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