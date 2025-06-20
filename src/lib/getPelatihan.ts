import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { cache } from "react";

export type PelatihanItem = {
    id: string;
    judul: string;
    deskripsi: string;
    gambar_pelatihan: string;
    link_form: string;
    created_at: string;
    updated_at: string;
    tanggal_kegiatan: string;
};

export const getPelatihan = cache(async (): Promise<PelatihanItem[]> => {
    const snapshot = await getDocs(collection(db, "pelatihan")); 
    const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const tanggal = docData.tanggal_kegiatan?.toDate();
        const tanggalStr = tanggal ? tanggal.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "";
        console.log(docData.gambar_pelatihan);

        return {
            id: doc.id,
            judul: docData.judul ?? "Tidak ada Judul",
            deskripsi: docData.deskripsi ?? "Tidak ada Deskripsi",
            gambar_pelatihan: docData.gambar_pelatihan ?? "/images/placeholder.jpg",
            link_form: docData.link_form ?? "",
            link_konten: docData.link_konten ?? "",
            created_at: docData.created_at?.toDate().toISOString() ?? "",
            updated_at: docData.updated_at?.toDate().toISOString() ?? "",
            tanggal_kegiatan: tanggalStr,
        };
    });

    return data;
});