import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Kegiatan from "@/components/home/Kegiatan";
import LowonganCarousel from "@/components/home/LowonganCarousel";
import ContactHighlight from "@/components/ContactHightlight";
import InfografisSection from "@/components/home/InfografisSection";

import kami from "../../public/images/kami.jpg"
import Job1 from "../../public/images/Job1.png"
import Job2 from "../../public/images/Job2.png"
import Gambar from "../../public/images/Gambar.png"

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<Navbar />

			<Image src={Gambar} alt="Hero Section" className="w-full h-[400px] object-cover object-[50%_20%]" />

			<section className="mx-auto px-4 lg:px-40 py-12 flex flex-col lg:flex-row items-center justify-between bg-white">
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
	
				<Image src={Job1} alt="Illustrasi Pekerja" className="lg:w-1/2 w-full max-w-xs sm:max-w-md lg:max-w-lg mt-10 lg:mt-0 flex justify-center" />
			</section>
			
			<section className=" text-white py-16 bg-steelBlue">
				<div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
					<Image src={Job2} alt="" className="lg:w-full w-1/2 max-w-md lg:max-w-lg" />
					<div className="lg:w-1/2 mt-10 lg:mt-0 pl-2">
						<h2 className="text-3xl lg:text-4xl font-bold capitalize">dinas ketenagakerjaan dan transmigrasi gowa</h2>
						<p className="text-lg mt-4 leading-relaxed text-justify">
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
			
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10">
                    <div className="lg:w-1/2 flex flex-col justify-start h-full">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 capitalize">
                            tentang kami
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed text-justify">
                            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
    
                    <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
                        <Image src={kami}  alt="About Us Illustration" className="h-[500px] w-auto object-cover rounded-3xl" />
                    </div>
                </div>
            </section>
			
			<ContactHighlight />
			
			<Footer />
		</div>
	);
}