import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export type PelatihanItem = {
    id: string;
    judul: string;
    deskripsi: string;
    gambar_pelatihan: string;
    Created: string;
    Updated: string;
    link_form: string;
    tanggal_kegiatan: string;
};

export async function getPelatihanById(id: string): Promise<PelatihanItem | null> {
    const docRef = doc(db, "pelatihan", id); 
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const docData = docSnap.data();
    return {
        id: docSnap.id,
        judul: docData.judul ?? "Tidak ada Judul",
        deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
        gambar_pelatihan: docData.gambar_pelatihan ?? "/images/placeholder.jpg",
        Created: docData.created_at?.toDate().toISOString() ?? "",
        Updated: docData.updated_at?.toDate().toISOString() ?? "",
        link_form: docData.link ?? "",
        tanggal_kegiatan: docData.tanggal_kegiatan?.toDate().toISOString() ?? "",
    };
}