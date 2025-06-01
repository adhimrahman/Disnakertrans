export interface PesertaLpk {
  nama: string;
  lpk: number,
  jurusan: string;
  jenis_kelamin: boolean;
  tanggal_lahir: string;
  kontak: {
    alamat_tinggal: string;
    email: string;
    nomor_hp: string;
  },
  lulus: boolean;
  tanggal_daftar: string;
  isDelete: boolean
}

// export type PesertaLpkItem = Omit