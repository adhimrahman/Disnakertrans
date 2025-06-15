import { z } from "zod";

export const createAduanSchema = z.object({
	nama_depan: z.string().nonempty("Nama depan harus diisi").min(3, "Nama depan harus jelas").max(30, "Nama depan maksimal 30 karakter"),
	nama_belakang: z.string().nonempty("Nama belakang harus diisi").min(3, "Nama belakang harus jelas").max(15, "Nama belakang maksimal 15 karakter"),
	email: z.string().nonempty("Email harus diisi").email("Harus valid email"),
	pesan: z.string().nonempty("Pesan harus diisi"),
	no_telp: z.string().min(10, "Nomor Telepon minimal 10 digit").max(15, "Nomor Telepon maksimal 15 digit"),
});

export const getAduanSchema = z.string().min(1, "ID aduan tidak valid");

export type createAduanFormData = z.infer<typeof createAduanSchema>;