import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface DashboardLembagaStatsProps {
  totalLaporan: number;
  totalPelatihan: number;
}

export default function DashboardLembagaStats({ totalLaporan, totalPelatihan }: DashboardLembagaStatsProps) {
  return (
    <Box sx={{ width: '100%', mt: 3, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 2 
          }}>
            <Box sx={{ 
              backgroundColor: 'rgba(255, 153, 0, 0.1)', 
              borderRadius: '50%', 
              width: 60, 
              height: 60, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <SchoolIcon sx={{ color: '#ff9900', fontSize: 30 }} />
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {totalPelatihan}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Total Pelatihan
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 2 
          }}>
            <Box sx={{ 
              backgroundColor: 'rgba(233, 30, 99, 0.1)', 
              borderRadius: '50%', 
              width: 60, 
              height: 60, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <AssessmentIcon sx={{ color: '#e91e63', fontSize: 30 }} />
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {totalLaporan}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Total Laporan
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
