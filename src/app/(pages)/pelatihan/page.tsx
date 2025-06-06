import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ui/ContactHightlight";
import PelatihanList from "@/components/ClientCompo/PelatihanList";
import { getPelatihan } from "@/lib/getPelatihan";

export default async function PelatihanPage() {
	const pelatihan = await getPelatihan();

	return (
    <>
    <Navbar />

    <section className="relative w-full h-[300px] sm:h-[350px]">
        <Image src="/images/Ilustrasi.jpeg" alt="Ilustrasi Header" fill className="object-cover object-center brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center text-center bg-gradient-to-b from-transparent to-black/50 pt-24 lg:pt-12">
            <h1 className="text-white text-3xl lg:text-5xl md:text-5xl font-bold shadow-md capitalize">
                Pelatihan - Pelatihan LPK
            </h1>
        </div>
    </section>

    <PelatihanList pelatihan={pelatihan} />

    <ContactHighlight />
    <Footer />
    </>
	);
}