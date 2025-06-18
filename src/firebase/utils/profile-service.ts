'use server'

import { Profile, updateProfile } from "@/models/Profile";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { uploadProfileImage } from "../uploadToStorage";
import { Validation } from "@/validation/validation";
import { updateProfileSchema } from "@/validation/profile-validation";

export async function getProfile(id: string): Promise<updateProfile | null> {
  const docRef = doc(db, "profile", id);
  const profileSnapshot = await getDoc(docRef);
  if (!profileSnapshot.exists()) return null;

  const data = profileSnapshot.data();
  const awal = data.awal_jabat;
  const awalJabatStr = awal?.toDate()?.toISOString().substring(0, 10) ?? '';

  const akhir = data.akhir_jabat;
  const akhirJabatStr = akhir?.toDate()?.toISOString().substring(0, 10) ?? '';

  return {
    id: profileSnapshot.id,
    gambar: data.gambar ?? '',
    awal_jabat: awalJabatStr ?? '',
    akhir_jabat: akhirJabatStr ?? '',
    nama_lengkap: data.nama_lengkap ?? '',
  };
};

export async function updateProfileData(formData: Partial<Profile>, files: { gambar?: File }) {
  const gambarUrl = files.gambar ? await uploadProfileImage(files.gambar) : formData.gambar || "";
  
  if (!formData.id) {
    throw new Error('Document ID is required'); // Ensure formData.id is present
  }

  const docRef = doc(db, "profile", formData.id);
  const data = {
    ...formData,
    gambar: gambarUrl,
  };

  try {
    const validateData = Validation.validate(updateProfileSchema, data);
    const awal_jabat = typeof validateData.awal_jabat === 'string'
      ? new Date(validateData.awal_jabat)
      : validateData.awal_jabat;
    
    const akhir_jabat = typeof validateData.akhir_jabat === 'string'
      ? new Date(validateData.akhir_jabat)
      : validateData.akhir_jabat;
    
    const result = await updateDoc(docRef, {
      gambar: validateData.gambar,
      awal_jabat: awal_jabat ? Timestamp.fromDate(awal_jabat) : undefined,
      akhir_jabat: akhir_jabat ? Timestamp.fromDate(akhir_jabat) : undefined,
      nama_lengkap: validateData.nama_lengkap,
    });

    console.log(result)
    return true;
  } catch (e) {
    console.log(e);
    return false;
  };
};