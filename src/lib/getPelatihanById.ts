import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { PelatihanItem } from "./getPelatihan";

export async function getPelatihanById(id: string): Promise<PelatihanItem | null> {
    const docRef = doc(db, "pelatihan", id); 
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const docData = docSnap.data();    return {
        id: docSnap.id,
        judul: docData.judul ?? "Tidak ada Judul",
        deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
        gambar_pelatihan: docData.gambar_pelatihan ?? "/images/placeholder.jpg",
        created_at: docData.created_at?.toDate().toISOString() ?? "",
        updated_at: docData.updated_at?.toDate().toISOString() ?? "",
        link_form: docData.link_form ?? "",
        tanggal_kegiatan: docData.tanggal_kegiatan?.toDate().toISOString() ?? "",
    };
}