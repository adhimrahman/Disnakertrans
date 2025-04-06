"use client";
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ContactHighlight from '../../../components/ContactHightlight';
// import HeaderLowongan from '../../../components/lapangan-kerja/HeaderLowongan';
// import CardLowongan from '../../../components/lapangan-kerja/CardLowongan';

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

    return (
        <>
            <Navbar />
            
            <section className="relative w-full h-[300px]">
                <Image
                    src="/images/Gambar5.jpg"
                    alt="Header Lowongan Disnaker"
                    fill
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-white text-3xl md:text-5xl font-extrabold">
                    Lowongan Pekerjaan Gowa
                    </h1>
                </div>
            </section>

            <section className="py-16 bg-gray-100 px-4 lg:px-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-left mb-10 text-black">
                    Lowongan Pekerjaan di Gowa
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleLowongan.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col justify-between"
                        >
                            <img
                            src={item.ImageSampul} 
                            alt={item.Judul}
                            className="w-full aspect-[4/3] object-cover"
                            />
                            <div className="p-4 md:p-5 text-left flex flex-col gap-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                {item.Judul}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {item.Perusahaan} • {item.Tipe.join(", ")}
                            </p>
                            </div>
                            <div className="bg-gray-100 px-4 md:px-5 py-3 rounded-t-xl text-sm font-medium text-gray-900">
                            {formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
                            </div>
                            <div className="flex bg-gray-100 items-center px-4 md:px-5 py-2 text-sm text-gray-500 gap-2">
                            <MapPin size={16} />
                            {item.Alamat}
                            </div>
                            <div className="bg-gray-100 px-4 md:px-5 py-4 flex justify-end">
                            <a
                                href={`/lapangan-kerja/${item.id}`}
                                className="bg-blue-700 text-white px-5 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition text-sm md:text-base"
                            >
                                Selengkapnya
                            </a>
                            </div>
                        </div>
                    ))}
                </div>

                {visibleCount < lowongan.length && (
                    <div className="flex justify-center mt-10">
                    <button
                        onClick={handleLoadMore}
                        className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-blue-800 transition"
                    >
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