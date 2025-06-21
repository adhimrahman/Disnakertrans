export interface Kegiatan {
	id: string;
	judul: string;
	deskripsi: string;
	gambar_sampul: string;
	gambar_kegiatan: string;
	link: string;
	tanggal_kegiatan?: string;
}

export interface KegiatanItem {
	id: string;
	judul: string;
	created_at?: string;
	tanggal_kegiatan?: string;
	gambar_sampul?: File | string;
	deskripsi: string;
	gambar_kegiatan?: (File | string);
	link: string;
}