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
            Judul: docData.judul ?? "Tidak ada Judul",
            Perusahaan: docData.perusahaan ?? "Tidak ada Perusahaan",
            Tipe: docData.tipe ?? ["no type"],
            Range: {
                min: docData.range_gaji?.min ?? 0,
                max: docData.range_gaji?.max ?? 0,
            },
            Alamat: docData.alamat ?? "Tidak ada Alamat",
            ImageSampul: docData.gambar_sampul ?? "/images/placeholder.jpg",
            Deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
            Syarat: docData.syarat ?? ["null"],
            BatasLowongan: docData.tenggat_lowongan?.toDate().toISOString() ?? "null",
            LinkLowongan: docData.link_lowongan ?? "",
        }
    });
    return data;
});