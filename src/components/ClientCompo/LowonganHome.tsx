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
    return (        <Swiper 
            modules={[Navigation]} 
            spaceBetween={10}
            slidesOffsetBefore={10}
            slidesOffsetAfter={10}
            navigation 
            breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 1.2, spaceBetween: 15 }, 
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 25 }, 
                1280: { slidesPerView: 4, spaceBetween: 30 },
            }}
        >
			{lowongan.map((item) => (
				<SwiperSlide key={item.id}>					<div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-3 sm:m-4 flex flex-col justify-between h-[500px] w-full max-w-[95%] sm:max-w-xs mx-auto">						<div className="relative w-full h-[225px] overflow-hidden">
							{item.ImageSampul ? (
								<Image 
									src={item.ImageSampul} 
									alt={item.Judul} 
									fill
									className="object-cover"
									sizes="(max-width: 640px) 95vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
									loading="lazy" 
								/>
							) : (
								<div className="w-full h-[225px] bg-gray-200" />
							)}
						</div>
						<div className="flex flex-col p-3 sm:p-4 md:p-5 gap-1 sm:gap-2 flex-grow">
							<h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-0 sm:mb-1 line-clamp-1"
							title={item.Judul}>{item.Judul}</h3>
							<p className="text-gray-500 text-xs sm:text-sm">{item.Perusahaan}</p>
							<div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
								{Array.isArray(item.Tipe) && 
									item.Tipe.map((tipe, index) => (
										<span key={index} className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
											{tipe}
										</span>
									))
								}
							</div>
							<div className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-600 font-semibold">
								{formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
							</div>
							<div className="flex items-center gap-1 sm:gap-2 text-gray-500 text-xs sm:text-sm mt-1">
								<MapPin size={14} className="flex-shrink-0" />
								<span className="line-clamp-1">{item.Alamat}</span>
							</div>
						</div>						<div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex items-center justify-center mt-auto">
							<CustomButton 
								href={`/lapangan-kerja/${item.id}`} 
								variant="blue" 
								px={4} 
								py={2} 
								className="text-xs sm:text-sm md:text-base tracking-wider whitespace-nowrap w-full flex items-center justify-center"
							>
								Selengkapnya <ArrowRight size={14} className="ml-1" />
							</CustomButton>
						</div>
					</div>
				</SwiperSlide>
			))}
		</Swiper>
    )
}