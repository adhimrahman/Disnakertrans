'use client';
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

export default function DashboardMonthlyActivity({ chartData }: { chartData: any }) {
  const bulan = [...Array(12)].map((_, i) => new Date(0, i).toLocaleString('id-ID', { month: 'long' }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Kegiatan Bulanan</Typography>
            {chartData.kegiatanByMonth.map((value: number, i: number) => (
              <Box key={i} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{bulan[i]}</Typography>
                  <Typography variant="body2" fontWeight="bold">{value}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={Math.min(value / 10 * 100, 100)} sx={{ height: 8, borderRadius: 5, bgcolor: '#e3f2fd', '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } }} />
              </Box>
            )).slice(0, 6)}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Lowongan Kerja Bulanan</Typography>
            {chartData.lowonganByMonth.map((value: number, i: number) => (
              <Box key={i} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{bulan[i]}</Typography>
                  <Typography variant="body2" fontWeight="bold">{value}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={Math.min(value / 10 * 100, 100)} sx={{ height: 8, borderRadius: 5, bgcolor: '#fff3e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' } }} />
              </Box>
            )).slice(0, 6)}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
