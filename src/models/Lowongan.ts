// import { Timestamp } from "firebase/firestore";

export interface Lowongan {
  Judul: string;
  tanggal_unggah?: string;
  link_konten: string;
  isDelete: boolean;
  nama_lowongan: string;
  Syarat: string[];
  Range: {
    min?: number;
    max?: number;
  };
  ImageSampul: string;
  Deskripsi: string;
  BatasLowongan: string;
  Alamat: string;
  LinkLowongan: string;
  Perusahaan: string;
  Tipe: string[];
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LowonganItem {
  id: string;
  nama_lowongan: string;
  Perusahaan: string;
  BatasLowongan: string;
  link_konten: string;
  LinkLowongan: string;
  tanggal_unggah: string;
  Tipe: string[];
  isDelete: boolean;
}