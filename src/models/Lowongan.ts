export interface Lowongan {
	alamat: string;
	tenggat_lowongan: string;
	deskripsi: string;
	gambar_sampul: string;
	judul: string;
	link_konten: string;
	link_lowongan: string;
	posisi_lowongan: string;
	perusahaan: string;
	max_gaji?: number;
	min_gaji?: number;
	syarat: string[];
	created_at?: string;
	tipe: string[];
	[key: string]: any;
}

export interface LowonganItem {
	id: string;
	posisi_lowongan: string;
	perusahaan: string;
	tenggat_lowongan: string;
	link_konten: string;
	link_lowongan: string;
	created_at: string;
	tipe: string[];
}