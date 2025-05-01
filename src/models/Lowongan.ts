import { Timestamp } from "firebase/firestore";

export interface Lowongan {
  Judul: string | null;
  tanggal_unggah: Timestamp | null;
  link_konten: string | null;
  isDelete: boolean;
  nama_lowongan: string | null;
  Syarat: string[];
  Range: {
    min: number;
    max: number;
  };
  ImageSampul: string;
  Deskripsi: string | null;
  BatasLowongan: Timestamp | null;
  Alamat: string | null;
  LinkLowongan: string | null;
  Perusahaan: string | null;
  Tipe: string[];
  
  // Index signature untuk menangani akses properti dinamis
  [key: string]: unknown; // Membolehkan akses key lain dengan tipe string
}