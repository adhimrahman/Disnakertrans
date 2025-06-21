import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { getKegiatan } from "@/lib/getKegiatan";
import { getKegiatanById } from "@/lib/getKegiatanById";
import KegiatanDetail from "@/components/ClientCompo/KegiatanDetail";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params; 
  const { id } = resolvedParams; 
	const data = await getKegiatanById(id);
	if (!data) return { title: "Kegiatan Tidak Ditemukan" };

	return {
		title: `Disnakertrans - ${data.Judul}`,
		description: data.Deskripsi?.slice(0, 150),
	};
};

export default async function KegiatanDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params; 
  const { id } = resolvedParams; 
	const kegiatan = await getKegiatanById(id);
	const semuaKegiatan = await getKegiatan();

	if (!kegiatan) return notFound();

	return (
		<>
			<Navbar />
			<KegiatanDetail kegiatan={kegiatan} semuaKegiatan={semuaKegiatan} />
			<Footer />
		</>
	);
};