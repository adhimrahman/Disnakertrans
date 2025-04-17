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
		<section className="py-16 bg-gray-100">
			<div>
				<h2 className="text-3xl lg:text-4xl font-bold text-left ml-10 mb-10 text-black capitalize">
					lowongan pekerjaan di gowa
				</h2>

				<Swiper modules={[Navigation]} spaceBetween={-25} navigation breakpoints={{
					0: { slidesPerView: 1 }, 640: { slidesPerView: 1.2 }, 768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 },
				}}>
					{lowongan.map((item) => (
						<SwiperSlide key={item.id}>
							<div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4 flex flex-col justify-between h-full w-full max-w-xs mx-auto">
								<Image width={360} height={360} src={item.ImageSampul} alt={item.Judul} className="w-full aspect-[4/3] object-cover" />
								<div className="p-4 md:p-5 text-justify flex flex-col">
									<h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
										{item.Judul}
									</h3>
									<p className="text-gray-500 text-sm leading-relaxed pt-1">
										{item.Perusahaan} • {item.Tipe.join(", ")}
									</p>
								</div>

								<div className="px-4 md:px-5 rounded-t-xl text-sm font-medium text-gray-900">
									{formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
								</div>

								<div className="flex items-center px-4 md:px-5 py-2 text-sm text-gray-500 gap-2">
									<MapPin size={16} />
									{item.Alamat}
								</div>

								<div className="px-4 md:px-5 py-4 flex justify-end">
									<a className="bg-blue-700 text-white px-5 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition text-sm md:text-base tracking-wider"
										href={`/lowongan/${item.id}`}> Selengkapnya
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