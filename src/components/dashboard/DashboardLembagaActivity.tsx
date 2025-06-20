import { Grid, Card, CardContent, Typography, Divider, List, ListItem, ListItemText, ListItemIcon, Avatar, Box } from '@mui/material';
import { WorkHistory as WorkHistoryIcon, Schedule as ScheduleIcon, Assessment as AssessmentIcon, School as SchoolIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

interface PelatihanItem {
  judul: string;
  tanggal_kegiatan: { toDate: () => Date } | string;
}

interface LaporanItem {
  nama_pelatihan: string;
  tanggal_pelaksanaan: { toDate: () => Date };
}

interface Props {
  recentLaporan: LaporanItem[];
  recentPelatihan: PelatihanItem[];
}

export default function DashboardLembagaActivity({ recentLaporan, recentPelatihan }: Props) {
  // const formatDate = (date: any) => dayjs(date.toDate()).locale('id').format('dddd, D MMMM YYYY');
  const formatDate = (date: { toDate: () => Date } | string) => {
    const d = typeof date === 'string' ? new Date(date) : date.toDate();
    return dayjs(d).locale('id').format('dddd, D MMMM YYYY');
  };

  // Ensure we always display at least 2 items (even if they're placeholders)
  const pelatihanItems = recentPelatihan.length > 0 ? recentPelatihan : [{} as PelatihanItem, {} as PelatihanItem];
  const laporanItems = recentLaporan.length > 0 ? recentLaporan : [{} as LaporanItem, {} as LaporanItem];
  
  // Make sure we have the same number of items in both sections (for consistent height)
  const maxItems = Math.max(2, Math.max(pelatihanItems.length, laporanItems.length));
  
  // Fill arrays with empty items if needed to ensure equal heights
  while (pelatihanItems.length < maxItems) pelatihanItems.push({} as PelatihanItem);
  while (laporanItems.length < maxItems) laporanItems.push({} as LaporanItem);

  // Common styles for cards with consistent height
  const cardStyles = { 
    borderRadius: 2, 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column' 
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={cardStyles}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box mb={2} display="flex" alignItems="center">
              <WorkHistoryIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Pelatihan Terbaru</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ flex: 1 }}>
              {recentPelatihan.length > 0 ? pelatihanItems.slice(0, maxItems).map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#fff3e0' }}>
                      <SchoolIcon sx={{ color: '#f57c00' }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.judul || 'Tidak ada pelatihan'} 
                    secondary={item.tanggal_kegiatan ? formatDate(item.tanggal_kegiatan) : '-'} 
                  />
                </ListItem>
              )) : (
                <Typography align="center" color="text.secondary">Belum ada aktivitas pelatihan</Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={cardStyles}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box mb={2} display="flex" alignItems="center">
              <ScheduleIcon sx={{ mr: 1, color: '#f57c00' }} />
              <Typography variant="h6">Laporan Terbaru</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ flex: 1 }}>
              {recentLaporan.length > 0 ? laporanItems.slice(0, maxItems).map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#fce4ec' }}>
                      <AssessmentIcon sx={{ color: '#d81b60' }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.nama_pelatihan || 'Laporan'} 
                    secondary={item.tanggal_pelaksanaan ? formatDate(item.tanggal_pelaksanaan) : '-'} 
                  />
                </ListItem>
              )) : (
                <Typography align="center" color="text.secondary">Belum ada laporan terbaru</Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
