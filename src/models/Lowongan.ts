// import { Timestamp } from "firebase/firestore";

export interface Lowongan {
  alamat: string;
  tenggat_lowongan: string;
  deskripsi: string;
  gambar_sampul: string;
  judul: string;
  link_konten: string;
  link_lowongan: string;
  nama_lowongan: string;
  perusahaan: string;
  range_gaji: {
    min?: string;
    max?: string;
  };
  syarat: string[];
  created_at?: string;
  tipe: string[];
  is_deleted: boolean;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LowonganItem {
  id: string;
  nama_lowongan: string;
  perusahaan: string;
  tenggat_lowongan: string;
  link_konten: string;
  link_lowongan: string;
  created_at: string;
  tipe: string[];
  is_deleted: boolean;
}