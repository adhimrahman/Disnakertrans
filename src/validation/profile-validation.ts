import { z } from "zod";

export const updateProfileSchema = z.object({
	id: z.string().min(1, "ID Profile tidak valid"),
	nama_lengkap: z.string().min(3, "Nama Lengkap harus diisi dengan jelas").max(50, "Nama Lengkap maksimal 50 karakter"),
	gambar: z.string().url("Gambar harus diisi"),
	awal_jabat: z.string().date("Awal Jabatan harus diisi"),
	akhir_jabat: z.string().date("Akhir Jabatan harus diisi"),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;