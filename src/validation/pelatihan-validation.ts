import { z } from "zod";

// CREATE
export const createPelatihanSchema = z.object({
  judul: z.string()
    .nonempty("Judul wajib diisi")
    .min(3, "Judul harus memiliki minimal 3 karakter")
    .max(30, "Judul maksimal 30 karakter"),
    
  deskripsi: z.string()
    .nonempty("Deskripsi wajib diisi")
    .min(3, "Deskripsi harus memiliki minimal 3 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),

  tanggal_pelatihan: z.string()
    .nonempty("Tanggal Pelatihan wajib diisi")
    .refine(val => !isNaN(Date.parse(val)), { message: "Tanggal Pelatihan tidak valid" }),

  gambar_sampul: z.string()
    .url("Gambar Sampul harus berupa URL")
    .optional(),

  link: z.string()
    .url("Link harus berupa URL")
    .optional(),
});

export type createPelatihanFormData = z.infer<typeof createPelatihanSchema>;

// GET
export const getPelatihanSchema = z.string()
  .min(1, "ID Pelatihan tidak valid");

// UPDATE
export const updatePelatihanSchema = z.object({
  id: z.string().min(1, "ID Pelatihan wajib diisi"),

  judul: z.string()
    .min(3, "Judul minimal 3 karakter")
    .max(30, "Judul maksimal 30 karakter")
    .optional(),

  deskripsi: z.string()
    .min(3, "Deskripsi minimal 3 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional(),

  tanggal_pelatihan: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Tanggal Pelatihan tidak valid" })
    .optional(),

  gambar_sampul: z.string()
    .url("Gambar Sampul harus berupa URL")
    .optional(),

  link: z.string()
    .url("Link harus berupa URL")
    .optional(),
});

export type updatePelatihanFormData = z.infer<typeof updatePelatihanSchema>;
