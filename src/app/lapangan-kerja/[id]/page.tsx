"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ContactHighlight from "@/app/components/ContactHighlight";

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
  }) .replace("Waktu Indonesia Tengah", "WITA");
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

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Judul dan Deadline */}
        <div className="flex justify-between flex-wrap gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            {data.Judul.toUpperCase()}
          </h1>
          <div className="text-sm text-gray-600 self-center">
            Deadline:{" "}
            <span className="font-medium">{formatTanggal(data.BatasLowongan)}</span>
          </div>
        </div>

        {/* Perusahaan & Range */}
        <p className="text-gray-500 mb-2">
          {data.Perusahaan} | {formatRupiah(data.Range.min)} - {formatRupiah(data.Range.max)}
        </p>

        {/* Gambar */}
        <img
          src={data.ImageSampul}
          alt={data.Judul}
          className="w-full rounded-lg mb-6"
        />

        {/* Deskripsi */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-3">Deskripsi</h2>
          <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-line">
            {data.Deskripsi}
          </p>
        </div>

        {/* Syarat */}
        {data.Syarat && data.Syarat.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-3">Persyaratan</h2>
            <ul className="list-disc list-inside text-gray-800 leading-relaxed space-y-1">
              {data.Syarat.map((syarat, index) => (
                <li key={index}>{syarat}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Link */}
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
      </main>

      <ContactHighlight />
      <Footer />
    </div>
  );
}
