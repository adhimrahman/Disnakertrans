'use server'

import {
  collection, getDocs, Timestamp,
  updateDoc, where, query, doc, orderBy,
  QueryDocumentSnapshot, limit, startAfter,
  getDoc, addDoc, 
} from "firebase/firestore"
import { db } from "../config"
import { Validation } from "@/validation/validation";
import { createKegiatanFormData, createKegiatanSchema, getKegiatanSchema, updateKegiatanSchema } from "@/validation/kegiatan-validation";
import { uploadKegiatanImage } from "@/firebase/uploadToStorage";
import { Kegiatan, KegiatanItem } from "@/models/Kegiatan";

export async function addKegiatan (formData: createKegiatanFormData, files: { gambar_sampul?: File, gambar_kegiatan?: File }) {
  const gambarSampulUrl   = files.gambar_sampul ? await uploadKegiatanImage(files.gambar_sampul) : "";
  const gambarKegiatanUrl = files.gambar_kegiatan ? await uploadKegiatanImage(files.gambar_kegiatan) : "";

  const collectionRef = collection(db, "kegiatan");
  const data = {
    ...formData,
    gambar_sampul: gambarSampulUrl,
    gambar_kegiatan: gambarKegiatanUrl
  }
  try {
    const validatedData = Validation.validate(createKegiatanSchema, data);
    const result = await addDoc(collectionRef, {
      judul: validatedData.judul,
      deskripsi: validatedData.deskripsi,
      gambar_sampul: validatedData.gambar_sampul,
      gambar_kegiatan: validatedData.gambar_kegiatan,
      is_deleted: false,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    const docRef = doc(db, "kegiatan", result.id);

    await updateDoc(docRef, { link: `http://localhost:3000/kegiatan/${docRef.id}` });
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getKegiatan (): Promise<KegiatanItem[]> {
  const collectionRef = collection(db, "kegiatan");
  const q = query(collectionRef, where("is_deleted", "==", false));
  const kegiatanCollectionSnapshot = await getDocs(q);

  const kegiatanList = kegiatanCollectionSnapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.created_at;

    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      judul: data.judul || '',
      deskripsi: data.deskripsi || '',
      gambar_sampul: data.gambar_sampul, // may be undefined or convert accordingly
      gambar_kegiatan: data.gambar_kegiatan,
      link: data.link || '',
      is_deleted: data.is_deleted ?? true,
      created_at: tanggalStr,
    }
  });

  return kegiatanList;
};

export async function getKegiatanById (id: string): Promise<KegiatanItem | null> {
  const docRef = doc(db, "kegiatan", id);
  const kegiatanSnapshot = await getDoc(docRef);
  if (!kegiatanSnapshot.exists()) return null;

  const data = kegiatanSnapshot.data();
  const tanggal = data.created_at;
  const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
  }) : null;

  return {
    id: kegiatanSnapshot.id,
    judul: data.judul ?? '',
    deskripsi: data.deskripsi ?? '',
    gambar_sampul: data.gambar_sampul, // may be undefined or convert accordingly
    gambar_kegiatan: data.gambar_kegiatan,
    link: data.link ?? '',
    is_deleted: data.is_deleted ?? true,
    created_at: tanggalStr,
  }
};

export async function updateKegiatan(formData: Partial<Kegiatan>, files: { gambar_sampul?: File, gambar_kegiatan?: File }) {
  const gambarSampulUrl = files.gambar_sampul ? await uploadKegiatanImage(files.gambar_sampul) : formData.gambar_sampul || "";
  const gambarKegiatanUrl = files.gambar_kegiatan ? await uploadKegiatanImage(files.gambar_kegiatan) : formData.gambar_kegiatan || "";

  const docRef = doc(db, "kegiatan", formData.id);
  const data = {
    ...formData,
    gambar_sampul: gambarSampulUrl,
    gambar_kegiatan: gambarKegiatanUrl
  };
  
  try {
    const validatedData = Validation.validate(updateKegiatanSchema, data);
    const result = await updateDoc(docRef, {
      judul: validatedData.judul,
      deskripsi: validatedData.deskripsi,
      gambar_sampul: validatedData.gambar_sampul,
      gambar_kegiatan: validatedData.gambar_kegiatan,
      updated_at: Timestamp.now()
    });

    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export async function deleteKegiatanById (kegiatan_id: string) {
  const validatedData = Validation.validate(getKegiatanSchema, kegiatan_id);
  const docRef = doc(db, "kegiatan", validatedData);

  await updateDoc(docRef, { is_deleted: true });
}

export async function getKegiatanByDateAndSort(
  sortField: keyof KegiatanItem = "created_at",
  sortOrder: "asc" | "desc" = "asc"
): Promise<KegiatanItem[]> {
  const collectionRef = collection(db, "kegiatan");

  let q = query(collectionRef, where("is_deleted", "==", false));
  q = query(q, orderBy(sortField as string, sortOrder));

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const tanggal = data.created_at;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : null;

    return {
      id: doc.id,
      judul: data.judul ?? '',
      deskripsi: data.deskripsi ?? '',
      gambar_sampul: data.gambar_sampul,
      gambar_kegiatan: data.gambar_kegiatan,
      link: data.link ?? '',
      is_deleted: data.is_deleted ?? true,
      created_at: tanggalStr,
    };
  });
}

export async function getKegiatanFilteredByJudulContains(
  search: string,
  sortField: keyof KegiatanItem = "created_at",
  sortOrder: "asc" | "desc" = "asc"
): Promise<KegiatanItem[]> {
  const allData = await getKegiatanByDateAndSort(sortField, sortOrder);

  if (!search.trim()) return allData;

  const lowerSearch = search.toLowerCase();

  const filtered = allData.filter(item =>{    
    return (
      item.judul.toLowerCase().includes(lowerSearch) ||
      item.created_at?.toLowerCase().includes(lowerSearch)
    )
  });

  return filtered;
}

export async function fetchPage(pageNumber: number, pageSize: number) {
  // Store the first document snapshot of each page
  const pageCursors: QueryDocumentSnapshot[] = [];
  const collectionRef = collection(db, "kegiatan");
  let q = query(collectionRef, where("is_deleted", "==", false), orderBy("judul"));

  if (pageNumber === 1) {
    q = query(q, limit(pageSize));
  } else {
    // Use the cursor of previous page to start after
    const cursor = pageCursors[pageNumber - 2]; // zero-based index
    if (!cursor) throw new Error("Cursor for page not found");
    q = query(q, startAfter(cursor), limit(pageSize));
  }

  const snapshot = await getDocs(q);
  // Store first doc of this page for future navigation
  pageCursors[pageNumber - 1] = snapshot.docs[0];

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const tanggal = data.created_at;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      judul: data.judul ?? '',
      deskripsi: data.deskripsi ?? '',
      gambar_sampul: data.gambar_sampul,
      gambar_kegiatan: data.gambar_kegiatan,
      link: data.link ?? '',
      is_deleted: data.is_deleted ?? true,
      created_at: tanggalStr,
    };
  });
}