export type Peserta = {
  id: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  alamat: string;
  email: string;
  no_telp: number;
  tanggal_daftar: string;
  lpk: number;
  jenis_kelamin: boolean;
  is_deleted: boolean;
  lulus: boolean;
};

export type PesertaItem = Omit<Peserta, "id">;