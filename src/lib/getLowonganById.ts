import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import type { LowonganItem } from "./getLowongan";

export async function getLowonganById(id: string): Promise<LowonganItem | null> {
    const docRef = doc(db, "lowongan", id);
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) return null;

    const data = docSnap.data();
	return {
		id: docSnap.id,
		Judul: data.Judul,
		Perusahaan: data.Perusahaan,
		Tipe: data.Tipe,
		Range: {
			min: data.Range.min,
			max: data.Range.max,
		},
		Alamat: data.Alamat,
		ImageSampul: data.ImageSampul,
		Deskripsi: data.Deskripsi,
		Syarat: data.Syarat,
		BatasLowongan: data.BatasLowongan?.toDate().toISOString(),
		LinkLowongan: data.LinkLowongan,
	};
}