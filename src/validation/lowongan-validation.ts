import { z } from "zod";

export const createLowonganSchema = z.object({
  Judul: z.string().min(3, "Judul harus diisi").max(30, "Judul maksimal 30 karakter"),
  nama_lowongan: z.string().min(3, "Nama lowongan harus diisi").max(30, "Nama lowongan maksimal 1000 karakter"),
  Deskripsi: z.string().min(3, "Deskripsi lowongan harus diisi").max(1000, "Deskripsi lowongan maksimal 1000 karakter"),
  BatasLowongan: z.string().date("Batas lowongan harus diisi"),
  Alamat: z.string().min(3, "Alamat Perusahaan harus diisi").max(100, "Alamat perusahaan maksimal 100 karakter"),
  Perusahaan: z.string().min(3, "Nama perusahaan harus diisi").max(20, "Nama perusahaan maksimal 20 karakter"),
  LinkLowongan: z.string().url("Link lowongan harus diisi"),
  ImageSampul: z.string().url("Gambar sampul harus diisi"),
  Range: z.object({ max: z.string().min(1, "Gaji min harus diisi"), min: z.string().min(1, "Gaji max harus diisi") }),
  Tipe: z.array(z.string()).nonempty("Minimal pilih 1 tipe pekerjaan"),
  Syarat: z.array(z.string()).optional(),
});

export const getLowonganSchema = z.string().min(1, "ID Kegiatan tidak valid");

export const updateLowonganSchema = z.object({
  id: z.string().min(1, "ID Lowongan tidak valid"),
  Judul: z.string().min(3, "Judul konten lowongan harus diisi").max(30, "Judul konten maksimal 30 karakter").optional(),
  nama_lowongan: z.string().min(3, "Nama lowongan harus diisi").max(30, "Nama lowongan maksimal 30 karakter").optional(),
  Deskripsi: z.string().min(3, "Deskripsi lowongan harus diisi").max(1000, "Deskripsi lowongan maksimal 30 karakter").optional(),
  BatasLowongan: z.string().date("Batas lowongan harus diisi").optional(),
  Alamat: z.string().min(3, "Alamat Perusahaan harus diisi").max(100, "Alamat maksimal 100 karakter").optional(),
  Perusahaan: z.string().min(3, "Nama Perusahaan harus diisi").max(30, "Perusahaan maksimal 30 karakter").optional(),
  LinkLowongan: z.string().url("Link Lowongan harus diisi").optional(),
  ImageSampul: z.string().url("Gambar sampul konten harus diisi").optional(),
  Range: z.object({ max: z.number().min(1, "Gaji min harus diisi"), min: z.number().min(1, "Gaji max harus diisi") }).optional(),
  Tipe: z.array(z.string(), { required_error: "Minimal pilih 1 tipe pekerjaan" }).optional(),
  Syarat: z.array(z.string()).optional(),
  link_konten: z.string().url("Link konten harus diisi").optional(),
});


export type createLowonganFormData = z.infer<typeof createLowonganSchema>;
export type updateLowonganFormData = z.infer<typeof updateLowonganSchema>;

