import { z } from "zod";

export const createLowonganSchema = z.object({
  judul: z.string().nonempty("Judul harus diisi").min(3, "Judul harus jelas").max(50, "Judul maksimal 50 karakter"),
  nama_lowongan: z.string().nonempty("Nama lowongan harus diisi").min(3, "Nama lowongan harus jelas").max(50, "Nama lowongan maksimal 50 karakter"),
  deskripsi: z.string().nonempty("Deskripsi lowongan harus diisi").min(3, "Deskripsi lowongan harus jelas").max(1000, "Deskripsi lowongan maksimal 1000 karakter"),
  tenggat_lowongan: z.string().date("Batas lowongan harus diisi"),
  alamat: z.string().nonempty("Alamat Perusahaan harus diisi").min(3, "Alamat Perusahaan harus jelas").max(100, "Alamat perusahaan maksimal 100 karakter"),
  perusahaan: z.string().nonempty("Nama perusahaan harus diisi").min(3, "Nama perusahaan harus jelas").max(20, "Nama perusahaan maksimal 20 karakter"),
  link_lowongan: z.string().url("Link lowongan harus diisi"),
  gambar_sampul: z.string().url("Gambar sampul harus diisi"),
  max_gaji: z.number().gte(5, "Minimal gaji 5 figur"),
  min_gaji: z.number().gte(5, "Minimal gaji 5 figur"),
  tipe: z.array(z.string()).nonempty("Minimal pilih 1 tipe pekerjaan"),
  syarat: z.array(z.string()).optional(),
});

export const getLowonganSchema = z.string().min(1, "ID Kegiatan tidak valid");

export const updateLowonganSchema = z.object({
  id: z.string().min(1, "ID Lowongan tidak valid"),
  judul: z.string().min(3, "Judul konten lowongan harus jelas").max(50, "Judul konten maksimal 50 karakter").optional(),
  nama_lowongan: z.string().min(3, "Nama lowongan harus jelas").max(50, "Nama lowongan maksimal 50 karakter").optional(),
  deskripsi: z.string().min(3, "Deskripsi lowongan harus jelas").max(1000, "Deskripsi lowongan maksimal 30 karakter").optional(),
  tenggat_lowongan: z.string().date("Batas lowongan harus jelas").optional(),
  alamat: z.string().min(3, "Alamat Perusahaan harus jelas").max(100, "Alamat maksimal 100 karakter").optional(),
  perusahaan: z.string().min(3, "Nama Perusahaan harus jelas").max(30, "Perusahaan maksimal 30 karakter").optional(),
  link_lowongan: z.string().url("Link Lowongan harus diisi").optional(),
  gambar_sampul: z.string().url("Gambar sampul konten harus diisi").optional(),
  max_gaji: z.coerce.number().gte(100000, "Minimal gaji 5 figur").optional(),
  min_gaji: z.coerce.number().gte(100000, "Minimal gaji 5 figur").optional(),
  tipe: z.array(z.string(), { required_error: "Minimal pilih 1 tipe pekerjaan" }).optional(),
  syarat: z.array(z.string()).optional(),
  link_konten: z.string().url("Link konten harus diisi").optional(),
});


export type createLowonganFormData = z.infer<typeof createLowonganSchema>;
export type updateLowonganFormData = z.infer<typeof updateLowonganSchema>;

