import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { PelatihanItem } from "./getPelatihan"

export async function getPelatihanById(id: string): Promise<PelatihanItem | null> {
    const docRef = doc(db, "kegiatan", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const docData = docSnap.data();
    return {
        id: docSnap.id,
        Judul: docData.judul ?? "Tidak ada Judul",
        Deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
        ImageSampul: docData.gambar_sampul ?? "/images/placeholder.jpg",
        ImageDesc: docData.gambar_kegiatan ?? "/images/placeholder.jpg",
        Created: docData.created_at?.toDate().toISOString() ?? "",
        Updated: docData.updated_at?.toDate().toISOString() ?? "",
        TanggalKegiatan: docData.tanggal_kegiatan?.toDate().toISOString() ?? "",
    };
}