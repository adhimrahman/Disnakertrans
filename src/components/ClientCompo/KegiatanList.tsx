"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/components/ui/CustomButton";

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
                            <div className="w-full h-60 relative overflow-hidden">
                                <Image src={item.ImageSampul} alt={item.Judul} layout="fill" className="object-cover object-center" sizes="100vw" />
                            </div>
        
                            <div className="p-6 bg-white">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize hover:cursor-pointer line-clamp-1"
                                title={item.Judul}>{item.Judul}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3">{item.Deskripsi}</p>
                                <Link className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
                                href={`/kegiatan/${item.id}`}>
                                    Selengkapnya →
                                </Link>
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