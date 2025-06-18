import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

export default function DashboardLembagaHeader() {
  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2, background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', color: 'white' }}>
      <Typography variant="h4" fontWeight="bold">Dashboard Lembaga</Typography>
      <Typography variant="subtitle1">Kelola informasi laporan & pelatihan Lembaga Anda</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {dayjs().locale('id').format('dddd, D MMMM YYYY')}
      </Typography>
    </Paper>
  );
}
