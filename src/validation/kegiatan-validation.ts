import { z } from "zod";

export const createKegiatanSchema = z.object({
	judul: z.string().min(3, "Judul harus diisi dengan jelas").max(30, "Judul maksimal 30 karakter"),
	deskripsi: z.string().min(3, "Deskripsi harus diisi dengan jelas").max(1000, "Deskripsi maksimal 1000 karakter"),
	tanggal_kegiatan: z.string().min(1, "Tanggal Kegiatan harus diisi").refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
		message: "Format tanggal tidak valid (YYYY-MM-DD)",
	}),
	gambar_sampul: z.string().url("Gambar Sampul harus diisi"),
	gambar_kegiatan: z.string().url("Gambar Kegiatan harus diisi"),
});

export const getKegiatanSchema = z.string().min(1, "ID Kegiatan tidak valid");

export const updateKegiatanSchema = z.object({
	id: z.string().min(1, "ID Kegiatan tidak valid"),
	judul: z.string().min(3, "Judul harus diisi dengan jelas").max(30, "Judul maksimal 30 karakter").optional(),
	deskripsi: z.string().min(3, "Deskripsi harus diisi dengan jelas").max(1000, "Deskripsi maksimal 1000 karakter").optional(),
	tanggal_kegiatan: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
		message: "Format tanggal tidak valid (YYYY-MM-DD)",
	}).optional(),
	gambar_sampul: z.string().url("Gambar Sampul harus diisi").optional(),
	gambar_kegiatan: z.string().url("Gambar Kegiatan harus diisi").optional(),
	link: z.string().url("Link harus diisi").optional(),
});

export type createKegiatanFormData = z.infer<typeof createKegiatanSchema>;
export type updateKegiatanFormData = z.infer<typeof updateKegiatanSchema>;