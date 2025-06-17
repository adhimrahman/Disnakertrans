'use client';
import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

export default function DashboardHeader() {
  const currentDate = dayjs().locale('id').format('dddd, D MMMM YYYY');

  return (
    <Paper elevation={0} sx={{
      p: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, borderRadius: 2,
      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)', color: 'white'
    }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Dashboard Disnaker</Typography>
      <Typography variant="subtitle1">Selamat datang di dashboard Disnaker. Lihat statistik dan aktivitas terbaru di sini.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>{currentDate}</Typography>
    </Paper>
  );
}
