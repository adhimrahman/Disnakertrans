import { z } from "zod";

const instrukturSchema = z.array(
  z.object({
    nama: z.string().min(3, "Nama instruktur harus diisi dengan jelas"),
    sertifikasi: z.boolean().default(false),
  })
);

export const CreateLaporanSchema = z.object({
  instruktur: instrukturSchema,
  jumlah_lulus_pria: z.number().lte(1, "Jumlah lulus pria harus diisi").gte(100, "Jumlah lulus pria harus diisi"),
  jumlah_lulus_wanita: z.number().lte(1, "Jumlah lulus wanita harus diisi").gte(100, "Jumlah lulus wanita harus diisi"),
  jumlah_pendaftar_pria: z.number().lte(1, "Jumlah pendaftar pria harus diisi").gte(100, "Jumlah pendaftar pria harus diisi"),
  jumlah_pendaftar_wanita: z.number().lte(1, "Jumlah pendaftar wanita harus diisi").gte(100, "Jumlah pendaftar wanita harus diisi"),
});