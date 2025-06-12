'use server'

import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  Timestamp, query, orderBy, where
} from "firebase/firestore";
import { db } from "../config";
import { Validation } from "@/validation/validation";
import {
  createPelatihanSchema,
  updatePelatihanSchema,
  getPelatihanSchema,
  createPelatihanFormData
} from "@/validation/pelatihan-validation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PelatihanItem } from "@/models/Pelatihan";

// Upload image ke storage
export async function uploadPelatihanImage(file: File): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, `pelatihan-images/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Add Pelatihan
export async function addPelatihan(
  lpkId: string,
  formData: createPelatihanFormData,
  files: { gambar_pelatihan?: File }
) {
  const gambarPelatihanUrl = files.gambar_pelatihan ? await uploadPelatihanImage(files.gambar_pelatihan) : "";

  const collectionRef = collection(db, "akun", lpkId, "pelatihan");
  const data = { ...formData, gambar_pelatihan: gambarPelatihanUrl };

  try {
    const validatedData = Validation.validate(createPelatihanSchema, data);
    const tanggalPelatihan = typeof validatedData.tanggal_kegiatan === 'string'
      ? new Date(validatedData.tanggal_kegiatan)
      : validatedData.tanggal_kegiatan;

    await addDoc(collectionRef, {
      judul: validatedData.judul,
      deskripsi: validatedData.deskripsi,
      gambar_pelatihan: validatedData.gambar_pelatihan,
      tanggal_pelatihan: Timestamp.fromDate(tanggalPelatihan),
      link_form: validatedData.link_form ?? "",
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Get All Pelatihan
export async function getPelatihan(lpkId: string): Promise<PelatihanItem[]> {
  const pelatihanRef = collection(db, "akun", lpkId, "pelatihan");
  const snapshot = await getDocs(pelatihanRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      judul: data.judul ?? '',
      deskripsi: data.deskripsi ?? '',
      gambar_pelatihan: data.gambar_pelatihan ?? '',
      link_form: data.link_form ?? '',
      tanggal_kegiatan: data.tanggal_pelatihan?.toDate().toISOString() ?? '',
      created_at: data.created_at?.toDate().toISOString() ?? '',
      updated_at: data.updated_at?.toDate().toISOString() ?? '',
    };
  });
}

// Get Pelatihan by ID
export async function getPelatihanById(lpkId: string, id: string): Promise<PelatihanItem | null> {
  const docRef = doc(db, "akun", lpkId, "pelatihan", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    judul: data.judul ?? '',
    deskripsi: data.deskripsi ?? '',
    gambar_pelatihan: data.gambar_pelatihan ?? '',
    link_form: data.link_form ?? '',
    tanggal_kegiatan: data.tanggal_pelatihan?.toDate().toISOString() ?? '',
    created_at: data.created_at?.toDate().toISOString() ?? '',
    updated_at: data.updated_at?.toDate().toISOString() ?? '',
  };
}

// Update Pelatihan
export async function updatePelatihan(
  lpkId: string,
  id: string,
  data: any
) {
  const docRef = doc(db, "akun", lpkId, "pelatihan", id);
  const gambarPelatihanUrl = data.gambar_pelatihan
    ? await uploadPelatihanImage(data.gambar_pelatihan)
    : data.gambar_pelatihan || "";

  try {
    const validatedData = Validation.validate(updatePelatihanSchema, {
      ...data,
      gambar_pelatihan: gambarPelatihanUrl,
    });

    const tanggalPelatihan = typeof validatedData.tanggal_kegiatan === 'string'
      ? new Date(validatedData.tanggal_kegiatan)
      : validatedData.tanggal_kegiatan;

    await updateDoc(docRef, {
      judul: validatedData.judul,
      deskripsi: validatedData.deskripsi,
      gambar_pelatihan: validatedData.gambar_pelatihan,
      tanggal_pelatihan: Timestamp.fromDate(tanggalPelatihan),
      link_form: validatedData.link_form ?? "",
      updated_at: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Delete Pelatihan
export async function deletePelatihanById(lpkId: string, pelatihanId: string) {
  const validatedId = Validation.validate(getPelatihanSchema, pelatihanId);
  const docRef = doc(db, "akun", lpkId, "pelatihan", validatedId);
  await deleteDoc(docRef);
}

// Filtered search
export async function getPelatihanFilteredByJudulContains(
  lpkId: string,
  search: string,
  sort: keyof PelatihanItem = "created_at",
  order: "asc" | "desc" = "asc"
): Promise<PelatihanItem[]> {
  // Handle jika lpkId undefined/null/kosong
  if (!lpkId || typeof lpkId !== 'string' || lpkId.trim() === '') {
    // Bisa return [] agar tidak error, atau throw error custom
    return [];
  }
  const pelatihanRef = collection(db, "akun", lpkId, "pelatihan");

  let q;

  if (search.trim()) {
    q = query(
      pelatihanRef,
      where("judul", ">=", search),
      where("judul", "<=", search + "\uf8ff"),
      orderBy("judul", order)
    );
  } else {
    if (sort === 'judul' || sort === 'created_at') {
      q = query(pelatihanRef, orderBy(sort, order));
  }else{
    q = query(pelatihanRef);
  }
  } 
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      judul: data.judul ?? '',
      deskripsi: data.deskripsi ?? '',
      gambar_pelatihan: data.gambar_pelatihan ?? '',
      link_form: data.link_form ?? '',
      tanggal_kegiatan: data.tanggal_pelatihan?.toDate().toISOString() ?? '',
      created_at: data.created_at?.toDate().toISOString() ?? '',
      updated_at: data.updated_at?.toDate().toISOString() ?? '',
    };
  });
}
