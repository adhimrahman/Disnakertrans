import { collection, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { db } from "../config";
import { LaporanItem } from "@/models/LPK";

export async function getLowongan(): Promise<LaporanItem[]> {
  const collectionRef = collection(db, "laporan");
  const laporanLPKCollectionRef = await getDocs(collectionRef);

  const laporanLPKList = laporanLPKCollectionRef.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_pelaksanaan;

    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      nama_lembaga: data.nama_lembaga ?? '',
      tanggal_pelaksanaan: tanggalStr ?? '',
      instruktur: {
        jumlah_instruktur: data.instruktur.jumlah_instruktur ?? 0,
        jumlah_instruktur_sertifikat: data.instruktur.jumlah_instruktur_sertifikat ?? 0,
      },
      peserta: {
        jumlah_pendaftar: data.peserta.jumlah_pendaftar ?? 0,
        jumlah_dilatih: data.peserta.jumlah_dilatih ?? 0,
        jumlah_lulus: data.peserta.jumlah_lulus ?? 0,
        jumlah_peserta_sertifikat: data.peserta.jumlah_peserta_sertifikat ?? 0,
        jumlah_bekerja: data.peserta.jumlah_bekerja ?? 0,
      },
    };
  });

  return laporanLPKList;
};

export async function getLaporanLPKBySort(
  sortField: keyof LaporanItem = "tanggal_pelaksanaan",
  sortOrder: "asc" | "desc" = "asc"
): Promise<LaporanItem[]> {
  const collectionRef = collection(db, "laporan");

  const q = query(collectionRef, orderBy(sortField as string, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_pelaksanaan;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_lembaga: data.nama_lembaga ?? '',
      tanggal_pelaksanaan: tanggalStr ?? '',
      instruktur: {
        jumlah_instruktur: data.instruktur.jumlah_instruktur ?? 0,
        jumlah_instruktur_sertifikat: data.instruktur.jumlah_instruktur_sertifikat ?? 0,
      },
      peserta: {
        jumlah_pendaftar: data.peserta.jumlah_pendaftar ?? 0,
        jumlah_dilatih: data.peserta.jumlah_dilatih ?? 0,
        jumlah_lulus: data.peserta.jumlah_lulus ?? 0,
        jumlah_peserta_sertifikat: data.peserta.jumlah_peserta_sertifikat ?? 0,
        jumlah_bekerja: data.peserta.jumlah_bekerja ?? 0,
      },
    };
  });
};

export async function getLaporanLPKFiltered(
  search: string,
  sortField: keyof LaporanItem = "tanggal_pelaksanaan",
  sortOrder: "asc" | "desc" = "asc"
): Promise<LaporanItem[]> {
  const allData = await getLaporanLPKBySort(sortField, sortOrder);
  if (!search.trim()) return allData;
  
  const lowerSearch = search.toLowerCase();
  const filtered = allData.filter((item) => {
    return (
      item.nama_lembaga.toLowerCase().includes(lowerSearch) ||
      item.tanggal_pelaksanaan?.toLowerCase().includes(lowerSearch)
    );
  });

  return filtered;
};

export async function fetchLowonganPage (pageNumber: number, pageSize: number) {
  const pageCursors: QueryDocumentSnapshot[] = [];
  const collectionRef = collection(db, "laporan");
  let q = query(collectionRef, orderBy("nama_lembaga"));

  if (pageNumber === 1) {
    q = query(q, limit(pageSize));
  } else {
    // Use the cursor of previous page to start after
    const cursor = pageCursors[pageNumber - 2]; // zero-based index
    if (!cursor) throw new Error("Cursor for page not found");
    q = query(q, startAfter(cursor), limit(pageSize));
  };

  const snapshot = await getDocs(q);
  pageCursors[pageNumber - 1] = snapshot.docs[0];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_pelaksanaan;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_lembaga: data.nama_lembaga ?? '',
      tanggal_pelaksanaan: tanggalStr ?? '',
      instruktur: {
        jumlah_instruktur: data.instruktur.jumlah_instruktur ?? 0,
        jumlah_instruktur_sertifikat: data.instruktur.jumlah_instruktur_sertifikat ?? 0,
      },
      peserta: {
        jumlah_pendaftar: data.peserta.jumlah_pendaftar ?? 0,
        jumlah_dilatih: data.peserta.jumlah_dilatih ?? 0,
        jumlah_lulus: data.peserta.jumlah_lulus ?? 0,
        jumlah_peserta_sertifikat: data.peserta.jumlah_peserta_sertifikat ?? 0,
        jumlah_bekerja: data.peserta.jumlah_bekerja ?? 0,
      },
    };
  });
};