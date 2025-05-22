'use server'

import {
  collection, getDocs, Timestamp,
  updateDoc, where, query, doc, orderBy,
  QueryDocumentSnapshot, limit, startAfter,
  getDoc, addDoc, 
} from "firebase/firestore"
import { db } from "../config"
import { Validation } from "@/validation/validation";
import { createLowonganFormData, createLowonganSchema, getLowonganSchema, updateLowonganSchema } from "@/validation/lowongan-validation";
import { uploadLowonganImage } from "@/cloudinary/upload"; 
import { Lowongan, LowonganItem } from "@/models/Lowongan";

export async function addLowongan(formData: createLowonganFormData, files: { gambar_sampul?: File }) {
  const gambarSampulUrl = files.gambar_sampul ? await uploadLowonganImage(files.gambar_sampul) : "";
  const collectionRef = collection(db, "lowongan");

  const data = {
    ...formData,
    gambar_sampul: gambarSampulUrl
  }

  try {
    const validateData = Validation.validate(createLowonganSchema, data);
    const batasDate = typeof validateData.batas_lowongan === 'string'
      ? new Date(validateData.batas_lowongan)
      : validateData.batas_lowongan;
    
    const result = await addDoc(collectionRef, {
      judul: validateData.judul,
      deskripsi: validateData.deskripsi,
      nama_lowongan: validateData.nama_lowongan,
      batas_lowongan: Timestamp.fromDate(batasDate),
      alamat: validateData.alamat,
      link_lowongan: validateData.link_lowongan,
      perusahaan: validateData.perusahaan,
      tipe: validateData.tipe,
      syarat: validateData.syarat,
      range_gaji: {
        max: validateData.range_gaji.max,
        min: validateData.range_gaji.min
      },
      gambar_sampul: validateData.gambar_sampul,
      tanggal_unggah: Timestamp.now(),
      is_delete: false
    });

    const docRef = doc(db, "lowongan", result.id);

    await updateDoc(docRef, {link_konten: `http://localhost:3000/lowongan/${docRef.id}`});
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export async function getLowongan(): Promise<Partial<LowonganItem[]>> {
  const collectionRef = collection(db, "lowongan");
  const q = query(collectionRef, where("is_delete", "==", false));
  const lowonganCollectionSnapshot = await getDocs(q);

  const lowonganList = lowonganCollectionSnapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_unggah;
    const batas = data.batas_lowongan;

    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      nama_lowongan: data.nama_lowongan ?? '',
      link_lowongan: data.link_lowongan ?? '',
      link_konten: data.link_konten ?? '',
      is_delete: data.is_delete ?? false,
      batas_lowongan: batasStr ?? '',
      perusahaan: data.perusahaan ?? '',
      tanggal_unggah: tanggalStr ?? '',
      tipe: data.Tipe ?? [],
    };
  });

  return lowonganList;
};

export async function getLowonganById (id: string): Promise<Partial<Lowongan> | null> {
  const docRef = doc(db, "lowongan", id);
  const lowonganSnapshot = await getDoc(docRef);
  if (!lowonganSnapshot.exists()) return null;

  const data = lowonganSnapshot.data();

  const batas = data.batas_lowongan;
  const batasStr = batas?.toDate()?.toISOString().substring(0, 10) ?? '';
  
  return {
    id: lowonganSnapshot.id,
    judul: data.judul ?? '',
    nama_lowongan: data.nama_lowongan ?? '',
    deskripsi: data.deskripsi ?? '',
    gambar_sampul: data.gambar_sampul ?? null,
    batas_lowongan: batasStr ?? '',
    range_gaji: {
      min: data.range_gaji?.min ?? 0,
      max: data.range_gaji?.max ?? 0
    },
    tipe: data.tipe ?? [],
    syarat: data.syarat ?? [],
    perusahaan: data.perusahaan ?? '',
    alamat: data.alamat ?? '',
    link_lowongan: data.link_lowongan ?? '',
    link_konten: data.link_konten ?? '',
  }
}

export async function updateLowongan (formData: Partial<Lowongan>, files: { gambar_sampul?: File }) {
  const gambarSampulUrl = files.gambar_sampul ? await uploadLowonganImage(files.gambar_sampul) : formData.gambar_sampul || "";

  const docRef = doc(db, "lowongan", formData.id);
  const data = {
    ...formData,
    gambar_sampul: gambarSampulUrl,
  };

  try {
    const validateData = Validation.validate(updateLowonganSchema, data);
    const batasDate = typeof validateData.batas_lowongan === 'string'
      ? new Date(validateData.batas_lowongan)
      : validateData.batas_lowongan;
    
    const result = await updateDoc(docRef, {
      judul: validateData.judul,
      deskripsi: validateData.deskripsi,
      nama_lowongan: validateData.nama_lowongan,
      batas_lowongan: batasDate ? Timestamp.fromDate(batasDate) : undefined,
      alamat: validateData.alamat,
      link_lowongan: validateData.link_lowongan,
      perusahaan: validateData.perusahaan,
      tipe: validateData.tipe,
      syarat: validateData.syarat,
      range_gaji: {
        max: Number(validateData.range_gaji?.max),
        min: Number(validateData.range_gaji?.min)
      },
      gambar_sampul: validateData.gambar_sampul,
      link_konten: validateData.link_konten,
    });

    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteLowonganById (lowongan_id: string) {
  const validateDate = Validation.validate(getLowonganSchema, lowongan_id);
  const docRef = doc(db, "lowongan", validateDate);
  await updateDoc(docRef, { is_delete: true });
};

export async function getLowonganByDateAndSort(
  sortField: keyof LowonganItem = "batas_lowongan",
  sortOrder: "asc" | "desc" = "asc"
): Promise<LowonganItem[]> {
  const collectionRef = collection(db, "lowongan");

  let q = query(collectionRef, where("is_delete", "==", false));
  q = query(q, orderBy(sortField as string, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_unggah;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    const batas = data.batas_lowongan;
    const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_lowongan: data.nama_lowongan ?? '',
      link_lowongan: data.link_lowongan ?? '',
      link_konten: data.link_konten ?? '',
      is_delete: data.is_delete ?? false,
      batas_lowongan: batasStr ?? '',
      perusahaan: data.perusahaan ?? '',
      tanggal_unggah: tanggalStr ?? '',
      tipe: data.Tipe ?? [],
    };
  });
};

export async function getLowonganFilteredByJudulContains(
  search: string,
  sortField: keyof LowonganItem = "tanggal_unggah",
  sortOrder: "asc" | "desc" = "asc"
): Promise<LowonganItem[]> {
  const allData = await getLowonganByDateAndSort(sortField, sortOrder);
  if (!search.trim()) return allData;
  
  const lowerSearch = search.toLowerCase();
  const filtered = allData.filter((item) => {
    return (
      item.nama_lowongan.toLowerCase().includes(lowerSearch) ||
      item.batas_lowongan?.toLowerCase().includes(lowerSearch) ||
      item.perusahaan.toLowerCase().includes(lowerSearch) || 
      item.tanggal_unggah?.toLowerCase().includes(lowerSearch)
    );
  });

  return filtered;
};

export async function fetchLowonganPage (pageNumber: number, pageSize: number) {
  const pageCursors: QueryDocumentSnapshot[] = [];
  const collectionRef = collection(db, "lowongan");
  let q = query(collectionRef, where("is_delete", "==", false), orderBy("tanggal_unggah"));

  if (pageNumber === 1) {
    q = query(q, limit(pageSize));
  } else {
    // Use the cursor of previous page to start after
    const cursor = pageCursors[pageNumber - 2]; // zero-based index
    if (!cursor) throw new Error("Cursor for page not found");
    q = query(q, startAfter(cursor), limit(pageSize));
  }

  const snapshot = await getDocs(q);
  pageCursors[pageNumber - 1] = snapshot.docs[0];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_unggah;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    const batas = data.batas_lowongan;
    const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_lowongan: data.nama_lowongan ?? '',
      link_lowongan: data.link_lowongan ?? '',
      link_konten: data.link_konten ?? '',
      is_delete: data.is_delete ?? false,
      batas_lowongan: batasStr ?? '',
      perusahaan: data.perusahaan ?? '',
      tanggal_unggah: tanggalStr ?? '',
      tipe: data.Tipe ?? [],
    };
  });
};