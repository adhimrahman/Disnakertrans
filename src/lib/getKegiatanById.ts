import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { KegiatanItem } from "./getKegiatan"

export async function getKegiatanById(id: string): Promise<KegiatanItem | null> {
    const docRef = doc(db, "Kegiatan", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
        id: docSnap.id,
        Judul: data.Judul,
        Deskripsi: data.Deskripsi,
        ImageSampul: data.ImageSampul,
        Tanggal: data.Tanggal?.toDate().toISOString(),
        ImageDesc: data.ImageDesc,
    };
}