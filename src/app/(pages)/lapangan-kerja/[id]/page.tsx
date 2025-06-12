import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ui/ContactHightlight";
import { getLowongan } from "@/lib/getLowongan";
import { getLowonganById } from "@/lib/getLowonganById";
import LowonganDetail from "@/components/ClientCompo/LowonganDetail";

export async function generateMetadata({ params }: { params: { id: string } }) {
	const { id } = await params;
	const data = await getLowonganById(id);
	if (!data) return { title: "Lowongan Tidak Ditemukan" };

	return {
		title: `Disnakertrans - ${data.Judul}`,
		description: data.Deskripsi?.slice(0, 150),
	};
}

export default async function LowonganDetailPage({ params }: { params: { id: string } }) {
	const { id } = await params;
	const lowongan = await getLowonganById(id);
	const semuaLowongan = await getLowongan();
	
	if (!lowongan) return notFound();

	return (
		<div className="bg-white min-h-screen flex flex-col">
			<Navbar />
			<LowonganDetail lowongan={lowongan} semuaLowongan={semuaLowongan} />
			<ContactHighlight />
			<Footer />
		</div>
	);
}