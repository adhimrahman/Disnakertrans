"use client"
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Image from "next/image";

type KegiatanItem = {
	id: string;
	Judul: string;
	Deskripsi: string;
	ImageSampul: string;
};

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

	return (
		<section className="py-16 bg-gray-100">
			<div>
				<h2 className="text-3xl lg:text-4xl font-bold text-left ml-10 mb-10 text-black">
					Kegiatan - Kegiatan Disnaker Gowa
				</h2>

				<Swiper
					modules={[Navigation]}
					spaceBetween={20}
					navigation
					className="px-4"
					breakpoints={{
						0: { slidesPerView: 1 },
						640: { slidesPerView: 1.2 },
						768: { slidesPerView: 2 },
						1024: { slidesPerView: 3 },
						}}
				>

					{kegiatan.map((item) => (
						<SwiperSlide key={item.id}>
							<div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4 flex flex-col justify-between h-full w-full max-w-xs mx-auto">
								<img
									src={item.ImageSampul}
									alt={item.Judul}
									className="w-full aspect-[4/3] object-cover"
								/>
								<div className="p-4 md:p-5 text-left">
									<h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
										{item.Judul}
									</h3>
									<p className="text-gray-700 text-sm leading-relaxed">
										{limitWords(item.Deskripsi, 12)}
									</p>
								</div>
								<div className="px-4 md:px-5 py-4 bg-gray-100 flex justify-end">
									<a
										href={`/kegiatan/${item.id}`}
										className="bg-blue-700 text-white px-5 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition text-sm md:text-base"
									>
										Selengkapnya
									</a>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}