import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DashboardLembagaActions({ lpkId }: { lpkId: string }) {
  const router = useRouter();

  return (
    <Box mt={4}>
      <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(to right, #f5f5f5, #ffffff)' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">Aksi Cepat</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2 }} onClick={() => router.push(`/lembaga/${lpkId}/pelatihan`)}>
              Lihat Pelatihan
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="outlined" sx={{ py: 2, borderRadius: 2 }} onClick={() => router.push(`/lembaga/${lpkId}/laporan`)}>
              Lihat Laporan
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
