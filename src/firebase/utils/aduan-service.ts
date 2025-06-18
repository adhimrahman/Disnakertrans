import { createAduanFormData, createAduanSchema, getAduanSchema } from "@/validation/aduan-validation";
import { db } from "../config";
import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query,
  Timestamp, updateDoc
} from "firebase/firestore";
import { Validation } from "@/validation/validation";
import { Aduan, AduanItem } from "@/models/Aduan";

export async function addAduan(formData: createAduanFormData) {
  const collectionRef = collection(db, "aduan");
  
  try {
    const validateData = Validation.validate(createAduanSchema, formData);
    const result = await addDoc(collectionRef, {
      nama_depan: validateData.nama_depan,
      nama_belakang: validateData.nama_belakang,
      email: validateData.email,
      pesan: validateData.pesan,
      no_telp: validateData.no_telp,
      is_done: false,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });

    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  };
};

export async function getAduan(): Promise<Partial<AduanItem[]>> {
  const collectionRef = collection(db, "aduan");
  const aduanCollectionSnapshot = await getDocs(collectionRef);

  const aduanList = aduanCollectionSnapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.created_at;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_depan: data.nama_depan ?? '',
      nama_belakang: data.nama_belakang ?? '',
      email: data.email ?? '',
      created_at: tanggalStr ?? '',
      no_telp: data.no_telp ?? '',
      is_done: data.is_done ?? false,
      is_deleted: data.is_deleted ?? true
    };
  });

  return aduanList;
};

export async function getAduanById (id: string): Promise<Aduan | null> {
  const docRef = doc(db, "aduan", id);
  const aduanSnapshot = await getDoc(docRef);
  if (!aduanSnapshot.exists()) return null;

  const data = aduanSnapshot.data();
  const tanggal = data.created_at
  const tanggalStr = tanggal?.toDate()?.toISOString().substring(0, 10) ?? '';

  return {
    id: aduanSnapshot.id,
    nama_depan: data.nama_depan ?? '',
    nama_belakang: data.nama_belakang ?? '',
    email: data.email ?? '',
    no_telp: data.no_telp ?? '',
    is_done: data.is_done ?? false,
    created_at: tanggalStr
  };
};

export async function updateAduan(id: string) {
  const validateId = Validation.validate(getAduanSchema, id);
  const docRef = doc(db, "aduan", validateId);
  await updateDoc(docRef, { is_done: true });
};

export async function getAduanBySort(
  sortField: keyof AduanItem = "created_at",
  sortOrder: "asc" | "desc" = "asc"
): Promise<AduanItem[]> { 
  const collectionRef = collection(db, "aduan");

  const q = query(collectionRef, orderBy(sortField as string, sortOrder));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const tanggal = data.created_at;
    const tanggalStr = tanggal?.toDate() ? tanggal.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) : null;

    return {
      id: doc.id,
      nama_depan: doc.data().nama_depan ?? '',
      nama_belakang: doc.data().nama_belakang ?? '',
      email: doc.data().email ?? '',
      no_telp: doc.data().no_telp ?? '',
      is_done: doc.data().is_done ?? false,
      created_at: tanggalStr
    }
  });
};

export async function getAduanFilteredByNames(
  search: string,
  sortField: keyof AduanItem = "created_at",
  sortOrder: "asc" | "desc" = "asc"
): Promise<AduanItem[]> { 
  const allData = await getAduanBySort(sortField, sortOrder);
  if (!search.trim()) return allData;
  
  const lowerSearch = search.toLowerCase();
  const filtered = allData.filter((item) => {
    return (
      item?.nama_depan.toLowerCase().includes(lowerSearch) ||
      item?.nama_belakang.toLowerCase().includes(lowerSearch) ||
      item?.email.toLowerCase().includes(lowerSearch)
    );
  });

  return filtered;
};

// export async function fetchAduanPage (pageNumber: number, pageSize: number) {
//   const pageCursors: QueryDocumentSnapshot[] = [];
//   const collectionRef = collection(db, "aduan");
//   let q = query(collectionRef, where("is_done", "==", false), orderBy("created_at"));

//   if (pageNumber === 1) {
//     q = query(q, limit(pageSize));
//   } else {
//     // Use the cursor of previous page to start after
//     const cursor = pageCursors[pageNumber - 2]; // zero-based index
//     if (!cursor) throw new Error("Cursor for page not found");
//     q = query(q, startAfter(cursor), limit(pageSize));
//   };

//   const snapshot = await getDocs(q);
//   pageCursors[pageNumber - 1] = snapshot.docs[0];

//   return snapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       nama_depan: data.nama_depan ?? '',
//       nama_belakang: data.nama_belakang ?? '',
//       email: data.email ?? '',
//       no_telp: data.no_telp ?? '',
//       is_done: data.is_done ?? false,
//     };
//   });
// }