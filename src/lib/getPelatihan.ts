import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { cache } from "react";

export type PelatihanItem = {
    id: string;
    Judul: string;
    Deskripsi: string;
    ImageSampul: string;
	Tanggal?: string;
    ImageDesc?: string;
    Created?: string;
    Updated?: string;
    TanggalKegiatan?: string;
};

export const getPelatihan = cache(async (): Promise<PelatihanItem[]> => {
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
            TanggalKegiatan: docData.tanggal_kegiatan?.toDate().toISOString() ?? "",
        };
    });
    return data;
});