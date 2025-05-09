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

type KegiatanItem = {
	id: string;
	Judul: string;
	Tanggal: Timestamp;
	ImageSampul: string | null;
	Deskripsi: string;
	ImageDesc?: string;
};

function formatTanggal(timestamp: Timestamp | undefined) {
	if (!timestamp) return "-";
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

	const isLoading = semuaKegiatan.length === 0;

	const indexSekarang = semuaKegiatan.findIndex((item) => item.id === id);
	const kegiatanSebelumnya = semuaKegiatan[indexSekarang - 1];
	const kegiatanBerikutnya = semuaKegiatan[indexSekarang + 1];

	return (
		<>
		{isLoading ? (
		<div className="bg-white min-h-screen flex flex-col">
			<Navbar />
			<div className="container mx-auto max-w-6xl px-4 pt-28">
				<div className="animate-pulse space-y-4">
					<div className="h-6 w-1/3 bg-gray-300 rounded" />
					<div className="h-10 w-2/3 bg-gray-300 rounded" />
					<div className="h-64 md:h-[420px] bg-gray-200 rounded-xl" />
					<div className="space-y-2">
					<div className="h-4 w-full bg-gray-200 rounded" />
					<div className="h-4 w-5/6 bg-gray-200 rounded" />
					<div className="h-4 w-4/6 bg-gray-200 rounded" />
					</div>
					<div className="h-64 md:h-[420px] bg-gray-200 rounded-xl" />
					<div className="grid md:grid-cols-2 gap-6 pt-6">
					{[1, 2].map((_, i) => (
						<div key={i} className="flex gap-4 p-4 bg-gray-100 rounded-lg mb-16">
							<div className="w-32 h-20 bg-gray-300 rounded" />
							<div className="flex flex-col space-y-2 flex-1">
								<div className="h-4 bg-gray-300 rounded w-1/2" />
								<div className="h-3 bg-gray-300 rounded w-3/4" />
							</div>
						</div>
					))}
					</div>
				</div>
			</div>
			<Footer />
		</div>
		) : (
		<div className="bg-white min-h-screen flex flex-col">
			<Navbar />

			{/* header */}
			<div className="container mx-auto max-w-6xl px-4 pt-28">
				<nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
					<ol className="list-reset flex">
						<li><Link href="/" className="hover:underline text-blue-600 capitalize">Beranda</Link></li>
						<li><span className="mx-2">/</span></li>
						<li><Link href="/kegiatan" className="hover:underline text-blue-600 capitalize">Kegiatan</Link></li>
						<li><span className="mx-2">/</span></li>
						<li className="text-gray-800 line-clamp-1 capitalize" title={data?.Judul ?? "Judul Kegiatan Dibutuhkan"}>
							{data?.Judul ?? "Judul Kegiatan"}
						</li>
					</ol>
				</nav>
			</div>

			<main className="container mx-auto max-w-6xl px-4 pt-2 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
						{data?.Judul ?? "Judul Kegiatan"}
					</h1>

					<p className="text-sm text-gray-500 mb-6">
						📅 {formatTanggal(data?.Tanggal)}
					</p>

					<div className="relative w-full h-64 md:h-[420px] mb-8 rounded-xl overflow-hidden shadow-sm">
					{data?.ImageSampul ? ( 
						<Image src={data.ImageSampul} alt={data.Judul} fill className="object-cover" />
					) : (
						<div className="w-full h-full bg-gray-200" />
					)}
					</div>

					<article className="prose prose-lg prose-slate text-gray-900 max-w-none text-justify mb-10">
						<p className="whitespace-pre-line">{data?.Deskripsi ?? "Deskripsi Kegiatan Dibutuhkan"}</p>
					</article>

					{data?.ImageDesc && (
						<div className="relative w-full h-64 md:h-[420px] mb-12 rounded-xl overflow-hidden shadow-sm">
							<Image src={data.ImageDesc} alt="Gambar Tambahan" fill className="object-cover" />
						</div>
					)}

					<div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-9">
						{kegiatanSebelumnya && (
							<Link href={`/kegiatan/${kegiatanSebelumnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all">
								<div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
								{kegiatanSebelumnya.ImageSampul ? (
									<Image src={kegiatanSebelumnya.ImageSampul} alt={kegiatanSebelumnya.Judul} fill className="object-cover" />
								) : (
									<div className="w-full h-full bg-gray-200" />
								)}
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-gray-500">← Artikel Sebelumnya</span>
									<h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2">
										{kegiatanSebelumnya.Judul}
									</h3>
									<p className="text-xs text-gray-600 mt-1 line-clamp-2">
										{kegiatanSebelumnya.Deskripsi}
									</p>
								</div>
							</Link>
						)}

						{kegiatanBerikutnya && (
							<Link href={`/kegiatan/${kegiatanBerikutnya.id}`} className="flex gap-4 group hover:bg-gray-200 p-4 rounded-lg transition-all text-right md:flex-row-reverse md:text-right">
								<div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden">
								{kegiatanBerikutnya.ImageSampul ? (
									<Image src={kegiatanBerikutnya.ImageSampul} alt={kegiatanBerikutnya.Judul} fill className="object-cover" />
								) : (
									<div className="w-full h-full bg-gray-200" />
								)}
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-gray-500">Artikel Berikutnya →</span>
									<h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 capitalize pt-2">
										{kegiatanBerikutnya.Judul}
									</h3>
									<p className="text-xs text-gray-600 mt-1 line-clamp-2">
										{kegiatanBerikutnya.Deskripsi}
									</p>
								</div>
							</Link>
						)}
					</div>
				</div>

				{/* Sidebar: Saran Kegiatan */}
				<aside className="md:col-span-1 pl-12 pt-22">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 underline">Kegiatan Lainnya</h2>
					<div className="space-y-6">
						{semuaKegiatan.filter((item) => item.id !== id).slice(0, 3).map((item) => (
							<Link className="block rounded-xl overflow-hidden shadow hover:shadow-md transition bg-white border border-gray-200 hover:scale-105"
							key={item.id} href={`/kegiatan/${item.id}`} >
								<div className="relative w-full h-36">
								{item.ImageSampul ? ( 
									<Image src={item.ImageSampul} alt={item.Judul} fill className="object-cover" />
								) : ( <div className="w-full h-full bg-gray-200" /> )}
								</div>
								<div className="p-4">
									<h3 className="text-base font-semibold text-gray-800 line-clamp-2 capitalize">
										{item.Judul}
									</h3>
									<p className="text-sm text-gray-500 mt-1 line-clamp-2">
										{item.Deskripsi}
									</p>
									<p className="text-xs text-gray-400 mt-2">
										{formatTanggal(item.Tanggal)}
									</p>
								</div>
							</Link>
						))}
					</div>
				</aside>
			</main>

			<ContactHighlight />
			<Footer />
		</div>
		)}
		</>
	);
}
