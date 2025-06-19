'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import {
  Container, Card, Box, Divider, Stack, TextField, Button, Typography, Grid, CircularProgress
} from '@mui/material';

export default function EditLaporanPage() {
  const router = useRouter();
  const { lpkId, id } = useParams();

  const [formData, setFormData] = useState({
    jenis_pelatihan: '',
    nama_lembaga: '',
    keterangan: '',
    tanggal_pelaksanaan: '',
    jumlah_pendaftar: 0,
    jumlah_lulus: 0,
    jumlah_peserta_sertifikat: 0,
    jumlah_dilatih: 0,
    jumlah_bekerja: 0,
    jumlah_instruktur: 0,
    jumlah_instruktur_sertifikat: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const laporanRef = doc(db, `laporan/${id}`);
        const docSnap = await getDoc(laporanRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            jenis_pelatihan: data.jenis_pelatihan || '',
            nama_lembaga: data.nama_lembaga || '',
            keterangan: data.keterangan || '',
            tanggal_pelaksanaan: data.tanggal_pelaksanaan?.toDate().toISOString().split('T')[0] || '',
            jumlah_pendaftar: data.peserta?.jumlah_pendaftar || 0,
            jumlah_lulus: data.peserta?.jumlah_lulus || 0,
            jumlah_peserta_sertifikat: data.peserta?.jumlah_peserta_sertifikat || 0,
            jumlah_dilatih: data.peserta?.jumlah_dilatih || 0,
            jumlah_bekerja: data.peserta?.jumlah_bekerja || 0,
            jumlah_instruktur: data.instruktur?.jumlah_instruktur || 0,
            jumlah_instruktur_sertifikat: data.instruktur?.jumlah_instruktur_sertifikat || 0,
          });
        } else {
          alert('Data tidak ditemukan!');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const laporanRef = doc(db, `laporan/${id}`);
      await updateDoc(laporanRef, {
        jenis_pelatihan: formData.jenis_pelatihan,
        nama_lembaga: formData.nama_lembaga,
        keterangan: formData.keterangan,
        tanggal_pelaksanaan: Timestamp.fromDate(new Date(formData.tanggal_pelaksanaan)),
        peserta: {
          jumlah_pendaftar: Number(formData.jumlah_pendaftar),
          jumlah_lulus: Number(formData.jumlah_lulus),
          jumlah_peserta_sertifikat: Number(formData.jumlah_peserta_sertifikat),
          jumlah_dilatih: Number(formData.jumlah_dilatih),
          jumlah_bekerja: Number(formData.jumlah_bekerja),
        },
        instruktur: {
          jumlah_instruktur: Number(formData.jumlah_instruktur),
          jumlah_instruktur_sertifikat: Number(formData.jumlah_instruktur_sertifikat),
        },
        updated_at: Timestamp.now(),
      });
      alert('Data berhasil diperbarui');
      router.push(`/lembaga/${lpkId}/laporan`);
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
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
            <TextField label="Jenis Pelatihan" name="jenis_pelatihan" value={formData.jenis_pelatihan} onChange={handleChange} fullWidth required />
            <TextField label="Nama Lembaga" name="nama_lembaga" value={formData.nama_lembaga} onChange={handleChange} fullWidth required />
            <TextField label="Keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} fullWidth required />
            <TextField type="date" label="Tanggal Pelaksanaan" name="tanggal_pelaksanaan" value={formData.tanggal_pelaksanaan} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />

            <Typography variant="subtitle1">Peserta</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Jumlah Pendaftar" name="jumlah_pendaftar" type="number" value={formData.jumlah_pendaftar} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6}><TextField label="Jumlah Lulus" name="jumlah_lulus" type="number" value={formData.jumlah_lulus} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={4}><TextField label="Peserta Sertifikat" name="jumlah_peserta_sertifikat" type="number" value={formData.jumlah_peserta_sertifikat} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={4}><TextField label="Jumlah Dilatih" name="jumlah_dilatih" type="number" value={formData.jumlah_dilatih} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={4}><TextField label="Jumlah Bekerja" name="jumlah_bekerja" type="number" value={formData.jumlah_bekerja} onChange={handleChange} fullWidth /></Grid>
            </Grid>

            <Typography variant="subtitle1">Instruktur</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Jumlah Instruktur" name="jumlah_instruktur" type="number" value={formData.jumlah_instruktur} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6}><TextField label="Instruktur Sertifikat" name="jumlah_instruktur_sertifikat" type="number" value={formData.jumlah_instruktur_sertifikat} onChange={handleChange} fullWidth /></Grid>
            </Grid>
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Perbarui Laporan'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
