'use client';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import {
  People, School, Event, Work, Assignment
} from '@mui/icons-material';

interface DashboardStats {
  totalAkun: number;
  totalLPK: number;
  totalKegiatan: number;
  totalLowongan: number;
  totalLaporan: number;
}

export default function DashboardSummaryCards({ stats }: { stats: DashboardStats }) {
  const formatNumber = (number: number) => number.toLocaleString('id-ID');

  const cards = [
    { label: 'Total Akun', value: stats.totalAkun, icon: <People fontSize="large" />, color: '#1976d2', bg: '#e3f2fd' },
    { label: 'Total LPK', value: stats.totalLPK, icon: <School fontSize="large" />, color: '#43a047', bg: '#e8f5e9' },
    { label: 'Total Kegiatan', value: stats.totalKegiatan, icon: <Event fontSize="large" />, color: '#ff9800', bg: '#fff3e0' },
    { label: 'Total Lowongan', value: stats.totalLowongan, icon: <Work fontSize="large" />, color: '#9c27b0', bg: '#f3e5f5' },
    { label: 'Total Laporan', value: stats.totalLaporan, icon: <Assignment fontSize="large" />, color: '#e53935', bg: '#ffe0e0' },
  ];

  return (
    <Grid container spacing={3} mb={4}>
      {cards.map((card, index) => (
        <Grid key={index} item xs={6} sm={6} md={4} lg={2.4}>
          <Card sx={{
            borderRadius: 2, transition: 'transform 0.3s', '&:hover': {
              transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 60, height: 60, mx: 'auto', mb: 2 }}>
                {card.icon}
              </Avatar>
              <Typography variant="h4" fontWeight="bold">{formatNumber(card.value)}</Typography>
              <Typography color="text.secondary">{card.label}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
