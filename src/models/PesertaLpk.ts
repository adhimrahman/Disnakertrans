import { Timestamp } from "@firebase/firestore";
export interface PesertaLpk {
  nama: string;
  lpk: number,
  jurusan: string;
  jenis_kelamin: boolean;
  tanggal_lahir: Timestamp | null;
  kontak: {
    alamat_tinggal: string;
    email: string;
    nomor_hp: string;
  },
  lulus: boolean;
  tanggal_daftar: Timestamp | null;
  isDelete: boolean
}
