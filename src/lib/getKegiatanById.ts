import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { KegiatanItem } from "./getKegiatan";

export async function getKegiatanById(id: string): Promise<KegiatanItem | null> {
    const docRef = doc(db, "kegiatan", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const docData = docSnap.data();

    const gambarKegiatanField = docData.gambar_kegiatan;
    let resolvedImageDesc = "/images/placeholder.jpg";

    if (typeof gambarKegiatanField === "string") {
        resolvedImageDesc = gambarKegiatanField;
    } else if (Array.isArray(gambarKegiatanField) && gambarKegiatanField.length > 0) {
        resolvedImageDesc = gambarKegiatanField[0]; // ambil gambar pertama
    }

    return {
        id: docSnap.id,
        Judul: docData.judul ?? "Tidak ada Judul",
        Deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
        ImageSampul: docData.gambar_sampul ?? "/images/placeholder.jpg",
        ImageDesc: resolvedImageDesc,
        Created: docData.created_at?.toDate().toISOString() ?? "",
        Updated: docData.updated_at?.toDate().toISOString() ?? "",
        TanggalKegiatan: docData.tanggal_kegiatan?.toDate().toISOString() ?? "",
    };
}