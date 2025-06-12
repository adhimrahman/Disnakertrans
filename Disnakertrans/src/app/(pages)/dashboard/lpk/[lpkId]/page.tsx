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
  Avatar,
  CircularProgress,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  WorkHistory as WorkHistoryIcon,
  School as SchoolIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useParams } from 'next/navigation';

export default function LPKPage() {
  const { lpkId } = useParams();
  const [stats, setStats] = useState({
    totalPeserta: 0,
    totalLaporan: 0,
    pesertaLulus: 0,
    pesertaAktif: 0,
    isLoading: true
  });

  const [recentActivities, setRecentActivities] = useState<{ type: string; title: string; date: Date; description: string }[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<{ id: string; [key: string]: any }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mendapatkan data peserta
        const pesertaQuery = query(
          collection(db, 'PesertaLPK'),
          where('lpkId', '==', lpkId)
        );
        const pesertaSnapshot = await getDocs(pesertaQuery);
        const totalPeserta = pesertaSnapshot.size;

        // Menghitung peserta lulus dan aktif
        let lulus = 0;
        let aktif = 0;
        pesertaSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'Lulus') lulus++;
          if (data.status === 'Aktif') aktif++;
        });

        // Mendapatkan laporan
        const laporanQuery = query(
          collection(db, 'Laporan'),
          where('lpkId', '==', lpkId)
        );
        const laporanSnapshot = await getDocs(laporanQuery);
        const totalLaporan = laporanSnapshot.size;

        // Mengupdate stats
        setStats({
          totalPeserta,
          totalLaporan,
          pesertaLulus: lulus,
          pesertaAktif: aktif,
          isLoading: false
        });

        // Mendapatkan aktivitas terbaru
        const recentActivitiesData: { type: string; title: string; date: Date; description: string }[] = [];
        const now = new Date();
        
        // Menggabungkan dan mengurutkan aktivitas
        [...laporanSnapshot.docs].forEach(doc => {
          const data = doc.data();
          if (data.tanggalSubmit) {
            recentActivitiesData.push({
              type: 'laporan',
              title: 'Laporan Baru Ditambahkan',
              date: data.tanggalSubmit.toDate(),
              description: data.judulLaporan || 'Laporan Kegiatan'
            });
          }
        });

        // Mendapatkan kegiatan mendatang
        const kegiatanQuery = query(
          collection(db, 'Kegiatan'),
          where('Tanggal', '>', Timestamp.fromDate(now)),
          orderBy('Tanggal', 'asc'),
          limit(5)
        );
        const kegiatanSnapshot = await getDocs(kegiatanQuery);
        const upcomingEventsData = kegiatanSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort activities by date
        recentActivitiesData.sort((a, b) => b.date.getTime() - a.date.getTime());
        setRecentActivities(recentActivitiesData.slice(0, 5));
        setUpcomingEvents(upcomingEventsData);

      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (lpkId) {
      fetchStats();
    }
  }, [lpkId]);

  // Format angka
  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Format tanggal
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          color: 'white'
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
          Dashboard LPK
        </Typography>
        <Typography variant="subtitle1">
          Kelola informasi peserta, laporan, dan aktivitas LPK Anda di sini.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {new Date().toLocaleDateString('id-ID', { 
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
          {/* Statistik Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#e3f2fd',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <GroupIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {formatNumber(stats.totalPeserta)}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Peserta
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#e8f5e9',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <CheckCircleIcon sx={{ color: '#43a047', fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {formatNumber(stats.pesertaLulus)}
                  </Typography>
                  <Typography color="text.secondary">
                    Peserta Lulus
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#fff3e0',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <SchoolIcon sx={{ color: '#f57c00', fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {formatNumber(stats.pesertaAktif)}
                  </Typography>
                  <Typography color="text.secondary">
                    Peserta Aktif
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#fce4ec',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <AssessmentIcon sx={{ color: '#d81b60', fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {formatNumber(stats.totalLaporan)}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Laporan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Aktivitas & Events */}
          <Grid container spacing={3}>
            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <WorkHistoryIcon sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography variant="h6" component="h2">
                      Aktivitas Terbaru
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <ListItem 
                          key={index}
                          sx={{ 
                            px: 0,
                            '&:not(:last-child)': {
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: activity.type === 'laporan' ? '#e3f2fd' : '#e8f5e9'
                              }}
                            >
                              {activity.type === 'laporan' ? (
                                <AssessmentIcon sx={{ color: '#1976d2' }} />
                              ) : (
                                <PersonIcon sx={{ color: '#43a047' }} />
                              )}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.title}
                            secondary={formatDate(activity.date)}
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography color="text.secondary" align="center">
                        Belum ada aktivitas terbaru
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Upcoming Events */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ mr: 1, color: '#f57c00' }} />
                    <Typography variant="h6" component="h2">
                      Kegiatan Mendatang
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => (
                        <ListItem 
                          key={index}
                          sx={{ 
                            px: 0,
                            '&:not(:last-child)': {
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#fff3e0'
                              }}
                            >
                              <ScheduleIcon sx={{ color: '#f57c00' }} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={event.Judul}
                            secondary={event.Tanggal ? formatDate(event.Tanggal.toDate()) : '-'}
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography color="text.secondary" align="center">
                        Belum ada kegiatan mendatang
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Box mt={4}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                background: 'linear-gradient(to right, #f5f5f5, #ffffff)'
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Aksi Cepat
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      justifyContent: 'flex-start'
                    }}
                  >
                    Tambah Peserta Baru
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssessmentIcon />}
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      justifyContent: 'flex-start'
                    }}
                  >
                    Buat Laporan
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SchoolIcon />}
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      justifyContent: 'flex-start'
                    }}
                  >
                    Lihat Data Peserta
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EventIcon />}
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      justifyContent: 'flex-start'
                    }}
                  >
                    Lihat Kegiatan
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
}
