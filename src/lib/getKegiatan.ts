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
    Created?: string;
    Updated?: string;
};

export const getKegiatan = cache(async (): Promise<KegiatanItem[]> => {
    const snapshot = await getDocs(collection(db, "kegiatan"));
    const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
            id: doc.id,
            Judul: docData.judul ?? "Tidak ada Judul",
            Deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
            ImageSampul: docData.gambar_sampul ?? "/images/placeholder.jpg",
            Created: docData.created_at?.toDate().toISOString() ?? "",
            Updated: docData.updated_at?.toDate().toISOString() ?? "",
        };
    });
    return data;
});