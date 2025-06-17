// 'pelatihan-service.ts'

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc} from "firebase/firestore";
import { CreatePelatihan, CreatePelatihanSchema, GetPelatihanSchema, UpdatePelatihan, UpdatePelatihanSchema } from "@/validation/pelatihan-validation";
import { uploadPelatihanImage } from "../uploadToStorage";
import { db } from "../config";
import { Validation } from "@/validation/validation";
import { Pelatihan, PelatihanItem } from "@/models/Pelatihan";

export async function addPelatihan(lpkId: string, formData: CreatePelatihan, files: { gambar_pelatihan?: File }) {
  const gambarPelatihanUrl = files.gambar_pelatihan ? await uploadPelatihanImage(files.gambar_pelatihan) : "";
  const collectionRef = (collection(db, "lpk", lpkId, "pelatihan")); ;

  const data = {
    ...formData,
    gambar_pelatihan: gambarPelatihanUrl
  };

  try {
    const validateData = Validation.validate(CreatePelatihanSchema, data);
    const tanggal = typeof validateData.tanggal_kegiatan === 'string'
      ? new Date(validateData.tanggal_kegiatan)
      : validateData.tanggal_kegiatan;
    
    const result = await addDoc(collectionRef, {
      judul: validateData.judul,
      deskripsi: validateData.deskripsi,
      gambar_pelatihan: validateData.gambar_pelatihan,
      tanggal_kegiatan: Timestamp.fromDate(tanggal),
      link_form: validateData.link_form,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    const link = process.env.NEXT_PUBLIC_LINK_BASE;
    const docRef = doc(db, "lpk", lpkId, "pelatihan", result.id);

    await updateDoc(docRef, { link_konten: `${link}/pelatihan/${docRef.id}` });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  };
};

export async function getPelatihanBySort(
  lpkId: string,
  sortField: keyof PelatihanItem = "tanggal_kegiatan",
  sortOrder: "asc" | "desc" = "asc"
): Promise<PelatihanItem[]> { 
  const collectionRef = collection(db, "lpk", lpkId, "pelatihan");
  const q = query(collectionRef, orderBy(sortField as string, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.tanggal_kegiatan;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;
    
    return {
      id: doc.id,
      judul: data.judul ?? '',
      deskripsi: data.deskripsi ?? '',
      gambar_pelatihan: data.gambar_pelatihan ?? '',
      tanggal_kegiatan: tanggalStr,
      link_form: data.link_form ?? '',
      link_konten: data.link_konten ?? '',
    };
  });
};

export async function getPelatihanFiltered(
  lpkId: string,
  search: string,
  sortField: keyof PelatihanItem = "tanggal_kegiatan",
  sortOrder: "asc" | "desc" = "asc"
): Promise<PelatihanItem[]> {
  const allData = await getPelatihanBySort(lpkId, sortField, sortOrder);
  if (!search.trim()) return allData;

  const lowerSearch = search.toLowerCase();
  const filtered = allData.filter((item) => {
    return (
      item.judul.toLowerCase().includes(lowerSearch) ||
      item.tanggal_kegiatan?.toLowerCase().includes(lowerSearch)
    );
  }); 

  return filtered;
};

export async function getPelatihanById(lpkId: string, pelatihanId: string): Promise<Partial<Pelatihan> | null> {
  const docRef = doc(db, "lpk", lpkId, "pelatihan", pelatihanId);
  const pelatihanSnapshot = await getDoc(docRef);
  if (!pelatihanSnapshot.exists()) return null;
  
  const data = pelatihanSnapshot.data();
  const tanggal = data.tanggal_kegiatan;
  const tanggalStr = tanggal?.toDate()?.toISOString().substring(0, 10) ?? '';
  
  return {
    id: pelatihanSnapshot.id,
    judul: data.judul ?? '',
    deskripsi: data.deskripsi ?? '',
    gambar_pelatihan: data.gambar_pelatihan ?? '',
    tanggal_kegiatan: tanggalStr,
    link_form: data.link_form ?? '',
  };
};

export async function updatePelatihan(lpkId: string, formData: UpdatePelatihan, files: { gambar_pelatihan?: File }) {
  const gambarPelatihanUrl = files.gambar_pelatihan ? await uploadPelatihanImage(files.gambar_pelatihan) : formData.gambar_pelatihan || "";
  const docRef = doc(db, "lpk", lpkId, "pelatihan", formData.id);
  const data = {
    ...formData,
    gambar_pelatihan: gambarPelatihanUrl
  };

  try {
    const validateData = Validation.validate(UpdatePelatihanSchema, data);
    const tanggal = typeof validateData.tanggal_kegiatan === 'string'
      ? new Date(validateData.tanggal_kegiatan)
      : validateData.tanggal_kegiatan;
    
    const result = await updateDoc(docRef, {
      judul: validateData.judul,
      deskripsi: validateData.deskripsi,
      gambar_pelatihan: validateData.gambar_pelatihan,
      tanggal_kegiatan: tanggal ? Timestamp.fromDate(tanggal) : undefined,
      link_form: validateData.link_form,
      updated_at: Timestamp.now()
    });

    console.log(result);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  };
};

export async function deletePelatihan(lpkId: string, pelatihan_id: string) {
  const validateId = Validation.validate(GetPelatihanSchema, pelatihan_id);
  const docRef = doc(db, "lpk", lpkId, "pelatihan", validateId);
  await deleteDoc(docRef);
};