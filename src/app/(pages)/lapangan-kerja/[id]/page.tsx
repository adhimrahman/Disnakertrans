"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ContactHightlight";
import Image from "next/image";
import Link from "next/link";

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
    Deskripsi: string;
    Syarat: string[];
    BatasLowongan: Timestamp;
    LinkLowongan: string;
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

function formatTanggal(timestamp: Timestamp) {
    if (!timestamp?.toDate) return "-";
    const date = timestamp.toDate();
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Makassar",
        timeZoneName: "short",
    }).replace("Waktu Indonesia Tengah", "WITA");
}

export default function LowonganDetail() {
    const params = useParams();
    const { id } = params;
    const [data, setData] = useState<LowonganItem | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const docRef = doc(db, "lowongan", id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docData = docSnap.data() as LowonganItem;
                console.log("📦 Data Lowongan:", docData);
                setData({ ...docData, id: docSnap.id });
            } else {
                console.warn("⚠️ Lowongan tidak ditemukan!");
            }
        };

        fetchData();
    }, [id]);

    if (!data) return <div className="text-center py-20 text-gray-500">Memuat data lowongan...</div>;

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <div className="container mx-auto max-w-6xl px-4 pt-28">
                <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
                    <ol className="list-reset flex">
                        <li><Link href="/" className="hover:underline text-blue-600 capitalize">Beranda</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li><Link href="/lowongan" className="hover:underline text-blue-600 capitalize">Lowongan</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li className="text-gray-800 line-clamp-1 capitalize" title={data.Judul}>
                            {data.Judul}
                        </li>
                    </ol>
                </nav>
            </div>

            <main className="container mx-auto max-w-6xl px-4 pt-2 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
                        {data.Judul.toUpperCase()}
                    </h1>

                    <p className="text-sm text-gray-500 mb-6">
                        🏢 {data.Perusahaan} | {formatRupiah(data.Range.min)} - {formatRupiah(data.Range.max)} | Tenggat: {formatTanggal(data.BatasLowongan)}
                    </p>

                    <div className="relative w-full h-64 md:h-[420px] mb-8 rounded-xl overflow-hidden shadow-sm">
                        <Image src={data.ImageSampul} alt={data.Judul} fill className="object-cover" />
                    </div>

                    <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
                        <h2 className="font-bold text-xl">Deskripsi</h2>
                        <p>{data.Deskripsi}</p>
                    </article>

                    {data.Syarat && data.Syarat.length > 0 && (
                        <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
                            <h2 className="font-bold text-xl">Persyaratan</h2>
                            <ul className="list-disc list-inside">
                                {data.Syarat.map((syarat, index) => (
                                    <li key={index}>{syarat}</li>
                                ))}
                            </ul>
                        </article>
                    )}

                    {data.LinkLowongan && (
                        <div className="mt-4">
                            <a
                                href={data.LinkLowongan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline"
                            >
                                Akses Informasi Selengkapnya…..
                            </a>
                        </div>
                    )}
                </div>

                <aside className="md:col-span-1 pl-12 pt-22">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 underline">Lowongan Lainnya</h2>
                    {/* Sidebar content: You can fetch and display other job vacancies here */}
                </aside>
            </main>

            <ContactHighlight />
            <Footer />
        </div>
    );
}