import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { KegiatanItem } from "./getKegiatan"

export async function getKegiatanById(id: string): Promise<KegiatanItem | null> {
    const docRef = doc(db, "Kegiatan", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const docData = docSnap.data();
    return {
        id: docSnap.id,
        Judul: docData.Judul ?? "Tidak ada Judul",
        Deskripsi: docData.Deskripsi ?? "Tidak ada Deskripsi",
        ImageSampul: docData.ImageSampul ?? "/images/placeholder.jpg",
        Tanggal: docData.Tanggal?.toDate().toISOString() ?? "",
        ImageDesc: docData.ImageDesc ?? "/images/placeholder.jpg",
    };
}