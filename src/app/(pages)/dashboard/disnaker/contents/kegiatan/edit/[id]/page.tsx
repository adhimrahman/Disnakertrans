'use client';

import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { useParams } from 'next/navigation';
import { TextField, Button, Card, Container, Divider, CircularProgress, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { id as localeId } from 'date-fns/locale';
import { Kegiatan } from '@/models/Kegiatan';

export default function EditKontenKegiatanPage() {
  const [formData, setFormData] = useState<Kegiatan>({
    Judul: "",
    Deskripsi: "",
    ImageDesc: "",
    ImageSampul: "",
    Tanggal: null,
    link: null,
    isDelete: false
  });

  const [errors, setErrors] = useState<Partial<Kegiatan & {TanggalError: string}>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchKegiatan() {
      if (!id) return;
      const docRef = doc(db, "Kegiatan", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          Judul: data.Judul || '',
          Deskripsi: data.Deskripsi || '',
          ImageSampul: data.ImageSampul || '',
          ImageDesc: data.ImageDesc || '',
          Tanggal: data.Tanggal || Timestamp.now(),
          link: data.link || '',
          isDelete: false
        });
        setSelectedDate(data.Tanggal?.toDate ? data.Tanggal.toDate() : null);
      }
    }
    fetchKegiatan();
  }, [id]);

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    setFormData((prev) => ({
      ...prev,
      Tanggal: newDate ? Timestamp.fromDate(newDate) : null,
    }));
    setErrors((prev) => ({ ...prev, TanggalError: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    const newErrors: Partial<Kegiatan & {TanggalError: string}> = {};

    if (!formData.Judul) newErrors.Judul = "Judul harus diisi";
    if (!formData.ImageSampul) newErrors.ImageSampul = "Gambar Sampul kegiatan harus diisi";
    if (!formData.ImageDesc) newErrors.ImageDesc = "Dokumentasi kegiatan harus diisi";
    if (!formData.Deskripsi) newErrors.Deskripsi = "Deskripsi harus diisi";
    if (!formData.link) newErrors.link = "Link lowongan harus diisi";

    setErrors(newErrors);

    try {
      const docRef = doc(db, "Kegiatan", id as string);
      await updateDoc(docRef, {
        ...formData,
      });

      alert("Konten Kegiatan berhasil diupdate!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ background: '#1976d2', color: 'white', padding: '16px 24px' }}>
          <h1 style={{ fontWeight: 'bold', fontSize: 24 }}>Edit Konten Kegiatan</h1>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Judul Konten</Typography>
            <TextField
              placeholder='Tuliskan judul konten kegiatan disini'
              name="Judul"
              value={formData.Judul}
              onChange={handleChange}
              error={!!errors.Judul}
              helperText={errors.Judul}
              fullWidth
              variant="outlined"
              size="medium"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Deskripsi Kegiatan</Typography>
            <TextField
              placeholder='Tuliskan deskripsi pekerjaan disini'
              name="Deskripsi"
              value={formData.Deskripsi}
              onChange={handleChange}
              error={!!errors.Deskripsi}
              helperText={errors.Deskripsi}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Tanggal Kegiatan</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeId}>
              <DateTimePicker
                label="Pilih Tanggal dan Waktu"
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    error: !!errors.TanggalError,
                    helperText: errors.TanggalError,
                    placeholder: 'DD/MM/YYYY HH:MM',
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <Divider sx={{ my: 1 }} />
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Gambar Sampul</Typography>
            <TextField
              placeholder='URL gambar sampul kegiatan'
              name="ImageSampul"
              value={formData.ImageSampul || ''}
              onChange={handleChange}
              error={!!errors.ImageSampul}
              helperText={errors.ImageSampul}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {formData.ImageSampul ? 'Gambar Sampul sudah ada.' : 'Belum ada gambar yang diunggah.'}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Gambar Kegiatan</Typography>
            <TextField
              placeholder='URL dokumentasi kegiatan'
              name="ImageDesc"
              value={formData.ImageDesc || ''}
              onChange={handleChange}
              error={!!errors.ImageDesc}
              helperText={errors.ImageDesc}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {formData.ImageDesc ? 'Gambar Kegiatan sudah ada.' : 'Belum ada gambar yang diunggah.'}
            </Typography>
          </div>
          <Divider sx={{ my: 1 }} />
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Link Unggahan</Typography>
            <TextField
              placeholder='Link unggahan kegiatan (opsional)'
              name="link"
              value={formData.link || ''}
              onChange={handleChange}
              error={!!errors.link}
              helperText={errors.link}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || isUploading}
              sx={{ minWidth: '150px', py: 1.5, px: 4, borderRadius: 1.5, textTransform: 'uppercase', fontWeight: 'bold' }}
              startIcon={isSubmitting || isUploading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Menyimpan...' : 'SIMPAN'}
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}