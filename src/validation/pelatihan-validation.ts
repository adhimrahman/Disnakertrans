//'pelatihan-validation.ts'

import { z } from "zod";

export const CreatePelatihanSchema = z.object({
  judul: z.string().min(5, "Judul harus diisi dan jelas").max(30, "Judul maksimal 30 karakter"),
  deskripsi: z.string().min(5, "Deskripsi harus diisi dan jelas").max(1000, "Deskripsi maksimal 1000 karakter"),
  gambar_pelatihan: z.string().url("Gambar harus berupa URL"),
  link_form: z.string().url("Link harus berupa URL"),
  tanggal_kegiatan: z.string().date("Tanggal Kegiatan harus diisi"),
});

export const GetPelatihanSchema = z.string().min(1, "ID Pelatihan tidak valid");

export const UpdatePelatihanSchema = z.object({
  id: z.string().min(1, "ID Pelatihan tidak valid"),
  judul: z.string().min(5, "Judul harus diisi dan jelas").max(30, "Judul maksimal 30 karakter").optional(),
  deskripsi: z.string().min(5, "Deskripsi harus diisi dan jelas").max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  gambar_pelatihan: z.string().url("Gambar harus berupa URL").optional(),
  link_form: z.string().url("Link harus berupa URL").optional(),
  tanggal_kegiatan: z.string().date("Tanggal Kegiatan harus diisi").optional(),
});

export type CreatePelatihan = z.infer<typeof CreatePelatihanSchema>;
export type UpdatePelatihan = z.infer<typeof UpdatePelatihanSchema>;