import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";

export async function uploadKegiatanImage(file: File | File[]): Promise<string | string[]> {
  if (Array.isArray(file)) {
    const urls: string[] = [];

    for (const singleFile of file) {
      const uniqueFileName = `${uuidv4()}_${singleFile.name}`;
      const fileRef = ref(storage, `kegiatan/${uniqueFileName}`);
      await uploadBytes(fileRef, singleFile);
      const downloadUrl = await getDownloadURL(fileRef);
      urls.push(downloadUrl);
    }
    return urls;
    
  } else {
    const uniqueFileName = `${uuidv4()}_${file.name}`;
    const fileRef = ref(storage, `kegiatan/${uniqueFileName}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }
}

export async function uploadLowonganImage(file: File): Promise<string> {
  const uniqueFileName = `${uuidv4()}_${file.name}`;
  const fileRef = ref(storage, `lowongan/${uniqueFileName}`);
  try {
    // Upload file ke Firebase Storage
    await uploadBytes(fileRef, file);

    // Dapatkan URL download agar bisa diakses publik
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error;
  }
}

export async function uploadPelatihanImage(file: File): Promise<string> {
  const uniqueFileName = `${uuidv4()}_${file.name}`;
  const fileRef = ref(storage, `pelatihan/${uniqueFileName}`);
  try {
    // Upload file ke Firebase Storage
    await uploadBytes(fileRef, file);

    // Dapatkan URL download agar bisa diakses publik
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error;
  }
};