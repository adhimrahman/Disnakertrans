	import { z } from "zod";

	export const createAduanSchema = z.object({
		nama_depan: z.string().min(3, "Nama depan harus diisi dengan jelas").max(15, "Nama depan maksimal 15 karakter"),
		nama_belakang: z.string().min(3, "Nama belakang harus diisi dengan jelas").max(15, "Nama belakang maksimal 1000 karakter"),
		email: z.string().email("Email yang diisi tidak valid"),
		pesan: z.string().min(5, "Pesan harus diisi dengan diisi"),
		no_telp: z
			.string()
			.min(10, "Nomor HP minimal 10 angka")
			.max(14, "Nomor HP maksimal 14 angka")
			.regex(/^\d+$/, "Nomor HP hanya boleh berisi angka"),
	});

	export const getAduanSchema = z.string().min(1, "ID aduan tidak valid");

	export type createAduanFormData = z.infer<typeof createAduanSchema>;