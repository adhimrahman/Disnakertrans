'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import {
  Container,
  Card,
  Box,
  Divider,
  Stack,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Grid,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type Instruktur = {
  nama: string;
  sertifikasi: boolean;
};

type LaporanLpk = {
  jenis_pelatihan: string;
  waktu_pelatihan: Timestamp | null;
  jurusan: string;
  jumlah_pendaftar: {
    pria: number;
    wanita: number;
  };
  jumlah_lulus: {
    pria: number;
    wanita: number;
  };
  instruktur: Instruktur[];
  lulus_bersertifikat: number;
  lulus_kompeten: number;
  bekerja: number;
  isDelete: boolean;
};

export default function EditLaporanPage() {
  const router = useRouter();
  const { lpkId, id } = useParams();

  const [formData, setFormData] = useState<LaporanLpk>({
    jenis_pelatihan: '',
    waktu_pelatihan: null,
    jurusan: '',
    jumlah_pendaftar: { pria: 0, wanita: 0 },
    jumlah_lulus: { pria: 0, wanita: 0 },
    instruktur: [{ nama: '', sertifikasi: false }],
    lulus_bersertifikat: 0,
    lulus_kompeten: 0,
    bekerja: 0,
    isDelete: false,
  });
  
  const [waktuPelatihanStr, setWaktuPelatihanStr] = useState<string>('');
  type LaporanLpkErrors = {
    [K in keyof LaporanLpk]?: string;
  };
  const [errors, setErrors] = useState<LaporanLpkErrors>({});
  const [instrukturErrors, setInstrukturErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Mengambil data laporan yang akan diedit
  useEffect(() => {
    if (!lpkId || !id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const laporanRef = doc(db, `lpk/${lpkId}/laporan`, id as string);
        const docSnap = await getDoc(laporanRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as LaporanLpk;
          
          // Format tanggal untuk input
          const tanggalPelatihan = data.waktu_pelatihan instanceof Timestamp 
            ? data.waktu_pelatihan.toDate().toISOString().split('T')[0] 
            : '';
          
          setFormData(data);
          setWaktuPelatihanStr(tanggalPelatihan);
          
          // Inisialisasi error untuk instruktur
          setInstrukturErrors(new Array(data.instruktur.length).fill(''));
        } else {
          console.error('Dokumen tidak ditemukan');
        }
      } catch (error) {
        console.error('Error mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lpkId, id]);

  // Handler untuk perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handler untuk input nested (jumlah pendaftar/lulus)
  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    parent: 'jumlah_pendaftar' | 'jumlah_lulus',
    child: 'pria' | 'wanita'
  ) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: Number(value)
      }
    }));
  };

  // Handler untuk perubahan data instruktur
  const handleInstrukturChange = (index: number, field: keyof Instruktur, value: any) => {
    const newInstruktur = [...formData.instruktur];
    newInstruktur[index] = { ...newInstruktur[index], [field]: value };
    setFormData(prev => ({ ...prev, instruktur: newInstruktur }));
    
    // Reset error untuk instruktur ini
    if (field === 'nama' && value.trim() !== '') {
      const newErrors = [...instrukturErrors];
      newErrors[index] = '';
      setInstrukturErrors(newErrors);
    }
  };

  // Menambah baris instruktur baru
  const addInstruktur = () => {
    setFormData(prev => ({
      ...prev,
      instruktur: [...prev.instruktur, { nama: '', sertifikasi: false }]
    }));
    setInstrukturErrors(prev => [...prev, '']);
  };

  // Menghapus baris instruktur
  const removeInstruktur = (index: number) => {
    if (formData.instruktur.length > 1) {
      const newInstruktur = [...formData.instruktur];
      newInstruktur.splice(index, 1);
      setFormData(prev => ({ ...prev, instruktur: newInstruktur }));
      
      const newErrors = [...instrukturErrors];
      newErrors.splice(index, 1);
      setInstrukturErrors(newErrors);
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validasi form
    const newErrors: LaporanLpkErrors = {};
    const newInstrukturErrors: string[] = [];
    let hasError = false;

    if (!formData.jenis_pelatihan) {
      newErrors.jenis_pelatihan = 'Jenis pelatihan harus diisi';
      hasError = true;
    }
    
    if (!waktuPelatihanStr) {
      newErrors.waktu_pelatihan = 'Waktu pelatihan harus diisi';
      hasError = true;
    }
    
    if (!formData.jurusan) {
      newErrors.jurusan = 'Jurusan harus diisi';
      hasError = true;
    }
    
    // Validasi instruktur
    formData.instruktur.forEach((inst, index) => {
      if (!inst.nama.trim()) {
        newInstrukturErrors[index] = `Nama instruktur #${index + 1} harus diisi`;
        hasError = true;
      } else {
        newInstrukturErrors[index] = '';
      }
    });

    setErrors(newErrors);
    setInstrukturErrors(newInstrukturErrors);
    
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (!lpkId || !id) return;
      
      const laporanRef = doc(db, `lpk/${lpkId}/laporan`, id as string);
      
      await updateDoc(laporanRef, {
        ...formData,
        waktu_pelatihan: Timestamp.fromDate(new Date(waktuPelatihanStr))
      });
      
      alert('Laporan berhasil diperbarui');
      router.push(`/dashboard/lpk/${lpkId}/laporan/laporanLpk`);
    } catch (err) {
      console.error('Error memperbarui laporan:', err);
      alert('Terjadi kesalahan saat memperbarui data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={1}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Edit Laporan LPK
          </Typography>
        </Box>       
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Jenis Pelatihan"
              name="jenis_pelatihan"
              value={formData.jenis_pelatihan}
              onChange={handleChange}
              error={!!errors.jenis_pelatihan}
              helperText={errors.jenis_pelatihan}
              fullWidth
              required
            />
            
            <TextField
              label="Waktu Pelatihan"
              type="date"
              value={waktuPelatihanStr}
              onChange={e => setWaktuPelatihanStr(e.target.value)}
              error={!!errors.waktu_pelatihan}
              helperText={errors.waktu_pelatihan}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            
            <TextField
              label="Jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              error={!!errors.jurusan}
              helperText={errors.jurusan}
              fullWidth
              required
            />
            
            <Typography variant="subtitle1">Jumlah Pendaftar</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Pria"
                  type="number"
                  value={formData.jumlah_pendaftar.pria}
                  onChange={(e) => handleNestedChange(e, 'jumlah_pendaftar', 'pria')}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Wanita"
                  type="number"
                  value={formData.jumlah_pendaftar.wanita}
                  onChange={(e) => handleNestedChange(e, 'jumlah_pendaftar', 'wanita')}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1">Jumlah Lulus</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Pria"
                  type="number"
                  value={formData.jumlah_lulus.pria}
                  onChange={(e) => handleNestedChange(e, 'jumlah_lulus', 'pria')}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Wanita"
                  type="number"
                  value={formData.jumlah_lulus.wanita}
                  onChange={(e) => handleNestedChange(e, 'jumlah_lulus', 'wanita')}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1">Instruktur</Typography>
            {formData.instruktur.map((instruktur, index) => (
              <Grid container key={index} spacing={2} alignItems="center">
                <Grid item xs={9}>
                  <TextField
                    label={`Nama Instruktur #${index + 1}`}
                    error={!!instrukturErrors[index]}
                    helperText={instrukturErrors[index]}
                    value={instruktur.nama}
                    onChange={(e) => handleInstrukturChange(index, 'nama', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={instruktur.sertifikasi}
                        onChange={(e) => handleInstrukturChange(index, 'sertifikasi', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Sertifikasi"
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton 
                    onClick={() => removeInstruktur(index)} 
                    disabled={formData.instruktur.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addInstruktur}
              sx={{ alignSelf: 'flex-start' }}
            >
              Tambah Instruktur
            </Button>
            
            <Typography variant="subtitle1">Statistik Kelulusan</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Lulus Bersertifikat"
                  type="number"
                  name="lulus_bersertifikat"
                  value={formData.lulus_bersertifikat}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Lulus Kompeten"
                  type="number"
                  name="lulus_kompeten"
                  value={formData.lulus_kompeten}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Bekerja"
                  type="number"
                  name="bekerja"
                  value={formData.bekerja}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Stack>
          
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Perbarui Laporan'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}