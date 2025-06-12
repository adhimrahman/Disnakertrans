import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { getKegiatan } from "@/lib/getKegiatan";
import { getKegiatanById } from "@/lib/getKegiatanById";
import KegiatanDetail from "@/components/ClientCompo/KegiatanDetail";

export async function generateMetadata({ params }: { params: { id: string } }) {
	const data = await getKegiatanById(params.id);
	if (!data) return { title: "Kegiatan Tidak Ditemukan" };

	return {
		title: `Disnakertrans - ${data.Judul}`,
		description: data.Deskripsi?.slice(0, 150),
	};
}

export default async function KegiatanDetailPage({ params }: { params: { id: string } }) {
	const kegiatan = await getKegiatanById(params.id);
	const semuaKegiatan = await getKegiatan();

	if (!kegiatan) return notFound();

	return (
		<>
			<Navbar />
			<KegiatanDetail kegiatan={kegiatan} semuaKegiatan={semuaKegiatan} />
			<Footer />
		</>
	);
}