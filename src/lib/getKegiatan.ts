import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { cache } from "react";

export type KegiatanItem = {
	id: string;
	Judul: string;
	Deskripsi: string;
	ImageSampul: string;
    Tanggal?: string;
	ImageDesc?: string;
};

export const getKegiatan = cache(async (): Promise<KegiatanItem[]> => {
	const snapshot = await getDocs(collection(db, "Kegiatan"));
	const data = snapshot.docs.map((doc) => {
		const docData = doc.data();
		return {
			id: doc.id,
			Judul: docData.Judul,
			Deskripsi: docData.Deskripsi,
			ImageSampul: docData.ImageSampul,
			Tanggal: docData.Tanggal?.toDate().toISOString(),
		};
	});
	return data;
});