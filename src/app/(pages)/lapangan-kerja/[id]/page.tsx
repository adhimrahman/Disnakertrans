"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ContactHightlight";

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
  const { id } = useParams();
  const [data, setData] = useState<LowonganItem | null>(null);
  const [semuaLowongan, setSemuaLowongan] = useState<LowonganItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docRef = doc(db, "lowongan", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() } as LowonganItem);
      }
    };

    const fetchSemuaLowongan = async () => {
      const querySnapshot = await getDocs(collection(db, "lowongan"));
      const allData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LowonganItem[];
      setSemuaLowongan(allData);
    };

    fetchData();
    fetchSemuaLowongan();
  }, [id]);

  if (!data) return <div className="text-center py-20 text-gray-400">Memuat data lowongan...</div>;

  const indexSekarang = semuaLowongan.findIndex((item) => item.id === id);
  const lowonganSebelumnya = semuaLowongan[indexSekarang - 1];
  const lowonganBerikutnya = semuaLowongan[indexSekarang + 1];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 pt-28">
        <nav className="text-sm text-gray-800 mb-6" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li><Link href="/" className="hover:underline text-blue-600 capitalize">Beranda</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link href="/lowongan" className="hover:underline text-blue-600 capitalize">Lowongan</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-black line-clamp-1 capitalize" title={data.Judul}>
              {data.Judul}
            </li>
          </ol>
        </nav>
      </div>
      <main className="container mx-auto max-w-6xl px-4 pt-2 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 capitalize">
            Lowongan Kerja
          </h1>
          {/* <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
            <span className="flex items-center">🏢 {data.Perusahaan}</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center">💰 {formatRupiah(data.Range.min)} - {formatRupiah(data.Range.max)}</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center">📍 {data.Alamat}</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center">📅 Tenggat: {formatTanggal(data.BatasLowongan)}</span>
          </div> */}

          {/* <div className="mb-6 flex flex-wrap gap-2">
            {data.Tipe && data.Tipe.map((tipe, idx) => (
              <span 
                key={idx} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
              >
                {tipe}
              </span>
            ))}
          </div> */}

          <div className="relative w-full h-64 md:h-[420px] mb-8 rounded-xl overflow-hidden shadow-sm">
            {data.ImageSampul ? (
              <Image src={data.ImageSampul} alt={data.Judul} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Tidak ada gambar</span>
              </div>
            )}
          </div>

          <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deskripsi Pekerjaan</h2>
            <p className="whitespace-pre-line">{data.Deskripsi}</p>
          </article>

          {data.Syarat && data.Syarat.length > 0 && (
            <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Persyaratan</h2>
              <ul className="list-disc pl-5 space-y-2">
                {data.Syarat.map((syarat, index) => (
                  <li key={index}>{syarat}</li>
                ))}
              </ul>
            </article>
          )}

          {data.LinkLowongan && (
            <div className="mt-8 mb-12">
              <a
                href={data.LinkLowongan}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md"
              >
                Lamar Sekarang
              </a>
              <p className="text-sm text-gray-500 mt-2">
                atau akses informasi selengkapnya di <a href={data.LinkLowongan} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sini</a>
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-9">
            {lowonganSebelumnya && (
              <a href={`/lapangan-kerja/${lowonganSebelumnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all">
                <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  {lowonganSebelumnya.ImageSampul ? (
                    <Image src={lowonganSebelumnya.ImageSampul} alt={lowonganSebelumnya.Judul} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">← Lowongan Sebelumnya</span>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2">
                    {lowonganSebelumnya.Judul}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {lowonganSebelumnya.Perusahaan}
                  </p>
                </div>
              </a>
            )}
            
            {lowonganBerikutnya && (
              <a href={`/lapangan-kerja/${lowonganBerikutnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all text-right md:flex-row-reverse md:text-right">
                <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  {lowonganBerikutnya.ImageSampul ? (
                    <Image src={lowonganBerikutnya.ImageSampul} alt={lowonganBerikutnya.Judul} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Lowongan Berikutnya →</span>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2">
                    {lowonganBerikutnya.Judul}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {lowonganBerikutnya.Perusahaan}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Sidebar: Lowongan Lainnya */}
        <aside className="md:col-span-1 pl-0 md:pl-4 lg:pl-12 pt-4 md:pt-0">
          <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Lowongan</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">🏢</span>
                <div>
                  <p className="text-sm text-gray-700">Perusahaan</p>
                  <p className="text-gray-500 font-medium">{data.Perusahaan}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">💰</span>
                <div>
                  <p className="text-sm text-gray-700">Gaji</p>
                  <p className="text-gray-500 font-medium">{formatRupiah(data.Range.min)} - {formatRupiah(data.Range.max)}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">📍</span>
                <div>
                  <p className="text-sm text-gray-700">Lokasi</p>
                  <p className="text-gray-500 font-medium">{data.Alamat}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">📅</span>
                <div>
                  <p className="text-sm text-gray-700">Batas Akhir</p>
                  <p className="text-gray-500 font-medium">{formatTanggal(data.BatasLowongan)}</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">🔖</span>
                <div>
                  <p className="text-sm text-gray-700">Tipe Pekerjaan</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.Tipe && data.Tipe.map((tipe, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tipe}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4 underline">Lowongan Lainnya</h2>
          <div className="space-y-6">
            {semuaLowongan.filter((item) => item.id !== id).slice(0, 3).map((item) => (
              <a className="block rounded-xl overflow-hidden shadow hover:shadow-md transition bg-white border border-gray-200 hover:scale-105"
                key={item.id} href={`/lapangan-kerja/${item.id}`}>
                <div className="relative w-full h-36">
                  {item.ImageSampul ? (
                    <Image src={item.ImageSampul} alt={item.Judul} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2 capitalize">
                    {item.Judul}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {item.Perusahaan}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      {formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.Alamat}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </main>
      <ContactHighlight />
      <Footer />
    </div>
  );
}