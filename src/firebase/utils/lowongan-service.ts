'use server'

import { collection, getDocs, Timestamp, updateDoc, query, doc, orderBy, QueryDocumentSnapshot, limit,
	startAfter, getDoc, addDoc, deleteDoc } from "firebase/firestore"
import { db } from "../config"
import { Validation } from "@/validation/validation";
import { createLowonganFormData, createLowonganSchema, getLowonganSchema,
	updateLowonganSchema } from "@/validation/lowongan-validation";
import { uploadLowonganImage } from "@/firebase/uploadToStorage"; 
import { Lowongan, LowonganItem } from "@/models/Lowongan";

export async function addLowongan(formData: createLowonganFormData, files: { gambar_sampul?: File }) {
	const gambarSampulUrl = files.gambar_sampul ? await uploadLowonganImage(files.gambar_sampul) : "";
	const collectionRef = collection(db, "lowongan");
	const data = { ...formData, gambar_sampul: gambarSampulUrl }

	try {
		const validateData = Validation.validate(createLowonganSchema, data);
		const batasDate = typeof validateData.tenggat_lowongan === 'string'
			? new Date(validateData.tenggat_lowongan)
			: validateData.tenggat_lowongan;
		
		const result = await addDoc(collectionRef, {
			judul: validateData.judul,
			deskripsi: validateData.deskripsi,
			posisi_lowongan: validateData.posisi_lowongan,
			tenggat_lowongan: Timestamp.fromDate(batasDate),
			alamat: validateData.alamat,
			link_lowongan: validateData.link_lowongan,
			perusahaan: validateData.perusahaan,
			tipe: validateData.tipe,
			syarat: validateData.syarat,
			range_gaji: {
				max: validateData.max_gaji,
				min: validateData.min_gaji
			},
			gambar_sampul: validateData.gambar_sampul,
			created_at: Timestamp.now(),
			updated_at: Timestamp.now(),
		});

		const link = process.env.NEXT_PUBLIC_LINK_BASE;
		const docRef = doc(db, "lowongan", result.id);

		await updateDoc(docRef, {link_konten: `${link}/lowongan/${docRef.id}`});
		console.log(result);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	};
};

export async function getLowongan(): Promise<Partial<LowonganItem[]>> {
	const collectionRef = collection(db, "lowongan");
	const lowonganCollectionSnapshot = await getDocs(collectionRef);

	const lowonganList = lowonganCollectionSnapshot.docs.map((doc) => {
		const data = doc.data();
		const tanggal = data.created_at;
		const batas = data.tenggat_lowongan;

		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;

		const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;
		
		return {
			id: doc.id,
			posisi_lowongan: data.posisi_lowongan ?? '',
			link_lowongan: data.link_lowongan ?? '',
			link_konten: data.link_konten ?? '',
			tenggat_lowongan: batasStr ?? '',
			perusahaan: data.perusahaan ?? '',
			created_at: tanggalStr ?? '',
			tipe: data.Tipe ?? [],
		};
	});

	return lowonganList;
};

export async function getLowonganById (id: string): Promise<Partial<Lowongan> | null> {
	const docRef = doc(db, "lowongan", id);
	const lowonganSnapshot = await getDoc(docRef);
	if (!lowonganSnapshot.exists()) return null;

	const data = lowonganSnapshot.data();

	const batas = data.tenggat_lowongan;
	const batasStr = batas?.toDate()?.toISOString().substring(0, 10) ?? '';
	
	return {
		id: lowonganSnapshot.id,
		judul: data.judul ?? '',
		posisi_lowongan: data.posisi_lowongan ?? '',
		deskripsi: data.deskripsi ?? '',
		gambar_sampul: data.gambar_sampul ?? null,
		tenggat_lowongan: batasStr ?? '',
		range_gaji: {
			max: data.range_gaji?.max ?? 0,
			min: data.range_gaji?.min ?? 0,
		},
		tipe: data.tipe ?? [],
		syarat: data.syarat ?? [],
		perusahaan: data.perusahaan ?? '',
		alamat: data.alamat ?? '',
		link_lowongan: data.link_lowongan ?? '',
		link_konten: data.link_konten ?? '',
	};
};

export async function updateLowongan (formData: Partial<Lowongan>, files: { gambar_sampul?: File }) {
	const gambarSampulUrl = files.gambar_sampul ? await uploadLowonganImage(files.gambar_sampul) : formData.gambar_sampul || "";

	if (!formData.id || typeof formData.id !== 'string') {
		throw new Error("ID lowongan tidak valid");
	}
	const docRef = doc(db, "lowongan", formData.id);
	const data = { ...formData, gambar_sampul: gambarSampulUrl };

	try {
		const validateData = Validation.validate(updateLowonganSchema, data);
		const batasDate = typeof validateData.tenggat_lowongan === 'string'
			? new Date(validateData.tenggat_lowongan)
			: validateData.tenggat_lowongan;
		
		const result = await updateDoc(docRef, {
			judul: validateData.judul,
			deskripsi: validateData.deskripsi,
			posisi_lowongan: validateData.posisi_lowongan,
			tenggat_lowongan: batasDate ? Timestamp.fromDate(batasDate) : undefined,
			alamat: validateData.alamat,
			link_lowongan: validateData.link_lowongan,
			perusahaan: validateData.perusahaan,
			tipe: validateData.tipe,
			syarat: validateData.syarat,
			range_gaji: {
				max: validateData.max_gaji,
				min: validateData.min_gaji
			},
			gambar_sampul: validateData.gambar_sampul,
			link_konten: validateData.link_konten,
			updated_at: Timestamp.now()
		});

		console.log(result);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	};
};

export async function deleteLowonganById (lowongan_id: string) {
	const validateId = Validation.validate(getLowonganSchema, lowongan_id);
	const docRef = doc(db, "lowongan", validateId);
	await deleteDoc(docRef);
};

export async function getLowonganByDateAndSort(
	sortField: keyof LowonganItem = "created_at",
	sortOrder: "asc" | "desc" = "asc"
): Promise<LowonganItem[]> {
	const collectionRef = collection(db, "lowongan");

	const q = query(collectionRef, orderBy(sortField as string, sortOrder));

	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => {
		const data = doc.data();
		const tanggal = data.created_at;
		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;

		const batas = data.tenggat_lowongan;
		const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;

		return {
			id: doc.id,
			posisi_lowongan: data.posisi_lowongan ?? '',
			link_lowongan: data.link_lowongan ?? '',
			link_konten: data.link_konten ?? '',
			tenggat_lowongan: batasStr ?? '',
			perusahaan: data.perusahaan ?? '',
			created_at: tanggalStr ?? '',
			tipe: data.Tipe ?? [],
		};
	});
};

export async function getLowonganFilteredByJudulContains(
	search: string,
	sortField: keyof LowonganItem = "created_at",
	sortOrder: "asc" | "desc" = "asc"
): Promise<LowonganItem[]> {
	const allData = await getLowonganByDateAndSort(sortField, sortOrder);
	if (!search.trim()) return allData;
	
	const lowerSearch = search.toLowerCase();
	const filtered = allData.filter((item) => {
		return (
			item.posisi_lowongan.toLowerCase().includes(lowerSearch) ||
			item.tenggat_lowongan?.toLowerCase().includes(lowerSearch) ||
			item.perusahaan.toLowerCase().includes(lowerSearch) || 
			item.created_at?.toLowerCase().includes(lowerSearch)
		);
  	});
	return filtered;
};

export async function fetchLowonganPage (pageNumber: number, pageSize: number) {
	const pageCursors: QueryDocumentSnapshot[] = [];
	const collectionRef = collection(db, "lowongan");
	let q = query(collectionRef, orderBy("created_at"));

	if (pageNumber === 1) {
		q = query(q, limit(pageSize));
	} else {
		const cursor = pageCursors[pageNumber - 2];
		if (!cursor) throw new Error("Cursor for page not found");
		q = query(q, startAfter(cursor), limit(pageSize));
	};

	const snapshot = await getDocs(q);
	pageCursors[pageNumber - 1] = snapshot.docs[0];

	return snapshot.docs.map((doc) => {
		const data = doc.data();
		const tanggal = data.created_at;
		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;

		const batas = data.tenggat_lowongan;
		const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;

		return {
			id: doc.id,
			posisi_lowongan: data.posisi_lowongan ?? '',
			link_lowongan: data.link_lowongan ?? '',
			link_konten: data.link_konten ?? '',
			tenggat_lowongan: batasStr ?? '',
			perusahaan: data.perusahaan ?? '',
			created_at: tanggalStr ?? '',
			tipe: data.Tipe ?? [],
		};
	});
};