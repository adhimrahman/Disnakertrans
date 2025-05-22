// import { Timestamp } from "firebase/firestore";

export interface Lowongan {
  alamat: string;
  batas_lowongan: string;
  deskripsi: string;
  gambar_sampul: string;
  judul: string;
  link_konten: string;
  link_lowongan: string;
  nama_lowongan: string;
  perusahaan: string;
  range_gaji: {
    min?: number;
    max?: number;
  };
  syarat: string[];
  tanggal_unggah?: string;
  tipe: string[];
  is_delete: boolean;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LowonganItem {
  id: string;
  nama_lowongan: string;
  perusahaan: string;
  batas_lowongan: string;
  link_konten: string;
  link_lowongan: string;
  tanggal_unggah: string;
  tipe: string[];
  is_delete: boolean;
}