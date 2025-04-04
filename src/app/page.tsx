"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function HomePage() {
	const [tenagaKerja, setTenagaKerja] = useState(0);
	const [pencariKerja, setPencariKerja] = useState(0);
	const [pelatihan, setPelatihan] = useState(0);

	useEffect(() => {
		const targetTenagaKerja = 1113;
		const targetPencariKerja = 1113;
		const targetPelatihan = 1113;
		const duration = 2000;

		let startTime = Date.now();
		const updateCounter = () => {
			const elapsedTime = Date.now() - startTime;
			const progress = Math.min(elapsedTime / duration, 1);

			setTenagaKerja(Math.floor(progress * targetTenagaKerja));
			setPencariKerja(Math.floor(progress * targetPencariKerja));
			setPelatihan(Math.floor(progress * targetPelatihan));
			
			if (progress < 1) {
				requestAnimationFrame(updateCounter);
			}
		};

		requestAnimationFrame(updateCounter);
	}, []);

	return (
		<div className="min-h-screen">
		  <Navbar />
	
		  {/* Hero Section */}
		  <section className="relative w-full">
			<img
			  src="/images/Gambar.jpg"
			  alt="Hero Section"
			  className="w-full h-[400px] object-cover object-[50%_20%]"
			/>
		  </section>
  
		  <section className="container bg-white mx-auto lg:px-20 flex flex-col lg:flex-row items-center justify-between min-h-[500px]">
		  {/* Teks di Kiri */}
		  <div className="lg:w-1/2 text-left">
			<h2 className="text-2xl lg:text-4xl font-bold text-gray-900">
			  Selamat Datang Di
			</h2>
			<h1 className="text-3xl lg:text-5xl font-extrabold text-black mt-2">
			  PORTAL INFORMASI DISNAKER KABUPATEN GOWA
			</h1>
			<div className="mt-6">
			  <button className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition">
				Login
			  </button>
			</div>
		  </div>
  
		  {/* Gambar di Kanan */}
		  <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
			<img
			  src="/images/Job1.png"
			  alt="Illustrasi Pekerja"
			  className="w-full max-w-md lg:max-w-lg"
			/>
		  </div>
		</section>
  
		<section className=" text-white py-16" style={{ backgroundColor: "#3561A1" }}>
		  <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
			  <div className="lg:w-1/2 flex justify-center">
			  <img src="/images/Job2.png" alt="w-full max-w-md lg:max-w-lg" /></div>
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
  
		<section className="py-16 bg-gray-100">
		  <div>
			  <h2 className="text-3xl lg:text-4xl font-bold text-left ml-10 mb-10 text-black">
				  Kegiatan - Kegiatan Disnaker Gowa
			  </h2>
  
			  <Swiper
				  modules={[Navigation]}
				  spaceBetween={20}
				  slidesPerView={3}
				  navigation
				  className='px-4'
			  >
				  {/* Card 1 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
  
				  {/* Card 2 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
  
				  {/* Card 3 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
  
				  {/* Card 4 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
			  </Swiper>
		  </div>
		</section>
  
		<section className="py-16 bg-gray-100 ,-">
		  <div>
			  <h2 className="text-3xl lg:text-4xl font-bold text-left ml-10 mb-10 text-black">
				  Lowongan Pekerjaan di Gowa
			  </h2>
  
			  <Swiper
				  modules={[Navigation]}
				  spaceBetween={20}
				  slidesPerView={3}
				  navigation
				  className='px-4'
			  >
				  {/* Card 1 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
  
				  {/* Card 2 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
  
				  {/* Card 3 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
  
				  {/* Card 4 */}
				  <SwiperSlide>
					  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
						  <div className="bg-gray-300 h-40"></div>
						  <div className="p-4 text-center">
							  <p className="text-gray-700">
								  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
								  tempor incididunt ut labore et dolore magna aliqua.
							  </p>
							  <a href="#" className="text-blue-600 hover:underline mt-2 block">
								  Lihat selengkapnya...
							  </a>
						  </div>
					  </div>
				  </SwiperSlide>
			  </Swiper>
		  </div>
		</section>
  
		<section className="text-white py-16" style={{ backgroundColor: "#3561A1" }}>
		  <div className="container mx-auto px-6 lg:px-20 text-center">
			  <h2 className="text-3xl lg:text-4xl font-bold mb-10">
				  Infografis Ketenagakerjaan Gowa
			  </h2>
  
			  {/* Grid kolom 3 */}
			  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
				  <div>
					  <p className="text-lg font-semibold">Jumlah Tenaga Kerja</p>
					  <p className="text-4xl font-bold mt-2">{tenagaKerja}</p>
				  </div>
  
				  <div>
					  <p className="text-lg font-semibold">Jumlah Pencari Kerja</p>
					  <p className="text-4xl font-bold mt-2">{pencariKerja}</p>
				  </div>
  
				  <div>
					  <p className="text-lg font-semibold">Program Pelatihan</p>
					  <p className="text-4xl font-bold mt-2">{pelatihan}</p>
				  </div>
			  </div>
		  </div>
		</section>
  
		<section className="py-16 bg-white">
		  <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
			  <div className="lg:w-1/2 text-left">
				  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
					  Tentang Kami
				  </h2>
				  <p className="text-lg text-gray-700 leading-relaxed">
					  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
					  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
					  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
					  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				  </p>
			  </div>
  
			  <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
				  <img 
				  src="/images/kami.jpg" 
				  alt="About Us Illustration" 
				  className="w-full max-w-md rounded-3xl lg:max-w-lg"
				  />
			  </div>
		  </div>
		</section>
  
		<section className="py-16 text-white" style={{ backgroundColor: "#3561A1" }}>
		  <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
			  <div className="lg:w-1/3 flex justify-center space-x-6">
				  <img 
				  src="/images/Garuda.png" 
				  alt="Garuda Logo"
				  className="w-28 h-28 object-contain" />
				  <img 
				  src="/images/Logo.png" 
				  alt="Logo Gowa"
				  className="w-28 h-28 object-contain" />
			  </div>
  
			  <div className="lg:w-2/3 mt-10 lg:mt-0 text-left">
				  <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-center">Contact Us</h2>
				  <p className="text-lg leading-relaxed">
					  Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
					  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
					  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
					  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				  </p>
				  <div className="mt-6 flex justify-center w-full">
					  <button className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition">
						  Contact Us
					  </button>
				  </div>
			  </div>
  
		  </div>
		</section>

		<Footer />
  
		</div>
	  );
}