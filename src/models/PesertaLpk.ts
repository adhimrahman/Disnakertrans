import { Timestamp } from "@firebase/firestore";
export interface PesertaLpk {
  id: string;
  nama: string;
  lpk: number,
  jurusan: string;
  jenis_kelamin: boolean;
  tanggal_lahir: Timestamp;
  kontak?: {
    alamat_tinggal: string;
    email: string;
    nomor_hp: string;
  },
  lulus: boolean;
  tanggal_daftar: Timestamp;
  isDelete: boolean
}
