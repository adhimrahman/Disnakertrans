import { z } from "zod";

export const createAduanSchema = z.object({
  nama_depan: z.string().min(3, "Nama depan harus diisi dengan jelas").max(15, "Nama depan maksimal 15 karakter"),
  nama_belakang: z.string().min(3, "Nama belakang harus diisi dengan jelas").max(15, "Nama belakang maksimal 1000 karakter"),
  email: z.string().email("Email yang diisi tidak valid"),
  pesan: z.string().min(5, "Pesan harus diisi dengan diisi"),
  no_telp: z.number().min(12, "Nomor Handphone tidak valid").max(14, "Nomor Handphone tidak valid"),
});

export const getAduanSchema = z.string().min(1, "ID aduan tidak valid");

export type createAduanFormData = z.infer<typeof createAduanSchema>;