'use server'

import {
  collection, getDocs, Timestamp,
  updateDoc, where, query, doc, orderBy,
  QueryDocumentSnapshot, limit, startAfter,
  getDoc,
  setDoc, 
} from "firebase/firestore"
import { db } from "../config"
import { Validation } from "@/validation/validation";
import { createKegiatanSchema, getKegiatanSchema, updateKegiatanSchema } from "@/validation/kegiatan-validation";
import { uploadKegiatanImage } from "@/cloudinary/upload";
import { KegiatanItem } from "@/models/Kegiatan";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addKegiatan (formData: any, files: { ImageSampul?: File, ImageDesc?: File }) {
  // const data = formDataToObject(formData);

  const gambarSampulUrl   = files.ImageSampul ? await uploadKegiatanImage(files.ImageSampul) : "";
  const gambarKegiatanUrl = files.ImageDesc ? await uploadKegiatanImage(files.ImageDesc) : "";



  const collectionRef = collection(db, "Kegiatan");
  const data = {
    ...formData,
    ImageSampul: gambarSampulUrl,
    ImageDesc: gambarKegiatanUrl
  }
  try {
    const kegiatanSnapshot = await getDocs(collectionRef);
    let new_id = `kegiatan_1`;
    if(!kegiatanSnapshot.empty) {
      const maxId = kegiatanSnapshot.docs.reduce((max, doc) => {
        const idNumber = parseInt(doc.id, 10);
        return idNumber > max ? idNumber : max;
      }, 0);
      new_id = `kegiatan_${maxId + 1}`;
    }

    const validatedData = Validation.validate(createKegiatanSchema, data);

    const docRef = doc(collectionRef, String(new_id));
    const result = await setDoc(docRef, {
      Judul: validatedData.Judul,
      Deskripsi: validatedData.Deskripsi,
      ImageSampul: validatedData.ImageSampul,
      ImageDesc: validatedData.ImageDesc,
      isDelete: false,
      Tanggal: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    await updateDoc(docRef, { link: `/kegiatan/${docRef.id}` });
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
    Judul: data.Judul || '',
    Deskripsi: data.Deskripsi || '',
    ImageSampul: data.ImageSampul, // may be undefined or convert accordingly
    ImageDesc: data.ImageDesc,
    link: data.link || '',
    isDelete: data.isDelete ?? false,
    Tanggal: tanggalStr,
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateKegiatan(formData: any, files: { ImageSampul?: File, ImageDesc?: File }) {
  const gambarSampulUrl = files.ImageSampul ? await uploadKegiatanImage(files.ImageSampul) : formData.ImageSampul || "";
  const gambarKegiatanUrl = files.ImageDesc ? await uploadKegiatanImage(files.ImageDesc) : formData.ImageDesc || "";

  const docRef = doc(db, "Kegiatan", formData.id);
  const data = {
    ...formData,
    ImageSampul: gambarSampulUrl,
    ImageDesc: gambarKegiatanUrl
  }
  try {
    const validatedData = Validation.validate(updateKegiatanSchema, data);
    
    const result = await updateDoc(docRef, {
      Judul: validatedData.Judul,
      Deskripsi: validatedData.Deskripsi,
      ImageSampul: validatedData.ImageSampul,
      ImageDesc: validatedData.ImageDesc,
      updatedAt: Timestamp.now()
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
      item.Tanggal?.includes(lowerSearch)
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