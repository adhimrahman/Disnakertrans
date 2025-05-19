import { Metadata } from "next";
import Image from "next/image";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactHighlight from '@/components/ContactHightlight';
import LowonganList from "@/components/ClientCompo/LowonganList";
import { getLowongan } from "@/lib/getLowongan";

export const metadata: Metadata = {
	title: "Lowongan Kerja | Disnakertrans",
	description: "Lorem ipsum dolor ci amet anjay",
	icons: {
		icon: "/pemkabGowaLogo.svg"
	}
};

export default async function LowonganPage() {
    const lowongan = await getLowongan();

    return (
    <>
    <Navbar />
    
    <section className="relative w-full h-[300px] sm:h-[350px]">
        <Image src="/images/Gambar5.jpg" alt="Ilustrasi Header" fill className="object-cover object-center brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center text-center bg-gradient-to-b from-transparent to-black/50 pt-24 lg:pt-12">
            <h1 className="text-white text-3xl lg:text-5xl font-bold shadow-md capitalize">
                lowongan pekerjaan gowa
            </h1>
        </div>
    </section>

    <LowonganList lowongan={lowongan} /> 

    <ContactHighlight />
    <Footer />
    </>
    )
}