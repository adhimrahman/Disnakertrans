import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Kegiatan from "@/components/home/Kegiatan";
import LowonganCarousel from "@/components/home/LowonganCarousel";
import ContactHighlight from "@/components/ContactHightlight";
import InfografisSection from "@/components/home/InfografisSection";
import HeroCarousel from "@/components/home/Carousel";

import kami from "../../public/images/kami.jpg"
import Job1 from "../../public/images/Job1.png"
import Job2 from "../../public/images/Job2.png"

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<Navbar />

			<HeroCarousel />

			<section className="mx-auto px-4 lg:px-40 py-3 flex flex-col lg:flex-row items-center justify-between bg-gray-50">
				<div className="lg:w-1/2 text-left">
					<h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 capitalize">
						selamat datang di
					</h2>
					<h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-black mt-2 uppercase">
						portal informasi disnaker kabupaten gowa
					</h1>
					<button className="bg-red-500 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-700 mt-6
					transition hover:cursor-pointer capitalize">
						Login
					</button>
				</div>
	
				<Image src={Job1} alt="Illustrasi Pekerja" className="lg:w-1/2 p-2 w-full max-w-xs sm:max-w-md lg:max-w-lg mt-10 lg:mt-0 flex justify-center" />
			</section>
			
			<section className="py-20 text-white bg-darkBlue">
				<div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-12">
					<div className="lg:w-1/2 flex justify-center">
						<Image src={Job2} alt="Ilustrasi Ketenagakerjaan" className="w-full max-w-md lg:max-w-lg rounded-xl shadow-xl object-contain" />
					</div>
					<div className="lg:w-1/2 text-center lg:text-left">
						<h2 className="text-3xl lg:text-5xl font-bold mb-6 capitalize">
							Dinas Ketenagakerjaan <br /> dan Transmigrasi Gowa
						</h2>
						<p className="text-lg leading-relaxed text-justify">
							Dinas Ketenagakerjaan dan Transmigrasi Gowa hadir sebagai motor penggerak pembangunan SDM
							berdaya saing tinggi di Kabupaten Gowa. Melalui program kerja, pelatihan, transmigrasi,
							dan pendampingan dunia kerja, kami berkomitmen menciptakan lapangan kerja produktif
							dan berkelanjutan untuk seluruh lapisan masyarakat.
						</p>
					</div>

				</div>
			</section>

			<Kegiatan />

			<LowonganCarousel />
			
			<InfografisSection />
			
            <section className="py-20 bg-gray-50">
				<div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-16">
					<div className="lg:w-1/2 text-center lg:text-left">
						<h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 capitalize">
							Tentang Kami
						</h2>
						<p className="text-lg text-gray-700 leading-relaxed text-justify">
							Dinas Ketenagakerjaan Gowa memiliki komitmen untuk meningkatkan kualitas
							sumber daya manusia dan menciptakan lapangan kerja yang inklusif dan berkelanjutan.
							Melalui berbagai program pelatihan, pendampingan pencari kerja, serta kerjasama dengan
							berbagai pihak, kami hadir untuk memberikan solusi ketenagakerjaan yang nyata bagi masyarakat.
						</p>
					</div>

					<div className="lg:w-1/2 flex justify-center">
						<Image src={kami} alt="Ilustrasi Tentang Kami" className="h-[460px] w-auto object-cover rounded-3xl shadow-lg hover:scale-105 transition duration-300" />
					</div>
				</div>
			</section>
			
			<ContactHighlight />
			
			<Footer />
		</div>
	);
}