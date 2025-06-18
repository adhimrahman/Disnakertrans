'use client';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardMonthlyActivity from '@/components/dashboard/DashboardMonthlyActivity';
import DashboardPerformanceSummary from '@/components/dashboard/DashboardPerformanceSummary';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({ isLoading: true });
  const [chartData, setChartData] = useState<any>({ kegiatanByMonth: Array(12).fill(0), lowonganByMonth: Array(12).fill(0) });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'akun'));
        const lpkSnapshot = await getDocs(query(collection(db, 'akun'), where("role", "!=", 'disnaker')));
        const kegiatanSnapshot = await getDocs(query(collection(db, 'kegiatan')));
        const lowonganSnapshot = await getDocs(query(collection(db, 'lowongan')));

        let totalLaporan = 0;
        const laporanSnapshot = await getDocs(collection(db, 'laporan'));
        totalLaporan = laporanSnapshot.size;

        setStats({
          totalAkun: usersSnapshot.size,
          totalLPK: lpkSnapshot.size,
          totalKegiatan: kegiatanSnapshot.size,
          totalLowongan: lowonganSnapshot.size,
          totalLaporan,
          isLoading: false
        });

        const bulan = Array(12).fill(0);
        kegiatanSnapshot.forEach(doc => {
          const date = doc.data().tanggal_kegiatan?.toDate();
          if (date && date.getFullYear() === new Date().getFullYear()) bulan[date.getMonth()]++;
        });
        const lowongan = Array(12).fill(0);
        lowonganSnapshot.forEach(doc => {
          const date = doc.data().tenggat_lowongan?.toDate();
          if (date && date.getFullYear() === new Date().getFullYear()) lowongan[date.getMonth()]++;
        });
        setChartData({ kegiatanByMonth: bulan, lowonganByMonth: lowongan });

      } catch (err) {
        console.error(err);
        setStats((prev: any) => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <DashboardHeader />
      {stats.isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : ( 
        <>
          <DashboardSummaryCards stats={stats} />
          <Typography variant="h5" color='black' fontWeight="bold" mb={2}>Aktivitas Bulanan</Typography>
          <DashboardMonthlyActivity chartData={chartData} />
          <DashboardPerformanceSummary stats={stats} />
        </>
      )}
    </Container>
  );
}
