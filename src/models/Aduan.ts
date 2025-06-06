export interface Aduan {
  id: string;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  pesan?: string;
  no_telp: string;
  created_at?: string;
  is_done: boolean;
};

export interface AduanItem {
  id: string;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  created_at?: string;
  is_done: boolean;
}