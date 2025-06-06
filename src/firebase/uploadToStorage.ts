import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";

export async function uploadKegiatanImage(file: File): Promise<string> {
  const uniqueFileName = `${uuidv4()}_${file.name}`;
  const fileRef = ref(storage, `kegiatan/${uniqueFileName}`);

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