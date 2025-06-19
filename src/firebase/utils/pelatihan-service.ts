import {  addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { CreatePelatihan, CreatePelatihanSchema, GetPelatihanSchema, UpdatePelatihan,
	UpdatePelatihanSchema } from "@/validation/pelatihan-validation";
import { uploadPelatihanImage } from "../uploadToStorage";
import { db } from "../config";
import { Validation } from "@/validation/validation";
import { Pelatihan, PelatihanItem } from "@/models/Pelatihan";

async function getAkunDocRef(lpkId: string) {
	const akunRef = collection(db, "akun");
	const q = query(akunRef, where("lpkId", "==", lpkId));
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) throw new Error("Akun tidak ditemukan");
	const akunDoc = querySnapshot.docs[0];
	return doc(db, "akun", akunDoc.id);
}

export async function addPelatihan(lpkId: string, formData: CreatePelatihan, files: { gambar_pelatihan?: File }) {
	const gambarPelatihanUrl = files.gambar_pelatihan ? await uploadPelatihanImage(files.gambar_pelatihan) : "";
	const collectionRef = collection(db, "pelatihan");
	const data = { ...formData, gambar_pelatihan: gambarPelatihanUrl };

	try {
		const validateData = Validation.validate(CreatePelatihanSchema, data);
		const tanggal = typeof validateData.tanggal_kegiatan === 'string'
			? new Date(validateData.tanggal_kegiatan)
			: validateData.tanggal_kegiatan;
		
		const akunRef = await getAkunDocRef(lpkId);
		
		const result = await addDoc(collectionRef, {
			judul: validateData.judul,
			deskripsi: validateData.deskripsi,
			gambar_pelatihan: validateData.gambar_pelatihan,
			tanggal_kegiatan: Timestamp.fromDate(tanggal),
			link_form: validateData.link_form,
			reference: akunRef,
			created_at: Timestamp.now(),
			updated_at: Timestamp.now()
		});

		return result;
	} catch (e) {
		console.log(e);
		return false;
	};
};

export async function getPelatihanFiltered(
	lpkId: string,
	search: string,
): Promise<PelatihanItem[]> {
	const akunRef = await getAkunDocRef(lpkId);
	const collectionRef = collection(db, "pelatihan");
	const q = query(collectionRef, where("reference", "==", akunRef));

	const snapshot = await getDocs(q);
	const allData = snapshot.docs.map((doc) => {
		const data = doc.data();
		const tanggal = data.tanggal_kegiatan;
		const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) : null;
		
		return {
			id: doc.id,
			judul: data.judul ?? '',
			deskripsi: data.deskripsi ?? '',
			gambar_pelatihan: data.gambar_pelatihan ?? '',
			tanggal_kegiatan: tanggalStr,
			link_form: data.link_form ?? '',
			link_konten: data.link_konten ?? '',
		};
	});

	if (!search.trim()) return allData;

	const lowerSearch = search.toLowerCase();
	return allData.filter(item =>
		item.judul.toLowerCase().includes(lowerSearch) || 
		item.tanggal_kegiatan?.toLowerCase().includes(lowerSearch)
	);
};

export async function getPelatihanById(pelatihanId: string): Promise<Partial<Pelatihan> | null> {
	const docRef = doc(db, "pelatihan", pelatihanId);
	const snapshot = await getDoc(docRef);
	if (!snapshot.exists()) return null;

	const data = snapshot.data();
	const tanggal = data.tanggal_kegiatan?.toDate()?.toISOString().substring(0, 10) ?? '';

	return {
		id: snapshot.id,
		judul: data.judul ?? '',
		deskripsi: data.deskripsi ?? '',
		gambar_pelatihan: data.gambar_pelatihan ?? '',
		tanggal_kegiatan: tanggal,
		link_form: data.link_form ?? '',
	};
}

export async function updatePelatihan(lpkId: string, pelatihanId: string, formData: UpdatePelatihan, files?: { gambar_pelatihan?: File }) {
	console.log("Updating pelatihan:", pelatihanId, "with data:", formData);
	
	// Handle image upload if there's a new file
	let gambarPelatihanUrl = formData.gambar_pelatihan || "";
	if (files?.gambar_pelatihan) {
		try {
			gambarPelatihanUrl = await uploadPelatihanImage(files.gambar_pelatihan);
			console.log("New image uploaded:", gambarPelatihanUrl);
		} catch (error) {
			console.error("Error uploading image:", error);
			return false;
		}
	}
	
	// Prepare the document reference
	const docRef = doc(db, "pelatihan", pelatihanId);
	const data = { ...formData, gambar_pelatihan: gambarPelatihanUrl };

	try {
		// Validate the data
		const validateData = Validation.validate(UpdatePelatihanSchema, data);
		
		// Parse the date
		let tanggalKegiatan;
		if (validateData.tanggal_kegiatan) {
			tanggalKegiatan = typeof validateData.tanggal_kegiatan === 'string'
				? new Date(validateData.tanggal_kegiatan)
				: validateData.tanggal_kegiatan;
		}
		
		// Update document
		await updateDoc(docRef, {
			judul: validateData.judul,
			deskripsi: validateData.deskripsi,
			gambar_pelatihan: gambarPelatihanUrl, // Use the URL we determined above
			tanggal_kegiatan: tanggalKegiatan ? Timestamp.fromDate(tanggalKegiatan) : null,
			link_form: validateData.link_form || "",
			updated_at: Timestamp.now()
		});

		console.log("Pelatihan updated successfully!");
		return true;
	} catch (e) {
		console.error("Error updating pelatihan:", e);
		return false;
	}
};

export async function deletePelatihan(pelatihanId: string) {
	const validateId = Validation.validate(GetPelatihanSchema, pelatihanId);
	const docRef = doc(db, "pelatihan", validateId);
	await deleteDoc(docRef);
}