"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type KegiatanItem = {
    id: string;
    Judul: string;
    Deskripsi: string;
    ImageSampul: string;
    Tanggal?: string;
};

function limitChars(text: string, maxLength: number) {
	return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function KegiatanList({ kegiatan } : { kegiatan: KegiatanItem[] }) {
    const [visibleCount, setVisibleCount] = useState(9);
    const visibleKegiatan = kegiatan.slice(0, visibleCount);
    const isLoading = kegiatan.length === 0;

    const handleLoadMore = () => {
		setVisibleCount(kegiatan.length);
	};

    return (
        <section className="py-16 lg:py-20 px-6 md:px-24 bg-gradient-to-b from-white to-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 shadow-md animate-pulse bg-white">
                            <div className="w-full h-60 bg-gray-300" />
                            <div className="py-13 px-6">
                                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                            </div>
                        </div>
                    ))
                ) : (
                    visibleKegiatan.map((item) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="w-full h-60 relative overflow-hidden">
                                {item.ImageSampul ? ( 
                                    <Image src={item.ImageSampul} alt={item.Judul} layout="fill" className="object-cover object-center" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                )}
                            </div>
        
                            <div className="p-6 bg-white">
                                {/* <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{item.Judul}</h3> */}
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{limitChars(item.Judul, 26)}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3">{item.Deskripsi}</p>
                                <Link className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
                                href={`/kegiatan/${item.id}`}>
                                    Selengkapnya →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More Button */}
            {visibleCount < kegiatan.length && (
                <div className="flex justify-center mt-14">
                    <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition duration-300" onClick={handleLoadMore} >
                        Tampilkan Semua
                    </button>
                </div>
            )}
        </section>
    )
}