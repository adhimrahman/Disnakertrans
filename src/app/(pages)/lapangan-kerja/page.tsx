"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactHighlight from '@/components/ContactHightlight';
import { ArrowRight } from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { MapPin } from "lucide-react";

type LowonganItem = {
	id: string;
	Judul: string;
	Perusahaan: string;
	Tipe: string[];
	Range: {
		min: number;
		max: number;
	};
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

function limitChars(text: string, maxLength: number) {
	return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function Page() {
    const [lowongan, setLowongan] = useState<LowonganItem[]>([]);
	const [visibleCount, setVisibleCount] = useState(6);

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

	const handleLoadMore = () => {
		setVisibleCount(lowongan.length);
	};

	const visibleLowongan = lowongan.slice(0, visibleCount);
    const isLoading = lowongan.length === 0;

    return (
        <>
        <Navbar />
        
        <section className="relative w-full h-[300px] sm:h-[350px]">
            <Image src="/images/Gambar5.jpg" alt="Ilustrasi Header" fill className="object-cover object-center brightness-50" />
            <div className="absolute inset-0 flex items-center justify-center text-center bg-gradient-to-b from-transparent to-black/50 pt-24 lg:pt-12">
                <h1 className="text-white text-3xl lg:text-5xl font-bold shadow-md capitalize">
                    lowongan pekerjaan gowa
                </h1>
            </div>
        </section>

        <section className="py-16 lg:py-20 px-6 md:px-24 bg-gradient-to-b from-white to-gray-100">
            {/* <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-16 capitalize px-11 lg:px-0">
                Highlight Kegiatan Disnaker Gowa
            </h2> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 shadow-md animate-pulse bg-white">
                            <div className="w-full h-48 bg-gray-300" />
                            <div className="py-10 px-6">
                                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
                                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                            </div>
                        </div>
                    ))
                ) : (
                    visibleLowongan.map((item) => (
                        <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col justify-between h-full" key={item.id} >
                            <div className="relative w-full h-48">
                                <Image src={item.ImageSampul} alt={item.Judul} fill className="object-cover w-full h-full" />
                            </div>
            
                            <div className="flex flex-col p-5 gap-2 flex-grow">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">
                                        {limitChars(item.Judul, 26)}
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
                                <a className="bg-blue-700 text-white px-5 py-2 rounded-md shadow hover:bg-blue-800 transition text-sm md:text-base tracking-wider flex items-center gap-1" href={`/lapangan-kerja/${item.id}`} >
                                    Selengkapnya <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {visibleCount < lowongan.length && (
                <div className="flex justify-center mt-10">
                    <button onClick={handleLoadMore} className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-blue-800 transition">
                        Tampilkan Semua
                    </button>
                </div>
            )}
        </section>

        <ContactHighlight />
        <Footer />
        </>
    )
}