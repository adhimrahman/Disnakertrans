"use client"
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type KegiatanItem = {
	id: string;
	Judul: string;
	Deskripsi: string;
	ImageSampul: string;
};

function limitChars(text: string, maxLength: number) {
	return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function limitWords(text: string, count: number) {
	const words = text.split(" ");
	return words.slice(0, count).join(" ") + (words.length > count ? "..." : "");
}

export default function Kegiatan() {
	const [kegiatan, setKegiatan] = useState<KegiatanItem[]>([]);

	useEffect(() => {
		const fetchKegiatan = async () => {
			const querySnapshot = await getDocs(collection(db, "Kegiatan"));
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as KegiatanItem[];

			console.log('Data Kegiatan : ', data);
			setKegiatan(data);
		};

		fetchKegiatan();
	}, []);

	const isLoading = kegiatan.length === 0;

	return (
		<section className="pt-16 pb-10 px-5 bg-gray-100">
			<h2 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
				Kegiatan Disnaker Gowa
			</h2>
			
			<Swiper modules={[Navigation]} spaceBetween={-35} navigation breakpoints={{
				0: { slidesPerView: 1 }, 640: { slidesPerView: 1.2 }, 768: { slidesPerView: 2 },
				1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 },
			}}>
				{isLoading ? (
					Array.from({ length: 4 }).map((_, index) => (
						<SwiperSlide key={index}>
							<div className="bg-white shadow-md rounded-2xl overflow-hidden animate-pulse m-4 w-full max-w-xs mx-auto">
								<div className="w-full aspect-[4/3] bg-gray-300" />
								<div className="p-4 md:p-5 flex flex-col gap-2">
									<div className="h-5 bg-gray-300 rounded w-3/4" />
									<div className="h-3 bg-gray-300 rounded w-full" />
									<div className="h-3 bg-gray-300 rounded w-5/6" />
									<div className="h-3 bg-gray-300 rounded w-2/3" />
								</div>
								<div className="px-4 md:px-5 py-4 flex justify-end">
									<div className="h-8 w-24 bg-gray-300 rounded" />
								</div>
							</div>
						</SwiperSlide>
					))
				) : (
					kegiatan.map((item) => (
						<SwiperSlide key={item.id}>
							<div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4 flex flex-col justify-between h-full w-full max-w-xs mx-auto">
								{item.ImageSampul ? (
									<Image width={360} height={360} src={item.ImageSampul} alt={item.Judul} className="w-full aspect-[4/3] object-cover" loading="lazy" />
								) : (
									<div className="w-full aspect-[4/3] bg-gray-200" />
								)}
								<div className="p-4 md:p-5 text-justify flex flex-col gap-1">
									<h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 fade-text-end">
										{/* {item.Judul} */}
										{limitChars(item.Judul, 26)}
									</h3>
									<p className="text-gray-700 text-sm leading-relaxed pt-2">
										{limitWords(item.Deskripsi, 15)}
									</p>
								</div>
								<div className="px-4 md:px-5 py-4 flex justify-end">
									<Link className="bg-blue-700 text-white px-5 py-2 rounded-md shadow hover:bg-blue-800 transition text-sm md:text-base tracking-wider flex items-center gap-1"
										href={`/kegiatan/${item.id}`}> Selengkapnya <ArrowRight size={16} />
									</Link>
								</div>
							</div>
						</SwiperSlide>
					))
				)}
			</Swiper>
		</section>
	);
}