export interface Kegiatan {
  judul: string;
  deskripsi: string;
  gambar_sampul: string;
  gambar_kegiatan: string;
  link: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Membolehkan akses key lain dengan tipe string
}

export interface KegiatanItem {
  id: string;
  judul: string;
  created_at?: string;
  gambar_sampul?: File | string;
  deskripsi: string;
  gambar_kegiatan?: File | string;
  link: string;
}