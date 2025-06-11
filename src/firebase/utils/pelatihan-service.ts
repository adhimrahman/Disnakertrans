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
import { PelatihanItem } from "@/lib/getPelatihan";



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
  files: { gambar_sampul?: File }
) {
  const gambarSampulUrl = files.gambar_sampul ? await uploadPelatihanImage(files.gambar_sampul) : "";

  const collectionRef = collection(db, "akun", lpkId, "pelatihan");
  const data = {
    ...formData,
    gambar_sampul: gambarSampulUrl,
  };

  try {
    const validatedData = Validation.validate(createPelatihanSchema, data);
    const tanggalPelatihan = typeof validatedData.tanggal_pelatihan === 'string'
      ? new Date(validatedData.tanggal_pelatihan)
      : validatedData.tanggal_pelatihan;

    const result = await addDoc(collectionRef, {
      judul: validatedData.judul,
      deskripsi: validatedData.deskripsi,
      gambar_sampul: validatedData.gambar_sampul,
      tanggal_pelatihan: Timestamp.fromDate(tanggalPelatihan),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    const link = process.env.NEXT_PUBLIC_LINK_BASE;
    await updateDoc(doc(collectionRef, result.id), {
      link: `${link}/pelatihan/${result.id}`
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Get All Pelatihan
export async function getPelatihan(lpkId: string, p0: string, p1: { gambar_pelatihan: string; judul: string; deskripsi: string; tanggal_kegiatan: string; link_form: string; }): Promise<PelatihanItem[]> {
  const pelatihanRef = collection(db, "akun", lpkId, "pelatihan");
  const snapshot = await getDocs(pelatihanRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const created = data.created_at?.toDate();
    const tanggalStr = created
      ? created.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
      : null;

    return {
      id: doc.id,
      Judul: data.judul ?? '',
      Deskripsi: data.deskripsi ?? '',
      ImageSampul: data.gambar_sampul ?? '',
      link: data.link ?? '',
      created_at: tanggalStr,
    };
  });
}

// Get Pelatihan by ID
export async function getPelatihanById(lpkId: string, id: string) {
  const docRef = doc(db, "akun", lpkId, "pelatihan", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const created = data.created_at?.toDate();
  const tanggalPelatihan = data.tanggal_pelatihan?.toDate();

  return {
    id: snapshot.id,
    judul: data.judul ?? '',
    deskripsi: data.deskripsi ?? '',
    gambar_sampul: data.gambar_sampul,
    tanggal_pelatihan: tanggalPelatihan?.toISOString().substring(0, 10) ?? '',
    link: data.link ?? '',
    created_at: created?.toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric"
    }) ?? ''
  };
}

// Update Pelatihan
export async function updatePelatihan(
  lpkId: string,
  id: string,
  data: any
) {
  const docRef = doc(db, "akun", lpkId, "pelatihan", id);
  const gambarSampulUrl = data.gambar_sampul
    ? await uploadPelatihanImage(data.gambar_sampul)
    : data.gambar_sampul || "";

  try {
    const validatedData = Validation.validate(updatePelatihanSchema, {
      ...data,
      gambar_sampul: gambarSampulUrl,
    });
    const tanggalPelatihan = typeof validatedData.tanggal_pelatihan === 'string'
      ? new Date(validatedData.tanggal_pelatihan)
      : validatedData.tanggal_pelatihan;

    await updateDoc(docRef, {
      judul: validatedData.judul,
      deskripsi: validatedData.deskripsi,
      gambar_sampul: validatedData.gambar_sampul,
      tanggal_pelatihan: Timestamp.fromDate(tanggalPelatihan),
      updated_at: Timestamp.now()
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
  sort: keyof PelatihanItem = "Created",
  order: "asc" | "desc" = "asc"
): Promise<PelatihanItem[]> {
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
    q = query(pelatihanRef, orderBy(sort, order));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const created = data.created_at?.toDate();
    const tanggalStr = created
      ? created.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
      : null;

    return {
      id: doc.id,
      Judul: data.judul ?? '',
      Deskripsi: data.deskripsi ?? '',
      ImageSampul: data.gambar_sampul ?? '',
      link: data.link ?? '',
      created_at: tanggalStr,
    };
  });
}



