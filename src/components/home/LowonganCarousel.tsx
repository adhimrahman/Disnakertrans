"use client"
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type LowonganItem = {
	id: string;
	Judul: string;
	Perusahaan: string;
	Tipe: string[];
	Range: { min: number; max: number };
	Alamat: string;
	ImageSampul: string;
};

function formatRupiah(value: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value);
}

export default function LowonganCarousel() {
	const [lowongan, setLowongan] = useState<LowonganItem[]>([]);

	useEffect(() => {
		const fetchLowongan = async () => {
			const querySnapshot = await getDocs(collection(db, "lowongan"));
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as LowonganItem[];

			setLowongan(data);
		};

		fetchLowongan();
	}, []);

	return (
		<section className="pt-16 pb-10 px-5 bg-gray-100">
		<div>
			<h2 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
				lowongan pekerjaan di gowa
			</h2>

			<Swiper modules={[Navigation]} spaceBetween={-35} navigation breakpoints={{
				0: { slidesPerView: 1 }, 640: { slidesPerView: 1.2 }, 768: { slidesPerView: 2 },
				1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 },
			}}>
			{lowongan.map((item) => (
				<SwiperSlide key={item.id}>
					<div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4 flex flex-col justify-between h-full w-full max-w-xs mx-auto">
						<div className="relative w-full h-48">
							<Image src={item.ImageSampul} alt={item.Judul} fill className="object-cover w-full h-full" />
						</div>

						<div className="flex flex-col p-5 gap-2 flex-grow">
							{/* Judul & Perusahaan */}
							<div>
								<h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">
									{item.Judul}
								</h3>
								<p className="text-gray-500 text-sm">{item.Perusahaan}</p>
							</div>

							{/* Tipe Pekerjaan */}
							<div className="flex flex-wrap gap-2 mt-2">
							{item.Tipe.map((tipe, index) => (
								<span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
									{tipe}
								</span>
							))}
							</div>

							{/* Gaji */}
							<div className="mt-3 text-sm text-green-600 font-semibold">
								{formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
							</div>

							{/* Lokasi */}
							<div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
								<MapPin size={16} />
								<span className="line-clamp-1">{item.Alamat}</span>
							</div>
						</div>
						<div className="px-4 md:px-5 py-4 flex justify-end">
							<a className="bg-blue-700 text-white px-5 py-2 rounded-md shadow hover:bg-blue-800 transition text-sm md:text-base tracking-wider flex items-center gap-1"
								href={`/kegiatan/${item.id}`}> Selengkapnya <ArrowRight size={16} />
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