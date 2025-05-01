import { Timestamp } from "firebase/firestore";

export interface Kegiatan {
  Judul: string | null;
  Tanggal: Timestamp | null;
  link: string | null;
  isDelete: boolean;
  ImageDesc: string | null;
  ImageSampul: string;
  Deskripsi: string | null;
  
  // Index signature untuk menangani akses properti dinamis
  [key: string]: unknown; // Membolehkan akses key lain dengan tipe string
}