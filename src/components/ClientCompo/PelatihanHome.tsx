"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PelatihanItem } from "@/lib/getPelatihan";
import CustomButton from "../ui/CustomButton";

export default function PelatihanHome({ pelatihan }: { pelatihan: PelatihanItem[] }) {
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
                1024: { slidesPerView: 3, spaceBetween: -15 }, 
                1280: { slidesPerView: 4, spaceBetween: -15 },
            }}
        >
            {pelatihan.map((item) => (
                <SwiperSlide key={item.id}>                    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-3 sm:m-4 flex flex-col justify-between h-[500px] w-full max-w-[95%] sm:max-w-xs mx-auto">                        {item.gambar_pelatihan ? (
                            <div className="relative w-full h-[225px] overflow-hidden">
                                <Image 
                                    fill
                                    src={item.gambar_pelatihan} 
                                    alt={item.judul} 
                                    className="object-cover" 
                                    sizes="(max-width: 640px) 95vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                                    loading="lazy" 
                                />
                            </div>
                        ) : (
                            <div className="w-full h-[225px] bg-gray-200" />
                        )}
                        <div className="p-4 md:p-5 flex flex-col gap-1 flex-grow">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                                {item.judul}
                            </h3>
                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed pt-2 line-clamp-3">
                                {item.deskripsi}
                            </p>
                        </div>                        <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex items-center justify-center mt-auto">
                            <CustomButton 
                                href={`/pelatihan/${item.id}`} 
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