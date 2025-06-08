'use client';

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useParams } from 'next/navigation';
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
} from '@mui/material';
import { PesertaLpk } from '@/models/LPK';
import { useRouter } from 'next/navigation';

export default function ContentsJobVacancyForm() {
  const { lpkId } = useParams();
  const pesertaRef = collection(db, `lpk/${lpkId}/peserta`);

  const [formData, setFormData] = useState<PesertaLpk>({
    nama: '',
    lpk: 0,
    jurusan: '',
    jenis_kelamin: false,
    tanggal_lahir: Timestamp.now(),
    kontak: { alamat_tinggal: '', email: '', nomor_hp: '' },
    tanggal_daftar: Timestamp.now(),
    lulus: false,
    isDelete: false,
  });

  const [tanggalLahirStr, setTanggalLahirStr] = useState<string>('');
  const [tanggalDaftarStr, setTanggalDaftarStr] = useState<string>('');
  const [errors, setErrors] = useState<Partial<PesertaLpk>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lpk' ? Number(value) : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: any = {};
    if (!formData.nama) newErrors.nama = 'Nama harus diisi';
    if (!formData.lpk) newErrors.lpk = 'Nomor LPK harus diisi';
    if (!formData.jurusan) newErrors.jurusan = 'Jurusan harus diisi';
    if (!tanggalLahirStr) newErrors.tanggal_lahir = 'Tanggal lahir harus diisi';
    if (!formData.kontak.alamat_tinggal) newErrors.kontak = { ...(newErrors.kontak || {}), alamat_tinggal: 'Alamat tinggal harus diisi' };
    if (!formData.kontak.email) newErrors.kontak = { ...(newErrors.kontak || {}), email: 'Email harus diisi' };
    if (!formData.kontak.nomor_hp) newErrors.kontak = { ...(newErrors.kontak || {}), nomor_hp: 'Nomor HP harus diisi' };
    if (!tanggalDaftarStr) newErrors.tanggal_daftar = 'Tanggal daftar harus diisi';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(pesertaRef, {
        ...formData,
        tanggal_lahir: Timestamp.fromDate(new Date(tanggalLahirStr)),
        tanggal_daftar: Timestamp.fromDate(new Date(tanggalDaftarStr)),
        isDelete: false,
      });
      alert('Peserta berhasil ditambahkan');
      router.push(`/dashboard/disnaker/lpk/${lpkId}/akun`);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={1}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Tambah Peserta LPK
          </Typography>
        </Box>       
        <Divider sx={{ mb: 3 }} />
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
                  control={
                    <Radio
                      checked={formData.jenis_kelamin === true}
                      onChange={() => setFormData(prev => ({ ...prev, jenis_kelamin: true }))}
                    />
                  }
                  label="Pria"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.jenis_kelamin === false}
                      onChange={() => setFormData(prev => ({ ...prev, jenis_kelamin: false }))}
                    />
                  }
                  label="Wanita"
                />
              </Box>
            </Box>
            <TextField
              label="Tanggal Lahir"
              type="date"
              value={tanggalLahirStr}
              onChange={e => setTanggalLahirStr(e.target.value)}
              error={!!errors.tanggal_lahir}
              helperText={typeof errors.tanggal_lahir === 'string' ? errors.tanggal_lahir : ''}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Alamat Tinggal"
              name="alamat_tinggal"
              value={formData.kontak.alamat_tinggal}
              onChange={e => setFormData(prev => ({ ...prev, kontak: { ...prev.kontak, alamat_tinggal: e.target.value } }))}
              error={!!errors.kontak?.alamat_tinggal}
              helperText={errors.kontak?.alamat_tinggal}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.kontak.email}
              onChange={e => setFormData(prev => ({ ...prev, kontak: { ...prev.kontak, email: e.target.value } }))}
              error={!!errors.kontak?.email}
              helperText={errors.kontak?.email}
              fullWidth
            />
            <TextField
              label="Nomor HP"
              name="nomor_hp"
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
                  control={
                    <Radio
                      checked={formData.lulus === true}
                      onChange={() => setFormData(prev => ({ ...prev, lulus: true }))}
                    />
                  }
                  label="Telah Lulus"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.lulus === false}
                      onChange={() => setFormData(prev => ({ ...prev, lulus: false }))}
                    />
                  }
                  label="Belum Lulus"
                />
              </Box>
            </Box>
            <TextField
              label="Tanggal Daftar"
              type="date"
              value={tanggalDaftarStr}
              onChange={e => setTanggalDaftarStr(e.target.value)}
              error={!!errors.tanggal_daftar}
              helperText={typeof errors.tanggal_daftar === 'string' ? errors.tanggal_daftar : undefined}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
