import "swiper/css";
import "swiper/css/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Kegiatan from "../components/home/Kegiatan";
import LowonganCarousel from "../components/home/LowonganCarousel";
import InfografisSection from "../components/home/InfografisSection";
import ContactHighlight from "../components/ContactHightlight";

import Image from "next/image";
import kami from "../../public/images/kami.jpg"
import Gambar from "../../public/images/Gambar.jpg"
import Job1 from "../../public/images/Job1.png"
import Job2 from "../../public/images/Job2.png"

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<Navbar />

			<section className="relative w-full">
				<Image
					src={Gambar}
					alt="Hero Section"
					className="w-full h-[400px] object-cover object-[50%_20%]"
				/>
			</section>

			<section className="container mx-auto px-4 lg:px-20 py-12 flex flex-col lg:flex-row items-center justify-between bg-white">
				{/* Teks di Kiri */}
				<div className="lg:w-1/2 text-left">
					<h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900">
						Selamat Datang Di
					</h2>
					<h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-black mt-2">
						PORTAL INFORMASI DISNAKER KABUPATEN GOWA
					</h1>
					<div className="mt-6">
						<button className="bg-red-500 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-700 transition">
							Login
						</button>
					</div>
				</div>
	
				{/* Gambar di Kanan */}
				<div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
					<Image
						src={Job1}
						alt="Illustrasi Pekerja"
						className="w-full max-w-xs sm:max-w-md lg:max-w-lg"
					/>
				</div>w
			</section>
			
			<section className=" text-white py-16" style={{ backgroundColor: "#3561A1" }}>
				<div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
					<div className="lg:w-1/2 flex justify-center">
						<Image src={Job2} alt="w-full max-w-md lg:max-w-lg" />
					</div>
					<div className="lg:w-1/2 mt-10 lg:mt-0">
						<h2 className="text-3xl lg:text-4xl font-bold">Dinas Ketenagakerjaan dan Transmigrasi Gowa</h2>
						<p className="text-lg mt-4 leading-relaxed">
							Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
							in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
						</p>
					</div>
				</div>
			</section>

			<Kegiatan />

			<LowonganCarousel />
			
			<InfografisSection />
			
			<section className="py-16 bg-white">
				<div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
					<div className="lg:w-1/2 text-left">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							Tentang Kami
						</h2>
						<p className="text-lg text-gray-700 leading-relaxed">
							Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...
						</p>
					</div>
					<div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
						<Image
							src={kami}
							alt="About Us Illustration"
							className="w-full max-w-md rounded-3xl lg:max-w-lg"
						/>
					</div>
				</div>
			</section>
			
			<ContactHighlight />
			
			<Footer />
		</div>
	);
}