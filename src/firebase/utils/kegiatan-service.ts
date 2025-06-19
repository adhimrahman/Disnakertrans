'use server'
import { collection, getDocs, Timestamp, updateDoc, query, doc, orderBy, QueryDocumentSnapshot, limit, startAfter,
	getDoc, addDoc, deleteDoc } from "firebase/firestore"
import { db } from "../config"
import { Validation } from "@/validation/validation";
import { createKegiatanFormData, createKegiatanSchema, getKegiatanSchema,
	updateKegiatanSchema } from "@/validation/kegiatan-validation";
import { uploadKegiatanImage } from "@/firebase/uploadToStorage";
import { Kegiatan, KegiatanItem } from "@/models/Kegiatan";

export async function addKegiatan (formData: createKegiatanFormData, files: { gambar_sampul?: File, gambar_kegiatan?: File }) {
	const gambarSampulUrl   = files.gambar_sampul ? await uploadKegiatanImage(files.gambar_sampul) : "";
	const gambarKegiatanUrl = files.gambar_kegiatan ? await uploadKegiatanImage(files.gambar_kegiatan) : [];

	const collectionRef = collection(db, "kegiatan");
	const data = {
		...formData,
		gambar_sampul: gambarSampulUrl,
		gambar_kegiatan: gambarKegiatanUrl
	}

	try {
		const validatedData = Validation.validate(createKegiatanSchema, data);
		const kegiatanDate = typeof validatedData.tanggal_kegiatan === 'string'
			? new Date(validatedData.tanggal_kegiatan)
			: validatedData.tanggal_kegiatan;
		
		const result = await addDoc(collectionRef, {
			judul: validatedData.judul,
			deskripsi: validatedData.deskripsi,
			gambar_sampul: validatedData.gambar_sampul,
			gambar_kegiatan: validatedData.gambar_kegiatan,
			tanggal_kegiatan: Timestamp.fromDate(kegiatanDate),
			created_at: Timestamp.now(),
			updated_at: Timestamp.now()
		});

		const link = process.env.NEXT_PUBLIC_LINK_BASE;
		const docRef = doc(db, "kegiatan", result.id);

		await updateDoc(docRef, { link: `${link}/kegiatan/${docRef.id}` });
		console.log(result);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function getKegiatan (): Promise<KegiatanItem[]> {
	const collectionRef = collection(db, "kegiatan");
	const kegiatanCollectionSnapshot = await getDocs(collectionRef);

	const kegiatanList = kegiatanCollectionSnapshot.docs.map((doc) => {
		const data = doc.data();
		const tanggal = data.created_at;

		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;
		
		return {
			id: doc.id,
			judul: data.judul ?? '',
			deskripsi: data.deskripsi ?? '',
			gambar_sampul: data.gambar_sampul, // may be undefined or convert accordingly
			gambar_kegiatan: data.gambar_kegiatan,
			link: data.link ?? '',
			created_at: tanggalStr,
		};
	});

	return kegiatanList;
};

export async function getKegiatanById (id: string): Promise<KegiatanItem | null> {
	const docRef = doc(db, "kegiatan", id);
	const kegiatanSnapshot = await getDoc(docRef);
	if (!kegiatanSnapshot.exists()) return null;

	const data = kegiatanSnapshot.data();
	const created = data.created_at;
	const createdStr = created?.toDate() ? created.toDate().toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}) : null;

	const tanggal = data.tanggal_kegiatan;
	const tanggalStr = tanggal?.toDate()?.toISOString().substring(0, 10) ?? '';

	return {
		id: kegiatanSnapshot.id,
		judul: data.judul ?? '',
		deskripsi: data.deskripsi ?? '',
		gambar_sampul: data.gambar_sampul,
		gambar_kegiatan: data.gambar_kegiatan,
		tanggal_kegiatan: tanggalStr ?? '',
		link: data.link ?? '',
		created_at: createdStr,
	}
};

export async function updateKegiatan(formData: Partial<Kegiatan>, files: { gambar_sampul?: File, gambar_kegiatan?: File[] }) {
	const gambarSampulUrl = files.gambar_sampul
		? await uploadKegiatanImage(files.gambar_sampul) : formData.gambar_sampul || "";
	const gambarKegiatanUrl = files.gambar_kegiatan
		? await uploadKegiatanImage(files.gambar_kegiatan) : formData.gambar_kegiatan || [];

	const docRef = doc(db, "kegiatan", formData.id);
	const data = {
		...formData,
		gambar_sampul: gambarSampulUrl,
		gambar_kegiatan: gambarKegiatanUrl
	};
	
	try {
		const validatedData = Validation.validate(updateKegiatanSchema, data);
		const kegiatanDate = typeof validatedData.tanggal_kegiatan === 'string'
			? new Date(validatedData.tanggal_kegiatan)
			: validatedData.tanggal_kegiatan;
		
		const result = await updateDoc(docRef, {
			judul: validatedData.judul,
			deskripsi: validatedData.deskripsi,
			gambar_sampul: validatedData.gambar_sampul,
			gambar_kegiatan: validatedData.gambar_kegiatan,
			tanggal_kegiatan: kegiatanDate ? Timestamp.fromDate(kegiatanDate) : undefined,
			updated_at: Timestamp.now()
		});

		console.log(result);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export async function deleteKegiatanById (kegiatan_id: string) {
	const validatedData = Validation.validate(getKegiatanSchema, kegiatan_id);
	const docRef = doc(db, "kegiatan", validatedData);

	await deleteDoc(docRef);
}

export async function getKegiatanByDateAndSort(
	sortField: keyof KegiatanItem = "created_at",
	sortOrder: "asc" | "desc" = "asc"
): Promise<KegiatanItem[]> {
	const collectionRef = collection(db, "kegiatan");
	const q = query(collectionRef, orderBy(sortField as string, sortOrder));

	const snapshot = await getDocs(q);

	return snapshot.docs.map(doc => {
		const data = doc.data();
		const tanggal = data.created_at;
		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;

		return {
			id: doc.id,
			judul: data.judul ?? '',
			deskripsi: data.deskripsi ?? '',
			gambar_sampul: data.gambar_sampul,
			gambar_kegiatan: data.gambar_kegiatan,
			link: data.link ?? '',
			created_at: tanggalStr,
		};
	});
}

export async function getKegiatanFilteredByJudulContains(
	search: string,
	sortField: keyof KegiatanItem = "created_at",
  sortOrder: "asc" | "desc" = "asc"
): Promise<KegiatanItem[]> {
	const allData = await getKegiatanByDateAndSort(sortField, sortOrder);

	if (!search.trim()) return allData;

	const lowerSearch = search.toLowerCase();

	const filtered = allData.filter(item =>{    
		return (
			item.judul.toLowerCase().includes(lowerSearch) ||
			item.created_at?.toLowerCase().includes(lowerSearch)
		)
	});

	return filtered;
}

export async function fetchPage(pageNumber: number, pageSize: number) {
	const pageCursors: QueryDocumentSnapshot[] = [];
	const collectionRef = collection(db, "kegiatan");
	let q = query(collectionRef, orderBy("judul"));

	if (pageNumber === 1) {
		q = query(q, limit(pageSize));
	} else {
		const cursor = pageCursors[pageNumber - 2];
		if (!cursor) throw new Error("Cursor for page not found");
		q = query(q, startAfter(cursor), limit(pageSize));
	}

	const snapshot = await getDocs(q);
	pageCursors[pageNumber - 1] = snapshot.docs[0];

	return snapshot.docs.map(doc => {
		const data = doc.data();
		const tanggal = data.created_at;
		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;
		
		return {
			id: doc.id,
			judul: data.judul ?? '',
			deskripsi: data.deskripsi ?? '',
			gambar_sampul: data.gambar_sampul,
			gambar_kegiatan: data.gambar_kegiatan,
			link: data.link ?? '',
			created_at: tanggalStr,
		};
	});
}