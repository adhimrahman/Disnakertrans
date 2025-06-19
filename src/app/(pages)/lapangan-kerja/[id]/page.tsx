import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ui/ContactHightlight";
import { getLowongan } from "@/lib/getLowongan";
import { getLowonganById } from "@/lib/getLowonganById";
import LowonganDetail from "@/components/ClientCompo/LowonganDetail";

export default async function LowonganDetailPage({ params }: { params: { id: string } }) {
	const { id } = params;
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