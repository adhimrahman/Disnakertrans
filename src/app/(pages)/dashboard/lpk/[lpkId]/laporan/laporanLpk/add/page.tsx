'use client';

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Card,
  Box,
  Divider,
  Stack,
  TextField,
  Button,
  Typography,
  Radio,
  FormControlLabel,
  Checkbox,
  IconButton,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type Instruktur = {
  nama: string;
  sertifikasi: boolean;
};

type LaporanLpk = {
  jenis_pelatihan: string;
  waktu_pelatihan: any;
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

export default function ContentsJobVacancyForm() {
  const { lpkId } = useParams();
  const laporanRef = collection(db, `lpk/${lpkId}/laporan`);
  const router = useRouter();

  const [formData, setFormData] = useState<LaporanLpk>({
    jenis_pelatihan: '',
    waktu_pelatihan: Timestamp.now(),
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
  const [errors, setErrors] = useState<Partial<LaporanLpk>>({});
  const [instrukturErrors, setInstrukturErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

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

  const handleInstrukturChange = (index: number, field: keyof Instruktur, value: any) => {
    const newInstruktur = [...formData.instruktur];
    newInstruktur[index] = { ...newInstruktur[index], [field]: value };
    setFormData(prev => ({ ...prev, instruktur: newInstruktur }));
  };

  const addInstruktur = () => {
    setFormData(prev => ({
      ...prev,
      instruktur: [...prev.instruktur, { nama: '', sertifikasi: false }]
    }));
  };

  const removeInstruktur = (index: number) => {
    if (formData.instruktur.length > 1) {
      const newInstruktur = [...formData.instruktur];
      newInstruktur.splice(index, 1);
      setFormData(prev => ({ ...prev, instruktur: newInstruktur }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Validasi
    const newErrors: any = {};
    const newInstrukturErrors: string[] = [];
    if (!formData.jenis_pelatihan) newErrors.jenis_pelatihan = 'Jenis pelatihan harus diisi';
    if (!waktuPelatihanStr) newErrors.waktu_pelatihan = 'Waktu pelatihan harus diisi';
    if (!formData.jurusan) newErrors.jurusan = 'Jurusan harus diisi';
    
    formData.instruktur.forEach((inst, i) => {
      if (!inst.nama) {
        newInstrukturErrors[i] = `Nama instruktur #${i + 1} harus diisi`;
      } else {
        newInstrukturErrors[i] = '';
      }
    });

    setErrors(newErrors);
    setInstrukturErrors(newInstrukturErrors);
    if (Object.keys(newErrors).length > 0 || newInstrukturErrors.some(Boolean)) {
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(laporanRef, {
        ...formData,
        waktu_pelatihan: Timestamp.fromDate(new Date(waktuPelatihanStr)),
      });
      alert('Laporan berhasil ditambahkan');
      router.push(`/dashboard/lpk/${lpkId}/laporan/laporanLpk`);
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={1}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Tambah Laporan LPK
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
            
            {/* Jumlah Pendaftar */}
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
            
            {/* Jumlah Lulus */}
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
            
            {/* Instruktur */}
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
            
            {/* Statistik Kelulusan */}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Laporan'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}