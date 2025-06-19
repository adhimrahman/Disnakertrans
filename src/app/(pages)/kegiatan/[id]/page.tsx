import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import { getKegiatan } from "@/lib/getKegiatan";
import { getKegiatanById } from "@/lib/getKegiatanById";
import KegiatanDetail from "@/components/ClientCompo/KegiatanDetail";

export default async function KegiatanDetailPage({
  	params,
}: {
  	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
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
}