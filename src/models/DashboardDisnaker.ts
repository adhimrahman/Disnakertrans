export type DashboardStats = {
    totalAkun: number;
    totalLPK: number;
    totalKegiatan: number;
    totalLowongan: number;
    totalLaporan: number;
    isLoading: boolean;
};

export type ChartData = {
    kegiatanByMonth: number[];
    lowonganByMonth: number[];
};