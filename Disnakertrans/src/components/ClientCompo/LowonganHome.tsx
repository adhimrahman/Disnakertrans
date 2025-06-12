"use client"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MapPin } from "lucide-react";
import { ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { LowonganItem } from "@/lib/getLowongan";
import CustomButton from "../ui/CustomButton";

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}
    
export default function LowonganHome({ lowongan }: { lowongan: LowonganItem[] }) {
    return (
        <Swiper modules={[Navigation]} spaceBetween={-35} navigation breakpoints={{
			0: { slidesPerView: 1 }, 640: { slidesPerView: 1.2 }, 768: { slidesPerView: 2 },
			1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 },
		}}>
			{lowongan.map((item) => (
				<SwiperSlide key={item.id}>
					<div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4 flex flex-col justify-between h-full w-full max-w-xs mx-auto">
						<div className="relative w-full h-48 overflow-hidden">
							{item.ImageSampul ? (
								<Image src={item.ImageSampul} alt={item.Judul} width={340} height={320} className="w-full aspect-[4/3] object-cover" loading="lazy" />
							) : (
								<div className="w-full h-full bg-gray-200" />
							)}
						</div>
						<div className="flex flex-col p-5 gap-2 flex-grow">
							<h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1"
							title={item.Judul}>{item.Judul}</h3>
							<p className="text-gray-500 text-sm">{item.Perusahaan}</p>
							<div className="flex flex-wrap gap-2 mt-2">
								{Array.isArray(item.Tipe) && 
									item.Tipe.map((tipe, index) => (
										<span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
											{tipe}
										</span>
									))
								}
							</div>
							<div className="mt-3 text-sm text-green-600 font-semibold">
								{formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
							</div>
							<div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
								<MapPin size={16} />
								<span className="line-clamp-1">{item.Alamat}</span>
							</div>
						</div>
						<div className="px-4 md:px-5 py-4 flex justify-end">
							<CustomButton href={`/lapangan-kerja/${item.id}`} variant="blue" px={5} py={2} className="text-sm md:text-base tracking-wider">
                                Selengkapnya <ArrowRight size={16} />
                            </CustomButton>
						</div>
					</div>
				</SwiperSlide>
			))}
		</Swiper>
    )
}