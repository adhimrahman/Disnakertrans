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
};

export const getLowongan = cache(async (): Promise<LowonganItem[]> => {
    const snapshot = await getDocs(collection(db, "lowongan"));
    const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
            id: doc.id,
            Judul: docData.Judul,
            Perusahaan: docData.Perusahaan,
            Tipe: docData.Tipe,
            Range: {
                min: docData.Range.min,
                max: docData.Range.max,
            },
            Alamat: docData.Alamat,
            ImageSampul: docData.ImageSampul,
        }
    });
    return data;
});