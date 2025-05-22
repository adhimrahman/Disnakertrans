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

export async function addLowongan(formData: createLowonganFormData, files: { ImageSampul?: File }) {
  const gambarSampulUrl = files.ImageSampul ? await uploadLowonganImage(files.ImageSampul) : "";
  const collectionRef = collection(db, "lowongan");

  const data = {
    ...formData,
    ImageSampul: gambarSampulUrl
  }

  try {
    const validateData = Validation.validate(createLowonganSchema, data);
    const batasDate = typeof validateData.BatasLowongan === 'string'
      ? new Date(validateData.BatasLowongan)
      : validateData.BatasLowongan;
    
    const result = await addDoc(collectionRef, {
      Judul: validateData.Judul,
      Deskripsi: validateData.Deskripsi,
      nama_lowongan: validateData.nama_lowongan,
      BatasLowongan: Timestamp.fromDate(batasDate),
      Alamat: validateData.Alamat,
      LinkLowongan: validateData.LinkLowongan,
      Perusahaan: validateData.Perusahaan,
      Tipe: validateData.Tipe,
      Syarat: validateData.Syarat,
      Range: {
        max: validateData.Range.max,
        min: validateData.Range.min
      },
      ImageSampul: validateData.ImageSampul,
      tanggal_unggah: Timestamp.now(),
      isDelete: false
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
  const q = query(collectionRef, where("isDelete", "==", false));
  const lowonganCollectionSnapshot = await getDocs(q);

  const lowonganList = lowonganCollectionSnapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_unggah;
    const batas = data.BatasLowongan;

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
      LinkLowongan: data.LinkLowongan ?? '',
      link_konten: data.link_konten ?? '',
      isDelete: data.isDelete ?? false,
      BatasLowongan: batasStr ?? '',
      Perusahaan: data.Perusahaan ?? '',
      tanggal_unggah: tanggalStr ?? '',
      Tipe: data.Tipe ?? [],
    };
  });

  return lowonganList;
};

export async function getLowonganById (id: string): Promise<Partial<Lowongan> | null> {
  const docRef = doc(db, "lowongan", id);
  const lowonganSnapshot = await getDoc(docRef);
  if (!lowonganSnapshot.exists()) return null;

  const data = lowonganSnapshot.data();

  const batas = data.BatasLowongan;
  const batasStr = batas?.toDate()?.toISOString().substring(0, 10) ?? '';
  
  return {
    id: lowonganSnapshot.id,
    Judul: data.Judul ?? '',
    nama_lowongan: data.nama_lowongan ?? '',
    Deskripsi: data.Deskripsi ?? '',
    ImageSampul: data.ImageSampul ?? null,
    BatasLowongan: batasStr ?? '',
    Range: {
      min: data.Range?.min ?? 0,
      max: data.Range?.max ?? 0
    },
    Tipe: data.Tipe ?? [],
    Syarat: data.Syarat ?? [],
    Perusahaan: data.Perusahaan ?? '',
    Alamat: data.Alamat ?? '',
    LinkLowongan: data.LinkLowongan ?? '',
    link_konten: data.link_konten ?? '',
  }
}

export async function updateLowongan (formData: Partial<Lowongan>, files: { ImageSampul?: File }) {
  const gambarSampulUrl = files.ImageSampul ? await uploadLowonganImage(files.ImageSampul) : formData.ImageSampul || "";

  const docRef = doc(db, "lowongan", formData.id);
  const data = {
    ...formData,
    ImageSampul: gambarSampulUrl,
  };

  try {
    const validateData = Validation.validate(updateLowonganSchema, data);
    const batasDate = typeof validateData.BatasLowongan === 'string'
      ? new Date(validateData.BatasLowongan)
      : validateData.BatasLowongan;
    
    const result = await updateDoc(docRef, {
      Judul: validateData.Judul,
      Deskripsi: validateData.Deskripsi,
      nama_lowongan: validateData.nama_lowongan,
      BatasLowongan: batasDate ? Timestamp.fromDate(batasDate) : undefined,
      Alamat: validateData.Alamat,
      LinkLowongan: validateData.LinkLowongan,
      Perusahaan: validateData.Perusahaan,
      Tipe: validateData.Tipe,
      Syarat: validateData.Syarat,
      Range: {
        max: Number(validateData.Range?.max),
        min: Number(validateData.Range?.min)
      },
      ImageSampul: validateData.ImageSampul,
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
  await updateDoc(docRef, { isDelete: true });
};

export async function getLowonganByDateAndSort(
  sortField: keyof LowonganItem = "BatasLowongan",
  sortOrder: "asc" | "desc" = "asc"
): Promise<LowonganItem[]> {
  const collectionRef = collection(db, "lowongan");

  let q = query(collectionRef, where("isDelete", "==", false));
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

    const batas = data.BatasLowongan;
    const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_lowongan: data.nama_lowongan ?? '',
      LinkLowongan: data.LinkLowongan ?? '',
      link_konten: data.link_konten ?? '',
      isDelete: data.isDelete ?? false,
      BatasLowongan: batasStr ?? '',
      Perusahaan: data.Perusahaan ?? '',
      tanggal_unggah: tanggalStr ?? '',
      Tipe: data.Tipe ?? [],
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
      item.BatasLowongan?.toLowerCase().includes(lowerSearch) ||
      item.Perusahaan.toLowerCase().includes(lowerSearch) || 
      item.tanggal_unggah?.toLowerCase().includes(lowerSearch)
    );
  });

  return filtered;
};

export async function fetchLowonganPage (pageNumber: number, pageSize: number) {
  const pageCursors: QueryDocumentSnapshot[] = [];
  const collectionRef = collection(db, "lowongan");
  let q = query(collectionRef, where("isDelete", "==", false), orderBy("tanggal_unggah"));

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

    const batas = data.BatasLowongan;
    const batasStr = batas?.toDate() ? batas.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_lowongan: data.nama_lowongan ?? '',
      LinkLowongan: data.LinkLowongan ?? '',
      link_konten: data.link_konten ?? '',
      isDelete: data.isDelete ?? false,
      BatasLowongan: batasStr ?? '',
      Perusahaan: data.Perusahaan ?? '',
      tanggal_unggah: tanggalStr ?? '',
      Tipe: data.Tipe ?? [],
    };
  });
};