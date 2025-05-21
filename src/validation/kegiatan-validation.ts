import { z } from "zod";

export const createKegiatanSchema = z.object({
  Judul: z.string().min(3, "Judul harus diisi").max(30, "Judul maksimal 30 karakter"),
  Deskripsi: z.string().min(3, "Deskripsi harus diisi").max(1000, "Deskripsi maksimal 1000 karakter"),
  ImageSampul: z.string().url("Gambar Sampul harus diisi"),
  ImageDesc: z.string().url("Gambar Kegiatan harus diisi"),
});

export const getKegiatanSchema = z.string().min(1, "ID Kegiatan tidak valid");

export const updateKegiatanSchema = z.object({
  id: z.string().min(1, "ID Kegiatan tidak valid"),
  Judul: z.string().min(3, "Judul harus diisi").max(30, "Judul maksimal 30 karakter").optional(),
  Deskripsi: z.string().min(3, "Deskripsi harus diisi").max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  ImageSampul: z.string().url("Gambar Sampul harus diisi").optional(),
  ImageDesc: z.string().url("Gambar Kegiatan harus diisi").optional(),
  link: z.string().url("Link harus diisi").optional(),
});


export type createKegiatanFormData = z.infer<typeof createKegiatanSchema>;
export type updateKegiatanFormData = z.infer<typeof updateKegiatanSchema>;

