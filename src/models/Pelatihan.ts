export type Pelatihan = {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_pelatihan: string;
  link_form: string;
  link_konten: string;
  tanggal_kegiatan: string;
  created_at: string;
  updated_at: string;
};

export type PelatihanItem = Omit<Pelatihan, "created_at" | "updated_at" | "gambar_pelatihan" | "deskripsi">;

