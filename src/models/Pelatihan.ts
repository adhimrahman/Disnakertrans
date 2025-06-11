export interface PelatihanItem {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_pelatihan: string;
  link_form: string;
  tanggal_kegiatan: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}
