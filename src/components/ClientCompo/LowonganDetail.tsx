"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { LowonganItem } from "@/lib/getLowongan";
import CustomButton from "../ui/CustomButton";

type Props = {
    lowongan: LowonganItem;
    semuaLowongan: LowonganItem[];
}

function formatTanggal(dateString: string | undefined) {
	if (!dateString) return "-";
	const date = new Date(dateString);
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

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

export default function LowonganDetail({ lowongan, semuaLowongan }: Props) {
    const { id } = useParams();

    const index = useMemo(() => semuaLowongan.findIndex((item) => item.id === id), [id, semuaLowongan]);
	const lowonganSebelumnya = semuaLowongan[index - 1];
	const lowonganBerikutnya = semuaLowongan[index + 1];

    return (
        <>
        <div className="container mx-auto max-w-6xl px-4 pt-28">
            <nav className="text-sm text-gray-800 mb-6" aria-label="Breadcrumb">
                <ol className="list-reset flex">
                    <li><Link href="/" className="hover:underline text-blue-600 capitalize">Beranda</Link></li>
                    <li><span className="mx-2">/</span></li>
                    <li><Link href="/lapangan-kerja" className="hover:underline text-blue-600 capitalize">Lowongan</Link></li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-black line-clamp-1 capitalize" title={lowongan.Judul}>
                        {lowongan.Judul}
                    </li>
                </ol>
            </nav>
        </div>

        <main className="container mx-auto max-w-6xl px-4 pt-2 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize break-words">
                    {lowongan.Judul}
                </h1>

                <div className="relative w-full h-64 md:h-[420px] mb-8 rounded-xl overflow-hidden shadow-sm">
                    <Image src={lowongan.ImageSampul} alt={lowongan.Judul} fill sizes="1080px" className="object-cover" />
                </div>

                <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Posisi</h2>
                    <ul className="list-disc pl-5 space-y-2">
                            <li>{lowongan.PosisiLowongan}</li>
                    </ul>
                </article>

                {lowongan.Syarat && lowongan.Syarat.length > 0 && (
                    <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Persyaratan</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            {lowongan.Syarat.map((syarat, index) => (
                                <li key={index}>{syarat}</li>
                            ))}
                        </ul>
                    </article>
                )}

                {lowongan.LinkLowongan && (
                    <div className="mt-8 mb-12">
                        <p className="text-sm text-gray-500 mt-2 mb-3">Atau akses informasi selengkapnya di...</p>
                        <CustomButton text="Informasi Lengkap" variant="blue" px={8} py={3} className="rounded-full transition-all transform hover:scale-105 shadow-md" href={lowongan.LinkLowongan} target="_blank" />
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-9">
                    {lowonganSebelumnya && (
                        <Link href={`/lapangan-kerja/${lowonganSebelumnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all">
                            <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={lowonganSebelumnya.ImageSampul} alt={lowonganSebelumnya.Judul} fill sizes="720px" className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">← Lowongan Sebelumnya</span>
                                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2 line-clamp-2"
                                title={lowonganSebelumnya.Judul}>
                                    {lowonganSebelumnya.Judul}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                    {lowonganSebelumnya.Perusahaan}
                                </p>
                            </div>
                        </Link>
                    )}
                    
                    {lowonganBerikutnya && (
                        <Link href={`/lapangan-kerja/${lowonganBerikutnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all text-right md:flex-row-reverse md:text-right">
                            <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={lowonganBerikutnya.ImageSampul} alt={lowonganBerikutnya.Judul} fill sizes="720px" className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Lowongan Berikutnya →</span>
                                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2 line-clamp-2" title={lowonganBerikutnya.Judul}>
                                    {lowonganBerikutnya.Judul}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                    {lowonganBerikutnya.Perusahaan}
                                </p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Sidebar: Informasi Lowongan */}
            <aside className="md:col-span-1 pl-0 md:pl-4 lg:pl-12 pt-4 md:pt-0">
                <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Lowongan</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-3">🏢</span>
                            <div>
                                <p className="text-sm text-gray-700">Perusahaan</p>
                                <p className="text-gray-500 font-medium">{lowongan.Perusahaan}</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-3">💰</span>
                            <div>
                                <p className="text-sm text-gray-700">Gaji</p>
                                <p className="text-gray-500 font-medium">
                                    {lowongan?.Range ? `${formatRupiah(lowongan.Range.min)} - ${formatRupiah(lowongan.Range.max)}` : "-"}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-3">📍</span>
                            <div>
                                <p className="text-sm text-gray-700">Lokasi</p>
                                <p className="text-gray-500 font-medium">{lowongan.Alamat}</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-3">📅</span>
                            <div>
                                <p className="text-sm text-gray-700">Batas Akhir</p>
                                <p className="text-gray-500 font-medium">{formatTanggal(lowongan.BatasLowongan)}</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-3">🔖</span>
                            <div>
                                <p className="text-sm text-gray-700">Tipe Pekerjaan</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {lowongan.Tipe && lowongan.Tipe.map((tipe, idx) => (
                                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {tipe}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Sidebar: Lowongan Lainnya */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 underline">Lowongan Lainnya</h2>
                <div className="space-y-6">
                    {semuaLowongan.filter((item) => item.id !== id).slice(0, 3).map((item) => (
                    <Link className="block rounded-xl overflow-hidden shadow hover:shadow-md transition bg-white border border-gray-200 hover:scale-105" key={item.id} href={`/lapangan-kerja/${item.id}`}>
                        <div className="relative w-full h-36">
                            <Image src={item.ImageSampul} alt={item.Judul} fill className="object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 capitalize" title={item.Judul}>
                                {item.Judul}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium mt-1 line-clamp-2">
                                {item.Perusahaan}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
                                    {formatRupiah(item.Range.min)} - {formatRupiah(item.Range.max)}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                    {item.Alamat}
                                </p>
                            </div>
                        </div>
                    </Link>
                    ))}
                </div>
            </aside>
        </main>
        </>
    )
}