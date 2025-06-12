import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { cache } from "react";
import { PelatihanItem } from "@/models/Pelatihan";


export const getPelatihan = cache(async (lpkId: string): Promise<PelatihanItem[]> => {
    if (!lpkId || typeof lpkId !== 'string' || lpkId.trim() === '') {
        return [];
    }
    const snapshot = await getDocs(collection(db, "akun", lpkId, "pelatihan"));
    const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
            id: doc.id,
            judul: docData.judul ?? "Tidak ada Judul",
            deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
            gambar_pelatihan: docData.gambar_pelatihan ?? "/images/placeholder.jpg",
            link_form: docData.link_form ?? "",
            created_at: docData.created_at?.toDate().toISOString() ?? "",
            updated_at: docData.updated_at?.toDate().toISOString() ?? "",
            tanggal_kegiatan: docData.tanggal_kegiatan?.toDate().toISOString() ?? "",
        };
    });
    return data;
});