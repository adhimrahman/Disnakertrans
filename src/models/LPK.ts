export interface Laporan {
	id: string;
	nama_lembaga: string;
	tanggal_pelaksanaan: string;
	instruktur: {
		jumlah_instruktur: number;
		jumlah_instruktur_sertifikat: number;
	};
	peserta: {
		jumlah_bekerja: number;
		jumlah_dilatih: number;
		jumlah_lulus: number;
		jumlah_pendaftar: number;
		jumlah_peserta_sertifikat: number;
	};
	created_at: string;
	updated_at: string;
};

export type LaporanItem = Omit<Laporan, 'created_at' | 'updated_at'>;