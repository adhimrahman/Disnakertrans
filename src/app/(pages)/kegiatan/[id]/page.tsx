"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ContactHightlight";

// ✅ Tipe data kegiatan
type KegiatanItem = {
  id: string;
  Judul: string;
  Tanggal: Timestamp;
  ImageSampul: string;
  Deskripsi: string;
  ImageDesc?: string;
};

function formatTanggal(timestamp: Timestamp) {
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

export default function KegiatanDetail() {
  const { id } = useParams();
  const [data, setData] = useState<KegiatanItem | null>(null);
  const [semuaKegiatan, setSemuaKegiatan] = useState<KegiatanItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docRef = doc(db, "Kegiatan", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() } as KegiatanItem);
      }
    };

    const fetchSemuaKegiatan = async () => {
      const querySnapshot = await getDocs(collection(db, "Kegiatan"));
      const allData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as KegiatanItem[];
      setSemuaKegiatan(allData);
    };

    fetchData();
    fetchSemuaKegiatan();
  }, [id]);

  if (!data) return <div className="text-center py-20 text-gray-500">Memuat data kegiatan...</div>;

  const indexSekarang = semuaKegiatan.findIndex((item) => item.id === id);
  const kegiatanSebelumnya = semuaKegiatan[indexSekarang - 1];
  const kegiatanBerikutnya = semuaKegiatan[indexSekarang + 1];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
          {data.Judul.toUpperCase()}
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Tanggal: {formatTanggal(data.Tanggal)}
        </p>

        <div className="relative w-full h-[300px] md:h-[400px] mb-6">
          <Image
            src={data.ImageSampul}
            alt={data.Judul}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <p className="text-justify text-gray-800 leading-relaxed whitespace-pre-line">
          {data.Deskripsi}
        </p>

        {data.ImageDesc && (
          <div className="relative w-full h-[300px] md:h-[400px] mt-8">
            <Image
              src={data.ImageDesc}
              alt="Gambar Tambahan"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {/* Navigasi Kegiatan */}
        <div className="py-8 border-t border-gray-300 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {kegiatanSebelumnya && (
            <div className="flex flex-col items-start">
              <div className="relative w-full h-[160px] mb-3">
                <Image
                  src={kegiatanSebelumnya.ImageSampul}
                  alt={kegiatanSebelumnya.Judul}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-700 leading-snug mb-2">
                {kegiatanSebelumnya.Deskripsi.slice(0, 80)}...
              </p>
              <a
                href={`/kegiatan/${kegiatanSebelumnya.id}`}
                className="text-sm text-blue-700 hover:underline"
              >
                ← Artikel Sebelumnya
              </a>
            </div>
          )}

          {kegiatanBerikutnya && (
            <div className="flex flex-col items-start md:items-end text-right">
              <div className="relative w-full h-[160px] mb-3">
                <Image
                  src={kegiatanBerikutnya.ImageSampul}
                  alt={kegiatanBerikutnya.Judul}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-700 leading-snug mb-2">
                {kegiatanBerikutnya.Deskripsi.slice(0, 80)}...
              </p>
              <a
                href={`/kegiatan/${kegiatanBerikutnya.id}`}
                className="text-sm text-blue-700 hover:underline"
              >
                Artikel Berikutnya →
              </a>
            </div>
          )}
        </div>
      </main>

      <ContactHighlight />
      <Footer />
    </div>
  );
}
