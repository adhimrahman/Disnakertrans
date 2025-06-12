export interface Pelatihan {
  judul: string;
  deskripsi: string;
  gambar_pelatihan: string;
  link_form: string;
  tanggal_kegiatan?: string;
  [key: string]: any;
}

export interface PelatihanItem {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_pelatihan: string;
  link_form: string;
  tanggal_kegiatan: string; // hasil dari .toISOString()
  created_at: string;
  updated_at: string;
}