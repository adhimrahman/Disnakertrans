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
import { uploadKegiatanImage } from "@/cloudinary/upload";
import { Kegiatan, KegiatanItem } from "@/models/Kegiatan";

export async function addKegiatan (formData: createKegiatanFormData, files: { ImageSampul?: File, ImageDesc?: File }) {
  const gambarSampulUrl   = files.ImageSampul ? await uploadKegiatanImage(files.ImageSampul) : "";
  const gambarKegiatanUrl = files.ImageDesc ? await uploadKegiatanImage(files.ImageDesc) : "";

  const collectionRef = collection(db, "Kegiatan");
  const data = {
    ...formData,
    ImageSampul: gambarSampulUrl,
    ImageDesc: gambarKegiatanUrl
  }
  try {
    const validatedData = Validation.validate(createKegiatanSchema, data);
    const result = await addDoc(collectionRef, {
      Judul: validatedData.Judul,
      Deskripsi: validatedData.Deskripsi,
      ImageSampul: validatedData.ImageSampul,
      ImageDesc: validatedData.ImageDesc,
      isDelete: false,
      Tanggal: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    const docRef = doc(db, "Kegiatan", result.id);

    await updateDoc(docRef, { link: `http://localhost:3000/kegiatan/${docRef.id}` });
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getKegiatan (): Promise<KegiatanItem[]> {
  const collectionRef = collection(db, "Kegiatan");
  const q = query(collectionRef, where("isDelete", "==", false));
  const kegiatanCollectionSnapshot = await getDocs(q);

  const kegiatanList = kegiatanCollectionSnapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.Tanggal;

    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      Judul: data.Judul || '',
      Deskripsi: data.Deskripsi || '',
      ImageSampul: data.ImageSampul, // may be undefined or convert accordingly
      ImageDesc: data.ImageDesc,
      link: data.link || '',
      isDelete: data.isDelete ?? false,
      Tanggal: tanggalStr,
    }
  });

  return kegiatanList;
};

export async function getKegiatanById (id: string): Promise<KegiatanItem | null> {
  const docRef = doc(db, "Kegiatan", id);
  const kegiatanSnapshot = await getDoc(docRef);
  if (!kegiatanSnapshot.exists()) return null;

  const data = kegiatanSnapshot.data();
  const tanggal = data.Tanggal;
  const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
  }) : null;

  return {
    id: kegiatanSnapshot.id,
    Judul: data.Judul ?? '',
    Deskripsi: data.Deskripsi ?? '',
    ImageSampul: data.ImageSampul, // may be undefined or convert accordingly
    ImageDesc: data.ImageDesc,
    link: data.link ?? '',
    isDelete: data.isDelete ?? false,
    Tanggal: tanggalStr,
  }
};

export async function updateKegiatan(formData: Partial<Kegiatan>, files: { ImageSampul?: File, ImageDesc?: File }) {
  const gambarSampulUrl = files.ImageSampul ? await uploadKegiatanImage(files.ImageSampul) : formData.ImageSampul || "";
  const gambarKegiatanUrl = files.ImageDesc ? await uploadKegiatanImage(files.ImageDesc) : formData.ImageDesc || "";

  const docRef = doc(db, "Kegiatan", formData.id);
  const data = {
    ...formData,
    ImageSampul: gambarSampulUrl,
    ImageDesc: gambarKegiatanUrl
  };
  
  try {
    const validatedData = Validation.validate(updateKegiatanSchema, data);
    const result = await updateDoc(docRef, {
      Judul: validatedData.Judul,
      Deskripsi: validatedData.Deskripsi,
      ImageSampul: validatedData.ImageSampul,
      ImageDesc: validatedData.ImageDesc,
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
  const docRef = doc(db, "Kegiatan", validatedData);

  await updateDoc(docRef, { isDelete: true });
}

export async function getKegiatanByDateAndSort(
  sortField: keyof KegiatanItem = "Tanggal",
  sortOrder: "asc" | "desc" = "asc"
): Promise<KegiatanItem[]> {
  const collectionRef = collection(db, "Kegiatan");

  let q = query(collectionRef, where("isDelete", "==", false));
  q = query(q, orderBy(sortField as string, sortOrder));

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const tanggal = data.Tanggal;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : null;

    return {
      id: doc.id,
      Judul: data.Judul || '',
      Deskripsi: data.Deskripsi || '',
      ImageSampul: data.ImageSampul,
      ImageDesc: data.ImageDesc,
      link: data.link || '',
      isDelete: data.isDelete ?? false,
      Tanggal: tanggalStr,
    };
  });
}

export async function getKegiatanFilteredByJudulContains(
  search: string,
  sortField: keyof KegiatanItem = "Tanggal",
  sortOrder: "asc" | "desc" = "asc"
): Promise<KegiatanItem[]> {
  const allData = await getKegiatanByDateAndSort(sortField, sortOrder);

  if (!search.trim()) return allData;

  const lowerSearch = search.toLowerCase();

  const filtered = allData.filter(item =>{    
    return (
      item.Judul.toLowerCase().includes(lowerSearch) ||
      item.Tanggal?.toLowerCase().includes(lowerSearch)
    )
  });

  return filtered;
}

export async function fetchPage(pageNumber: number, pageSize: number) {
  // Store the first document snapshot of each page
  const pageCursors: QueryDocumentSnapshot[] = [];
  const collectionRef = collection(db, "Kegiatan");
  let q = query(collectionRef, where("isDelete", "==", false), orderBy("Judul"));

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
    const tanggal = data.Tanggal;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      Judul: data.Judul || '',
      Deskripsi: data.Deskripsi || '',
      ImageSampul: data.ImageSampul,
      ImageDesc: data.ImageDesc,
      link: data.link || '',
      isDelete: data.isDelete ?? false,
      Tanggal: tanggalStr,
    };
  });
}