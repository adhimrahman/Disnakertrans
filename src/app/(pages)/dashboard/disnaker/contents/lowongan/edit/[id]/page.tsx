'use client';

import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Card,
  Box,
  Divider,
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { id as localeID } from 'date-fns/locale';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { IoTrash } from 'react-icons/io5';
import { GoPlus } from 'react-icons/go';
import { Lowongan } from '@/models/Lowongan';

export default function EditLowonganKerjaPage() {
  const router = useRouter();
  const { id } = useParams();
  const lowonganRef = collection(db, 'lowongan');

  const [formData, setFormData] = useState<Lowongan>({
    Judul: '',
    nama_lowongan: '',
    BatasLowongan: null,
    LinkLowongan: '',
    Tipe: [],
    Deskripsi: '',
    Perusahaan: '',
    Alamat: '',
    Syarat: [],
    Range: { min: 0, max: 0 },
    tanggal_unggah: null,
    link_konten: null,
    ImageSampul: '',
    isDelete: false
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newSyarat, setNewSyarat] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Lowongan & { TanggalError: string }>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load existing lowongan data
  useEffect(() => {
    if (!id) return;
    (async () => {
      const snap = await getDoc(doc(db, 'lowongan', id as string));
      if (snap.exists()) {
        const data = snap.data() as Lowongan;
        setFormData({
          ...data,
          BatasLowongan: data.BatasLowongan ?? null,
          ImageSampul: data.ImageSampul || ''
        });
        if (data.BatasLowongan instanceof Timestamp) {
          setSelectedDate(data.BatasLowongan.toDate());
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      BatasLowongan: date ? Timestamp.fromDate(date) : null
    }));
    setErrors(prev => ({ ...prev, TanggalError: '' }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'kegiatan_upload');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/disnakertrans-sulsel/image/upload',
        { method: 'POST', body: fd }
      );
      const json = await response.json();
      if (json.secure_url) {
        setFormData(prev => ({ ...prev, ImageSampul: json.secure_url }));
      } else {
        setUploadError('Upload gagal, cek preset Cloudinary');
      }
    } catch {
      setUploadError('Kesalahan upload gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      Tipe: checked
        ? [...prev.Tipe, name]
        : prev.Tipe.filter(t => t !== name)
    }));
  };

  const handleAddSyarat = () => {
    if (newSyarat.trim()) {
      setFormData(prev => ({ ...prev, Syarat: [...prev.Syarat, newSyarat.trim()] }));
      setNewSyarat('');
    }
  };

  const handleRemoveSyarat = (idx: number) => {
    setFormData(prev => ({ ...prev, Syarat: prev.Syarat.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation: any = {};
    if (!formData.Judul) validation.Judul = 'Judul harus diisi';
    if (!formData.nama_lowongan) validation.nama_lowongan = 'Nama lowongan harus diisi';
    if (!selectedDate) validation.TanggalError = 'Tanggal batas harus dipilih';
    if (!formData.ImageSampul) validation.ImageSampul = 'Upload gambar sampul';
    if (!formData.Deskripsi) validation.Deskripsi = 'Deskripsi harus diisi';
    if (formData.Tipe.length === 0) validation.Tipe = 'Pilih tipe pekerjaan';
    if (formData.Syarat.length === 0) validation.Syarat = 'Tambah syarat minimal satu';
    if (!formData.Perusahaan) validation.Perusahaan = 'Nama perusahaan kosong';
    if (!formData.Alamat) validation.Alamat = 'Alamat perusahaan kosong';
    if (!formData.LinkLowongan) validation.LinkLowongan = 'Link lowongan kosong';
    if (!formData.Range.min) validation.Range = { ...(validation.Range || {}), min: 'Gaji min harus diisi' };
    if (!formData.Range.max) validation.Range = { ...(validation.Range || {}), max: 'Gaji max harus diisi' };

    setErrors(validation);
    if (Object.keys(validation).length) {
      setIsSubmitting(false);
      return;
    }

    if (!id) return;

    try {
      await updateDoc(doc(db, 'lowongan', id as string), {
        ...formData,
        BatasLowongan: formData.BatasLowongan,
        tanggal_unggah: formData.tanggal_unggah
      });
      router.push('/dashboard/disnaker/contents/lowongan');
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" pt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Lowongan Kerja
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack spacing={2}>
            {/* Judul */}
            <TextField
              label="Judul Konten"
              name="Judul"
              value={formData.Judul}
              onChange={handleChange}
              error={!!errors.Judul}
              helperText={errors.Judul}
              fullWidth
            />
            {/* Nama Lowongan */}
            <TextField
              label="Nama Lowongan"
              name="nama_lowongan"
              value={formData.nama_lowongan}
              onChange={handleChange}
              error={!!errors.nama_lowongan}
              helperText={errors.nama_lowongan}
              fullWidth
            />
            {/* Batas Lowongan */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeID}>
              <DateTimePicker
                label="Batas Lowongan"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{ textField: { error: !!errors.TanggalError, helperText: errors.TanggalError, fullWidth: true } }}
              />
            </LocalizationProvider>
            {/* Gambar Sampul */}
            <Box>
              <Button component="label" startIcon={<CloudUploadIcon />}>Upload Sampul
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>
              {isUploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
              {formData.ImageSampul && <Box display="flex" alignItems="center" mt={1}><CheckCircleOutlineIcon color="success"/><Typography ml={1}>Sampul terupload</Typography></Box>}
              {!!errors.ImageSampul && <Typography color="error" variant="caption">{errors.ImageSampul}</Typography>}
            </Box>
            {/* Deskripsi */}
            <TextField
              label="Deskripsi Pekerjaan"
              name="Deskripsi"
              value={formData.Deskripsi}
              onChange={handleChange}
              error={!!errors.Deskripsi}
              helperText={errors.Deskripsi}
              multiline
              rows={4}
              fullWidth
            />
            {/* Range Gaji */}
            <Box display="flex" gap={2}>
              <TextField label="Gaji Min" type="number" value={formData.Range.min} onChange={e => setFormData(prev => ({...prev, Range: {...prev.Range, min:Number(e.target.value)}}))} error={!!errors.Range?.min} helperText={errors.Range?.min} fullWidth />
              <TextField label="Gaji Max" type="number" value={formData.Range.max} onChange={e => setFormData(prev => ({...prev, Range: {...prev.Range, max:Number(e.target.value)}}))} error={!!errors.Range?.max} helperText={errors.Range?.max} fullWidth />
            </Box>
            {/* Tipe */}
            <Box>
              <Typography>Tipe Pekerjaan</Typography>
              <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                {['Tetap','Freelance','Kontrak','Paruh Waktu','Magang'].map(type => (
                  <Box key={type} display="flex" alignItems="center" gap={1}>
                    <input type="checkbox" name={type} checked={formData.Tipe.includes(type)} onChange={handleCheckbox} />
                    <Typography>{type}</Typography>
                  </Box>
                ))}
              </Box>
              {!!errors.Tipe && <Typography color="error" variant="caption">{errors.Tipe}</Typography>}
            </Box>
            {/* Syarat */}
            <Box>
              <Typography>Syarat Pekerjaan</Typography>
              <Box display="flex" gap={1} mt={1}>
                <TextField placeholder="Tambah syarat" value={newSyarat} onChange={e => setNewSyarat(e.target.value)} fullWidth />
                <Button onClick={handleAddSyarat}><GoPlus /></Button>
              </Box>
              <Box mt={1}>
                {formData.Syarat.map((s,i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Typography>{s}</Typography>
                    <Button onClick={() => handleRemoveSyarat(i)}><IoTrash /></Button>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Perusahaan, Alamat, Link */}
            <TextField label="Perusahaan" name="Perusahaan" value={formData.Perusahaan} onChange={handleChange} error={!!errors.Perusahaan} helperText={errors.Perusahaan} fullWidth />
            <TextField label="Alamat" name="Alamat" value={formData.Alamat} onChange={handleChange} error={!!errors.Alamat} helperText={errors.Alamat} fullWidth />
            <TextField label="Link Lowongan" name="LinkLowongan" type="url" value={formData.LinkLowongan} onChange={handleChange} error={!!errors.LinkLowongan} helperText={errors.LinkLowongan} fullWidth />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting && <CircularProgress size={16} color="inherit" />}>
              {isSubmitting ? 'Menyimpan...' : 'Edit'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}

