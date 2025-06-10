'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
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
  Radio,
  CircularProgress
} from '@mui/material';
import { PesertaLpk } from '@/models/LPK';

export default function EditAkunPage() {
  const router = useRouter();
  const { lpkId, id } = useParams();

  const [formData, setFormData] = useState<PesertaLpk>({
    nama: '',
    lpk: 0,
    jurusan: '',
    jenis_kelamin: false,
    tanggal_lahir: null,
    kontak: { alamat_tinggal: '', email: '', nomor_hp: '' },
    tanggal_daftar: null,
    lulus: false,
    isDelete: false
  });
  const [errors, setErrors] = useState<Partial<PesertaLpk>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lpkId || !id) {
      setLoading(false);
      return;
    }
    (async () => {
      if (typeof lpkId === 'string' && typeof id === 'string') {
        const ref = doc(db, `lpk/${String(lpkId)}/peserta`, String(id));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as PesertaLpk;
        setFormData({
          nama: data.nama || '',
          lpk: data.lpk || 0,
          jurusan: data.jurusan || '',
          jenis_kelamin: data.jenis_kelamin ?? false,
          tanggal_lahir: data.tanggal_lahir ?? null,
          kontak: data.kontak || { alamat_tinggal: '', email: '', nomor_hp: '' },
          tanggal_daftar: data.tanggal_daftar ?? null,
          lulus: data.lulus ?? false,
          isDelete: false
        });
      }
      setLoading(false);
      }
    })();
  }, [lpkId, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'lpk' ? Number(value) : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleGender = (val: boolean) => {
    setFormData(prev => ({ ...prev, jenis_kelamin: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: any = {};
    if (!formData.nama) newErrors.nama = 'Nama harus diisi';
    if (!formData.lpk) newErrors.lpk = 'Nomor LPK harus diisi';
    if (!formData.jurusan) newErrors.jurusan = 'Jurusan harus diisi';
    if (!formData.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir harus diisi';
    if (!formData.kontak.alamat_tinggal) newErrors.kontak = { ...(newErrors.kontak || {}), alamat_tinggal: 'Alamat tinggal harus diisi' };
    if (!formData.kontak.email) newErrors.kontak = { ...(newErrors.kontak || {}), email: 'Email harus diisi' };
    if (!formData.kontak.nomor_hp) newErrors.kontak = { ...(newErrors.kontak || {}), nomor_hp: 'Nomor HP harus diisi' };
    if (!formData.tanggal_daftar) newErrors.tanggal_daftar = 'Tanggal daftar harus diisi';

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      setIsSubmitting(false);
      return;
    }

    if (!lpkId || !id) return;
    try {
      const ref = doc(db, `lpk/${String(lpkId)}/peserta`, String(id));
      await updateDoc(ref, {
        ...formData,
        tanggal_lahir: formData.tanggal_lahir instanceof Timestamp ? formData.tanggal_lahir : formData.tanggal_lahir ? Timestamp.fromDate(new Date(formData.tanggal_lahir)) : null,
        tanggal_daftar: formData.tanggal_daftar instanceof Timestamp ? formData.tanggal_daftar : formData.tanggal_daftar ? Timestamp.fromDate(new Date(formData.tanggal_daftar)) : null
      });
      alert('Akun berhasil diupdate');
      router.back();
    } catch (err) {
      console.error('Update error:', err);
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
            Edit Peserta LPK
          </Typography>
        </Box>
        <Divider />
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Nama Peserta"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              error={!!errors.nama}
              helperText={errors.nama}
              fullWidth
            />
            <TextField
              label="Nomor LPK"
              name="lpk"
              type="number"
              value={formData.lpk}
              onChange={handleChange}
              error={!!errors.lpk}
              helperText={errors.lpk}
              fullWidth
            />
            <TextField
              label="Jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              error={!!errors.jurusan}
              helperText={errors.jurusan}
              fullWidth
            />
            <Box>
              <Typography variant="subtitle1">Jenis Kelamin</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <FormControlLabel
                  control={<Radio checked={formData.jenis_kelamin} onChange={() => toggleGender(true)} />}
                  label="Pria"
                />
                <FormControlLabel
                  control={<Radio checked={!formData.jenis_kelamin} onChange={() => toggleGender(false)} />}
                  label="Wanita"
                />
              </Box>
            </Box>
            <TextField
              label="Tanggal Lahir"
              type="date"
              value={
                formData.tanggal_lahir instanceof Timestamp
                  ? formData.tanggal_lahir.toDate().toISOString().split('T')[0]
                  : formData.tanggal_lahir || ''
              }
              onChange={e => setFormData(prev => ({
                ...prev,
                tanggal_lahir: e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null
              }))}
              InputLabelProps={{ shrink: true }}
              error={!!errors.tanggal_lahir}
              helperText={typeof errors.tanggal_lahir === 'string' ? errors.tanggal_lahir : undefined}
              fullWidth
            />
            <TextField
              label="Alamat Tinggal"
              value={formData.kontak.alamat_tinggal}
              onChange={e => setFormData(prev => ({ ...prev, kontak: { ...prev.kontak, alamat_tinggal: e.target.value } }))}
              error={!!errors.kontak?.alamat_tinggal}
              helperText={errors.kontak?.alamat_tinggal}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.kontak.email}
              onChange={e => setFormData(prev => ({ ...prev, kontak: { ...prev.kontak, email: e.target.value } }))}
              error={!!errors.kontak?.email}
              helperText={errors.kontak?.email}
              fullWidth
            />
            <TextField
              label="Nomor HP"
              value={formData.kontak.nomor_hp}
              onChange={e => setFormData(prev => ({ ...prev, kontak: { ...prev.kontak, nomor_hp: e.target.value } }))}
              error={!!errors.kontak?.nomor_hp}
              helperText={errors.kontak?.nomor_hp}
              fullWidth
            />
            <Box>
              <Typography variant="subtitle1">Kelulusan</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <FormControlLabel
                  control={<Radio checked={formData.lulus} onChange={() => setFormData(prev => ({ ...prev, lulus: true }))} />}
                  label="Telah Lulus"
                />
                <FormControlLabel
                  control={<Radio checked={!formData.lulus} onChange={() => setFormData(prev => ({ ...prev, lulus: false }))} />}
                  label="Belum Lulus"
                />
              </Box>
            </Box>
            <TextField
              label="Tanggal Daftar"
              type="date"
              value={
                formData.tanggal_daftar instanceof Timestamp
                  ? formData.tanggal_daftar.toDate().toISOString().split('T')[0]
                  : formData.tanggal_daftar || ''
              }
              onChange={e => setFormData(prev => ({
                ...prev,
                tanggal_daftar: e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null
              }))}
              InputLabelProps={{ shrink: true }}
              error={!!errors.tanggal_daftar}
              helperText={typeof errors.tanggal_daftar === 'string' ? errors.tanggal_daftar : undefined}
              fullWidth
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Edit'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}