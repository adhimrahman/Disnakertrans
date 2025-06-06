"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { PelatihanItem } from "@/lib/getPelatihan";

type Props = {
    pelatihan: PelatihanItem;
    semuaPelatihan: PelatihanItem[];
};

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

export default function PelatihanDetail({ pelatihan, semuaPelatihan }: Props) {
    const { id } = useParams();

    const index = useMemo(() => semuaPelatihan.findIndex((item) => item.id === id), [id, semuaPelatihan]);
    const pelatihanSebelumnya = semuaPelatihan[index - 1];
    const pelatihanBerikutnya = semuaPelatihan[index + 1];

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <div className="container mx-auto max-w-6xl px-4 pt-28">
                <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
                    <ol className="list-reset flex">
                        <li><Link href="/" className="hover:underline text-blue-600 capitalize">Beranda</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li><Link href="/pelatihan" className="hover:underline text-blue-600 capitalize">Pelatihan</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li className="text-gray-800 line-clamp-1 capitalize" title={pelatihan?.Judul}>
                            {(pelatihan?.Judul ?? "").slice(0, 99)}
                        </li>
                    </ol>
                </nav>
            </div>

            <main className="container mx-auto max-w-6xl px-4 pt-2 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize break-words">
                        {pelatihan.Judul}
                    </h1>

                    <p className="text-sm text-gray-500 mb-6 py-2">
                        📅 {formatTanggal(pelatihan.TanggalKegiatan)}
                    </p>

                    <div className="relative w-full h-64 md:h-[420px] mb-8 rounded-xl overflow-hidden shadow-sm">
                        <Image src={pelatihan.ImageSampul} alt={pelatihan.Judul} fill className="object-cover" />
                    </div>

                    <article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
                        <p className="whitespace-pre-line">{pelatihan.Deskripsi}</p>
                    </article>

                    { pelatihan.ImageDesc && (
                        <div className="relative w-full h-64 md:h-[420px] mb-12 rounded-xl overflow-hidden shadow-sm">
                            <Image src={pelatihan.ImageDesc} alt="Gambar Tambahan" fill className="object-cover" />
                        </div>
                    )}

                    {/* Navigasi sebelumnya & berikutnya */}
                    <div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-9">
                        {pelatihanSebelumnya && (
                            <Link href={`/pelatihan/${pelatihanSebelumnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all">
                                <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
                                    <Image src={pelatihanSebelumnya.ImageSampul} alt={pelatihanSebelumnya.Judul} fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">← Artikel Sebelumnya</span>
                                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2 line-clamp-2"
                                        title={pelatihanBerikutnya.Judul} >
                                        {pelatihanSebelumnya.Judul}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {pelatihanSebelumnya.Deskripsi}
                                    </p>
                                </div>
                            </Link>
                        )}

                        {pelatihanBerikutnya && (
                            <Link href={`/pelatihan/${pelatihanBerikutnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all text-right md:flex-row-reverse md:text-right">
                                <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
                                    <Image src={pelatihanBerikutnya.ImageSampul} alt={pelatihanBerikutnya.Judul} fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Artikel Berikutnya →</span>
                                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2 line-clamp-2"
                                        title={pelatihanBerikutnya.Judul} >
                                        {pelatihanBerikutnya.Judul}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {pelatihanBerikutnya.Deskripsi}
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="md:col-span-1 pl-0 lg:pl-12 lg:pt-26">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 underline">Pelatihan Lainnya</h2>
                    <div className="space-y-6">
                        {semuaPelatihan.filter((item) => item.id !== pelatihan.id).slice(0, 3).map((item) => (
                            <Link key={item.id} href={`/pelatihan/${item.id}`} className="block rounded-xl overflow-hidden shadow hover:shadow-md transition bg-white border border-gray-200 hover:scale-105">
                                <div className="relative w-full h-36">
                                    <Image src={item.ImageSampul} alt={item.Judul} fill className="object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 capitalize"
                                        title={item.Judul}>
                                        {item.Judul}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {item.Deskripsi}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {formatTanggal(item.TanggalKegiatan)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}