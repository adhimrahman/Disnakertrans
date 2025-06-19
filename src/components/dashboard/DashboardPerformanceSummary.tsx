'use client';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { BarChart } from '@mui/icons-material';

interface DashboardStats {
  totalAkun: number;
  totalLPK: number;
  totalKegiatan: number;
  totalLowongan: number;
  totalLaporan: number;
}

export default function DashboardPerformanceSummary({ stats }: { stats: DashboardStats }) {
  const formatNumber = (number: number) => number.toLocaleString('id-ID');

  return (
    <Box mt={4}>
      <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(to right, #f5f5f5, #ffffff)' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <BarChart sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h5" fontWeight="bold">Ringkasan Kinerja</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography paragraph>Dashboard menampilkan total <strong>{formatNumber(stats.totalAkun)}</strong> akun pengguna, termasuk <strong>{formatNumber(stats.totalLPK)}</strong> Lembaga Pelatihan Kerja (LPK).</Typography>
        <Typography paragraph>Saat ini terdapat <strong>{formatNumber(stats.totalKegiatan)}</strong> kegiatan, <strong>{formatNumber(stats.totalLowongan)}</strong> lowongan kerja, dan <strong>{formatNumber(stats.totalLaporan)}</strong> laporan.</Typography>
        <Typography paragraph>Aktivitas bulanan menunjukkan tren kegiatan dan lowongan kerja yang dapat digunakan untuk analisis Disnaker ke depan.</Typography>
      </Paper>
    </Box>
  );
}
