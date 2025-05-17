'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Container, 
  Paper, 
  Divider,
  Avatar,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { 
  People as PeopleIcon, 
  Work as WorkIcon, 
  Event as EventIcon, 
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { id, is, ta } from 'date-fns/locale';
import { isDataView } from 'util/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAkun: 0,
    totalLPK: 0,
    totalKegiatan: 0,
    totalLowongan: 0,
    totalLaporan: 0,
    isLoading: true
  });

  // Mendapatkan data untuk chart
  const [chartData, setChartData] = useState({
    kegiatanByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    lowonganByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });

  // Mendapatkan statistik dari Firebase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mendapatkan jumlah akun
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const totalAkun = usersSnapshot.size;

        // Mendapatkan jumlah LPK (filter by role/type jika ada)
        const lpkSnapshot = await getDocs(query(collection(db, 'lpk'))); //where('role', '==', 'lpk')));

        const totalLPK = lpkSnapshot.size;

        // Mendapatkan jumlah kegiatan
        const kegiatanSnapshot = await getDocs(collection(db, 'Kegiatan'));
        const totalKegiatan = kegiatanSnapshot.size;
        
        // Menghitung kegiatan per bulan
        const kegiatanByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        kegiatanSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Tanggal && data.Tanggal instanceof Timestamp) {
            const date = data.Tanggal.toDate();
            const month = date.getMonth();
            kegiatanByMonth[month]++;
          }
        });

        // Mendapatkan jumlah lowongan
        const lowonganSnapshot = await getDocs(collection(db, 'lowongan'));
        const totalLowongan = lowonganSnapshot.size;
        
        // Menghitung lowongan per bulan
        const lowonganByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        lowonganSnapshot.forEach((doc) => {
          const data = doc.data();
          // Debug log untuk melihat struktur data
          console.log('Data Lowongan:', {
            id: doc.id,
            tanggal_unggah: data.tanggal_unggah,
            isTimestamp: data.tanggal_unggah instanceof Timestamp,
            isDelete : data.isDelete,
          });

          // Perbaikan pengecekan tanggal
          if (!data.isDelete || data.isDelete === undefined) {
            try {
              let date;
              if (data.tanggal_unggah instanceof Timestamp) {
                date = data.tanggal_unggah.toDate();
              } else if (data.tanggal_unggah?.seconds) {
                // Jika tanggal tersimpan dalam format { seconds, nanoseconds }
                date = new Timestamp(
                  data.tanggal_unggah.seconds,
                  data.tanggal_unggah.nanoseconds || 0
                ).toDate();
              }

              console.log(`[CHECK] ID: ${doc.id}, tanggal_unggah:`, data.tanggal_unggah);

              if (date) {
                const month = date.getMonth();
                lowonganByMonth[month]++;
                console.log(`Berhasil menambahkan lowongan untuk bulan ${month + 1}`);
              }
            } catch (error) {
              console.error('Error processing date for document:', doc.id, error);
            }
          }
        });

        console.log('Lowongan by month:', lowonganByMonth);

        // Mendapatkan jumlah laporan dari semua LPK
        let totalLaporan = 0;

        // 1. Ambil semua dokumen LPK
        const allLpkDataSnapshot = await getDocs(collection(db, 'lpk'));

        // 2. Iterasi setiap LPK untuk mengambil laporannya
        const laporanPromises = lpkSnapshot.docs.map(async (lpkDoc) => {
          const lpkId = lpkDoc.id;
          
          // Periksa apakah collection laporan ada untuk LPK ini
          try {
            const laporanSnapshot = await getDocs(collection(db, `lpk/${lpkId}/laporan`));
            return laporanSnapshot.size;
          } catch (error) {
            console.log(`Tidak ada laporan untuk LPK ${lpkId} atau error:`, error);
            return 0;
          }
        });

        // 3. Tunggu semua promises selesai dan jumlahkan
        const laporanCounts = await Promise.all(laporanPromises);
        totalLaporan = laporanCounts.reduce((sum, count) => sum + count, 0);

        console.log(`Total laporan dari semua LPK: ${totalLaporan}`);

        setStats({
          totalAkun,
          totalLPK,
          totalKegiatan,
          totalLowongan,
          totalLaporan,
          isLoading: false
        });

        setChartData({
          kegiatanByMonth,
          lowonganByMonth
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, []);

  // Format angka dengan titik sebagai pemisah ribuan
  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white'
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Disnaker
        </Typography>
        <Typography variant="subtitle1">
          Selamat datang di dashboard Disnaker. Lihat statistik dan aktivitas terbaru di sini.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {currentDate.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </Paper>

      {stats.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistik Kartu */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#e3f2fd',
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      color: '#1976d2'
                    }}
                  >
                    <PeopleIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats.totalAkun)}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1">
                    Total Akun
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#e8f5e9',
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      color: '#43a047'
                    }}
                  >
                    <SchoolIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats.totalLPK)}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1">
                    Total LPK
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#fff3e0',
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      color: '#ff9800'
                    }}
                  >
                    <EventIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats.totalKegiatan)}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1">
                    Total Kegiatan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#f3e5f5',
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      color: '#9c27b0'
                    }}
                  >
                    <WorkIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats.totalLowongan)}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1">
                    Total Lowongan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#ffe0e0',
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      color: '#e53935'
                    }}
                  >
                    <AssignmentIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats.totalLaporan)}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1">
                    Total Laporan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Aktivitas Bulanan */}
          <Typography variant="h5" color='black' sx={{ mb: 2, fontWeight: 'bold' }}>
            Aktivitas Bulanan ({currentMonth} {currentYear})
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Kegiatan Bulanan
                  </Typography>
                  <Box sx={{ mt: 3, mb: 1 }}>
                    {chartData.kegiatanByMonth.map((value, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">
                            {new Date(0, index).toLocaleString('id-ID', { month: 'long' })}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {value}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((value / 10) * 100, 100)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 5,
                            bgcolor: '#e3f2fd',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#1976d2'
                            }
                          }}
                        />
                      </Box>
                    )).slice(0, 6)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Lowongan Kerja Bulanan
                  </Typography>
                  <Box sx={{ mt: 3, mb: 1 }}>
                    {chartData.lowonganByMonth.map((value, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">
                            {new Date(0, index).toLocaleString('id-ID', { month: 'long' })}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {value}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((value / 10) * 100, 100)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 5,
                            bgcolor: '#fff3e0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#ff9800'
                            }
                          }}
                        />
                      </Box>
                    )).slice(0, 6)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Ringkasan Kinerja */}
          <Box mt={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Box display="flex" alignItems="center" mb={2}>
                <BarChartIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h5" fontWeight="bold">
                  Ringkasan Kinerja
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1" paragraph>
                Dashboard menampilkan total <strong>{formatNumber(stats.totalAkun)}</strong> akun pengguna, 
                termasuk <strong>{formatNumber(stats.totalLPK)}</strong> Lembaga Pelatihan Kerja (LPK) terdaftar.
              </Typography>
              
              <Typography variant="body1" paragraph>
                Saat ini terdapat <strong>{formatNumber(stats.totalKegiatan)}</strong> kegiatan dan 
                <strong> {formatNumber(stats.totalLowongan)}</strong> lowongan kerja yang tersedia.
                Laporan yang telah dikumpulkan berjumlah <strong>{formatNumber(stats.totalLaporan)}</strong>.
              </Typography>
              
              <Typography variant="body1">
                Aktivitas bulanan menunjukkan tren kegiatan dan lowongan kerja yang dapat digunakan untuk 
                analisis dan perencanaan program Disnaker kedepannya.
              </Typography>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
}
