import { Timestamp } from "firebase/firestore";

export interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_sampul?: File;
  gambar_kegiatan?: File;
  link: string;
  is_delete: boolean;
  Tanggal?: Timestamp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Membolehkan akses key lain dengan tipe string
}

export interface KegiatanItem {
  id: string;
  Judul: string;
  Tanggal?: string;
  ImageSampul?: File | string;
  Deskripsi: string;
  ImageDesc?: File | string;
  link: string;
  isDelete: boolean;
}