import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import type { LowonganItem } from "./getLowongan";

export async function getLowonganById(id: string): Promise<LowonganItem | null> {
    const docRef = doc(db, "lowongan", id);
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) return null;

    const docData = docSnap.data();
	return {
		id: docSnap.id,
		Judul: docData.Judul ?? "Tidak ada Judul",
		Perusahaan: docData.Perusahaan ?? "Tidak ada Perusahaan",
		Tipe: docData.Tipe ?? ["no type"],
		Range: {
			min: docData.min ?? 0,
			max: docData.max ?? 0,
		},
		Alamat: docData.Alamat ?? "Tidak ada Alamat",
		ImageSampul: docData.ImageSampul ?? "/images/placeholder.jpg",
		Deskripsi: docData.Deskripsi ?? "Tidak ada Deskripsi",
		Syarat: docData.Syarat ?? ["null"],
		BatasLowongan: docData.BatasLowongan?.toDate().toISOString() ?? "null",
		LinkLowongan: docData.LinkLowongan ?? "",
	}
}