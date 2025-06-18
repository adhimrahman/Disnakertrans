import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import { School as SchoolIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

interface StatsProps {
  totalPelatihan: number;
  totalLaporan: number;
}

export default function DashboardLembagaStats({ totalPelatihan, totalLaporan }: StatsProps) {
  return (
    <Grid container spacing={3} mb={4} justifyContent="center">
      <Grid item xs={12} sm={6} md={5} lg={4}>
        <Card sx={{ borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#fff3e0', width: 56, height: 56, mx: 'auto', mb: 2 }}>
              <SchoolIcon sx={{ color: '#f57c00', fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold">{totalPelatihan}</Typography>
            <Typography color="text.secondary">Total Pelatihan</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={5} lg={4}>
        <Card sx={{ borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: '#fce4ec', width: 56, height: 56, mx: 'auto', mb: 2 }}>
              <AssessmentIcon sx={{ color: '#d81b60', fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold">{totalLaporan}</Typography>
            <Typography color="text.secondary">Total Laporan</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
