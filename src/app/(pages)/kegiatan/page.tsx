"use client";
import React from 'react'
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ContactHighlight from '../../../components/ContactHightlight';

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

type KegiatanItem = {
	id: string;
	Judul: string;
	Deskripsi: string;
	ImageSampul: string;
};

function limitWords(text: string, count: number) {
	const words = text.split(" ");
	return words.slice(0, count).join(" ") + (words.length > count ? "..." : "");
}

export default function Page() {
    const [kegiatan, setKegiatan] = useState<KegiatanItem[]>([]);
	const [visibleCount, setVisibleCount] = useState(6); // jumlah awal yang ditampilkan

	useEffect(() => {
		const fetchKegiatan = async () => {
		const querySnapshot = await getDocs(collection(db, "Kegiatan"));
		const data = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as KegiatanItem[];
		setKegiatan(data);
		};

		fetchKegiatan();
	}, []);

	const handleLoadMore = () => {
		setVisibleCount(kegiatan.length); // tampilkan semua
	};

	const visibleKegiatan = kegiatan.slice(0, visibleCount);

    return (
        <>
            <Navbar />
            
            <section className="relative w-full h-[300px]">
                <Image
                    src="/images/Ilustrasi.jpeg"
                    alt="Header Kegiatan Disnaker"
                    fill
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-white text-3xl md:text-5xl font-extrabold">
                    Kegiatan Disnaker
                    </h1>
                </div>
            </section>

            <section className="py-16 bg-gray-100 px-4 lg:px-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-left mb-10 text-black">
                    Kegiatan - Kegiatan Disnaker Gowa
                </h2>
    
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleKegiatan.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 flex flex-col justify-between"
                    >
                        <img
                            src={item.ImageSampul}
                            alt={item.Judul}
                            className="w-full aspect-[4/3] object-cover"
                        />
                        <div className="p-4 md:p-5 text-left">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                            {item.Judul}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {limitWords(item.Deskripsi, 12)}
                        </p>
                        </div>
                        <div className="px-4 md:px-5 py-4 bg-gray-100 flex justify-end">
                        <a
                            href={`/kegiatan/${item.id}`}
                            className="bg-blue-700 text-white px-5 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition text-sm md:text-base"
                        >
                            Selengkapnya
                        </a>
                        </div>
                    </div>
                    ))}
                </div>
    
                {visibleCount < kegiatan.length && (
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