export interface Profile {
  id: string;
  gambar: string;
  awal_jabat: string;
  akhir_jabat: string;
  nama_lengkap: string;
  created_at?: string;
  updated_at?: string;
};

export type updateProfile = Omit<Profile, "created_at" | "updated_at">;