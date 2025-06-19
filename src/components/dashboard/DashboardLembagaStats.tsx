'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Assessment, School } from '@mui/icons-material';

type StatsProps = {
  totalLaporan: number;
  totalPelatihan: number;
};

export default function DashboardLembagaStats({ totalLaporan, totalPelatihan }: StatsProps) {
  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assessment color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Laporan</Typography>
                  <Typography variant="h4">{totalLaporan}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <School color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Total Pelatihan</Typography>
                  <Typography variant="h4">{totalPelatihan}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}