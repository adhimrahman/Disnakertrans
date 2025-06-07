import { z } from "zod";

export const createKegiatanSchema = z.object({
  judul: z.string().nonempty("Judul harus diisi").min(3, "Judul harus jelas").max(30, "Judul maksimal 30 karakter"),
  deskripsi: z.string().nonempty("Deskripsi harus diisi").min(3, "Deskripsi harus jelas").max(1000, "Deskripsi maksimal 1000 karakter"),
  tanggal_kegiatan: z.string().date("Tanggal Kegiatan harus diisi"),
  gambar_sampul: z.string().url("Gambar Sampul harus diisi"),
  gambar_kegiatan: z.string().url().array().nonempty("Minimal pilih 1 gambar").max(5, "Maksimal 5 gambar"),
});

export const getKegiatanSchema = z.string().min(1, "ID Kegiatan tidak valid");

export const updateKegiatanSchema = z.object({
  id: z.string().min(1, "ID Kegiatan tidak valid"),
  judul: z.string().min(3, "Judul harus diisi dan jelas").max(30, "Judul maksimal 30 karakter").optional(),
  deskripsi: z.string().min(3, "Deskripsi harus diisi dan jelas").max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  tanggal_kegiatan: z.string().date("Tanggal Kegiatan harus diisi").optional(),
  gambar_sampul: z.string().url("Gambar Sampul harus diisi").optional(),
  gambar_kegiatan: z.string().array().optional(),
  link: z.string().url("Link harus diisi").optional(),
});


export type createKegiatanFormData = z.infer<typeof createKegiatanSchema>;
export type updateKegiatanFormData = z.infer<typeof updateKegiatanSchema>;

