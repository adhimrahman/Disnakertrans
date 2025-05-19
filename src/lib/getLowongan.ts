import { cache } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export type LowonganItem = {
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
	BatasLowongan?: string;
	LinkLowongan: string;
};

export const getLowongan = cache(async (): Promise<LowonganItem[]> => {
    const snapshot = await getDocs(collection(db, "lowongan"));
    const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
            id: doc.id,
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
    });
    return data;
});