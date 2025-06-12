"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { KegiatanItem } from "@/lib/getKegiatan";
import CustomButton from "../ui/CustomButton";

function limitChars(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function KegiatanHome({ kegiatan }: { kegiatan: KegiatanItem[] }) {
    return (
        <Swiper modules={[Navigation]} spaceBetween={-35} navigation breakpoints={{
            0: { slidesPerView: 1 }, 640: { slidesPerView: 1.2 }, 768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 },
        }}>
            {kegiatan.map((item) => (
                <SwiperSlide key={item.id}>
                    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4 flex flex-col justify-between h-full w-full max-w-xs mx-auto">
                        {item.ImageSampul ? (
                            <Image width={360} height={360} src={item.ImageSampul} alt={item.Judul} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                        ) : (
                            <div className="w-full aspect-[4/3] bg-gray-200" />
                        )}
                        <div className="p-4 md:p-5 text-justify flex flex-col gap-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 fade-text-end">
                                {limitChars(item.Judul, 26)}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed pt-2 line-clamp-4">
                                {item.Deskripsi}
                            </p>
                        </div>
                        <div className="px-4 md:px-5 py-4 flex justify-end">
                            <CustomButton href={`/kegiatan/${item.id}`} variant="blue" px={5} py={2} className="text-sm md:text-base tracking-wider">
                                Selengkapnya <ArrowRight size={16} />
                            </CustomButton>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}