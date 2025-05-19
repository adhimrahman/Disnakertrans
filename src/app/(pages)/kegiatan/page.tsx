import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ContactHightlight";
import KegiatanList from "@/components/ClientCompo/KegiatanList";
import { getKegiatan } from "@/lib/getKegiatan";

export const metadata: Metadata = {
	title: "Kegiatan Disnakertrans",
	description: "Lorem ipsum dolor ci amet anjay",
	icons: {
		icon: "/pemkabGowaLogo.svg"
	}
};

export default async function KegiatanPage() {
	const kegiatan = await getKegiatan();

	return (
    <>
    <Navbar />

    <section className="relative w-full h-[300px] sm:h-[350px]">
        <Image src="/images/Ilustrasi.jpeg" alt="Ilustrasi Header" fill className="object-cover object-center brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center text-center bg-gradient-to-b from-transparent to-black/50 pt-24 lg:pt-12">
            <h1 className="text-white text-3xl lg:text-5xl md:text-5xl font-bold shadow-md capitalize">
                Kegiatan - Kegiatan Disnaker
            </h1>
        </div>
    </section>

    <KegiatanList kegiatan={kegiatan} />

    <ContactHighlight />

    <ContactHighlight />
    <Footer />
    </>
	);
}
