import { z } from "zod";

export const CreatePesertaSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap harus diisi dan jelas").max(20, "Nama lengkap maksimal 50 karakter"),
  tanggal_lahir: z.string().date("Tanggal lahir harus diisi"),
  alamat: z.string().min(3, "Alamat harus diisi dan jelas").max(100, "Alamat maksimal 100 karakter"),
  email: z.string().email("Harus valid email"),
  no_telp: z.coerce.number().gte(6281000000000, "Nomor Handphone harus jelas").lte(628999999999999, "Nomor Handphone maksimal 13 nomor"),
  tanggal_daftar: z.string().date("Tanggal daftar harus diisi"),
  lpk: z.number().positive(),
  jenis_kelamin: z.boolean().default(false),
  is_deleted: z.boolean().default(false),
  lulus: z.boolean().default(false),
});

export const GetPesertaSchema = z.string().min(1, "ID Peserta tidak valid");

export const UpdatePesertaSchema = z.object({
  id: z.string().min(1, "ID Peserta tidak valid"),
  nama_lengkap: z.string().min(3, "Nama lengkap harus diisi dan jelas").max(20, "Nama lengkap maksimal 50 karakter").optional(),
  tanggal_lahir: z.string().date("Tanggal lahir harus diisi").optional(),
  alamat: z.string().min(3, "Alamat harus diisi dan jelas").max(100, "Alamat maksimal 100 karakter").optional(),
  email: z.string().email("Harus valid email").optional(),
  no_telp: z.coerce.number().gte(6281000000000, "Nomor Handphone harus jelas").lte(628999999999999, "Nomor Handphone maksimal 13 nomor").optional(),
  tanggal_daftar: z.string().date("Tanggal daftar harus diisi").optional(),
  lpk: z.number().positive().optional(),
  jenis_kelamin: z.boolean().default(false).optional(),
  is_deleted: z.boolean().default(false).optional(),
  lulus: z.boolean().default(false).optional(),
});

export type CreatePesertaType = z.infer<typeof CreatePesertaSchema>;
export type UpdatePesertaType = z.infer<typeof UpdatePesertaSchema>;