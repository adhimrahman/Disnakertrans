"use client"
import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MapPin } from "lucide-react";
import CustomButton from "../ui/CustomButton";

type LowonganItem = {
	id: string;
	Judul: string;
	Perusahaan: string;
	Tipe: string[];
	Range: { min: number; max: number; };
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

export default function LowonganList({ lowongan } : { lowongan: LowonganItem[] }) {
    const [visibleCount, setVisibleCount] = useState(9);
    const visibleLowongan = lowongan.slice(0, visibleCount);
    const handleLoadMore = () => { setVisibleCount(lowongan.length) };

    return (
        <section className="py-16 lg:py-20 px-6 md:px-24 bg-gradient-to-b from-white to-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleLowongan.map((item) => (
                    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col justify-between h-full" key={item.id} >
                        <div className="relative w-full h-48">
                            <Image src={item.ImageSampul} alt={item.Judul} sizes="720px" fill className="object-cover" />
                        </div>

                        <div className="flex flex-col p-5 gap-2 flex-grow">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1 hover:cursor-pointer line-clamp-2" title={item.Judul}>
                                    {item.Judul}
                                </h3>
                                <p className="text-gray-500 text-sm">{item.Perusahaan}</p>
                            </div>
            
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.Tipe.map((tipe, index) => (
                                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium" >
                                        {tipe}
                                    </span>
                                ))}
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
                            <CustomButton variant="blue" className="text-sm md:text-base tracking-wider" href={`/lapangan-kerja/${item.id}`} >
								Selengkapnya <ArrowRight size={16} />
							</CustomButton>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < lowongan.length && (
                <div className="flex justify-center mt-15">
                    <CustomButton variant="blue" px={6} py={3} className="font-semibold" onClick={handleLoadMore}>
						Tampilkan Semua
					</CustomButton>
                </div>
            )}
        </section>
    )
}