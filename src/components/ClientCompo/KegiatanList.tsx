"use client";
import { useState } from "react";
import Image from "next/image";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowRight } from "lucide-react";

type KegiatanItem = {
    id: string;
    Judul: string;
    Deskripsi: string;
    ImageSampul: string;
    Tanggal?: string;
};

export default function KegiatanList({ kegiatan } : { kegiatan: KegiatanItem[] }) {
    const [visibleCount, setVisibleCount] = useState(9);
    const visibleKegiatan = kegiatan.slice(0, visibleCount);
    const handleLoadMore = () => { setVisibleCount(kegiatan.length) };

    return (
        <section className="py-16 lg:py-20 px-6 md:px-24 bg-gradient-to-b from-white to-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
                    {visibleKegiatan.map((item) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="relative w-full h-60 overflow-hidden">
                                <Image src={item.ImageSampul} alt={item.Judul} sizes="720px" fill className="object-cover object-center" />
                            </div>
        
                            <div className="p-6 min-h-[164px]">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize hover:cursor-pointer line-clamp-1"
                                title={item.Judul}>{item.Judul}</h3>
                                <p className="text-sm text-gray-600 line-clamp-4 text-justify">{item.Deskripsi}</p>
                            </div>

                            <div className="px-4 md:px-5 py-4 flex justify-end">
                                <CustomButton variant="blue" className="text-sm md:text-base tracking-wider" href={`/lapangan-kerja/${item.id}`} >
                                    Selengkapnya <ArrowRight size={16} />
                                </CustomButton>
                            </div>
                        </div>
                    ))}
            </div>

            {visibleCount < kegiatan.length && (
                <div className="flex justify-center mt-15">
                    <CustomButton text="Tampilkan Semua" variant="blue" px={8} py={3} className="rounded-full" onClick={handleLoadMore}/>
                </div>
            )}
        </section>
    )
}