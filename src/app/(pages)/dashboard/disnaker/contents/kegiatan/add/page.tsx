'use client';

import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Stack, 
  Divider, 
  Card, 
  Container,
  FormControl,
  InputLabel,
  FormHelperText 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { id } from 'date-fns/locale'; // Indonesian locale
import { Kegiatan } from '@/models/Kegiatan';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// npm install @mui/x-date-pickers @date-io/date-fns date-fns

export default function AddKontenKegiatanPage() {
  const docRef = collection(db, "Kegiatan");
  const [formData, setFormData] = useState<Kegiatan>({
    Judul: "",
    Deskripsi: "",
    ImageDesc: "",
    ImageSampul: "",
    Tanggal: null,
    link: "",
    isDelete: false
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Partial<Kegiatan & {TanggalError: string}>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    setErrors({
      ...errors,
      TanggalError: "",
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'ImageSampul' | 'ImageDesc'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formDataImg = new FormData();
    formDataImg.append('file', file);
    formDataImg.append('upload_preset', 'kegiatan_upload'); // <- Ganti dengan Upload Preset Anda
    formDataImg.append('cloud_name', 'mycloud123'); // <- Ganti dengan Cloud Name Anda

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/mycloud123/image/upload', {
        method: 'POST',
        body: formDataImg,
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          [field]: data.secure_url,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    const newErrors: any = {};
    if (!formData.Judul) newErrors.Judul = "Judul harus diisi";
    if (!formData.ImageSampul) newErrors.ImageSampul = "Gambar Sampul harus diisi";
    if (!formData.ImageDesc) newErrors.ImageDesc = "Dokumentasi kegiatan harus diisi";
    if (!formData.Deskripsi) newErrors.Deskripsi = "Deskripsi harus diisi";
    if (!selectedDate) newErrors.TanggalError = "Tanggal kegiatan harus diisi";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      setIsUploading(false);
      return;
    }

    try {
      const kegiatanSnapshot = await getDocs(docRef);
      let new_id = 1;
      if (!kegiatanSnapshot.empty) {
        const maxId = kegiatanSnapshot.docs.reduce((max, doc) => {
          const idNumber = parseInt(doc.id, 10);
          return idNumber > max ? idNumber : max;
        }, 0);
        new_id = maxId + 1;
      }

      // Create Timestamp from the selected date
      const firestoreTimestamp = selectedDate ? Timestamp.fromDate(selectedDate) : Timestamp.now();

      const data = {
        ...formData,
        Tanggal: firestoreTimestamp,
        isDelete: false,
        link: formData.link || ""
      };

      await setDoc(doc(docRef, String(new_id)), data);
      alert("Konten Kegiatan Berhasil Ditambahkan");
      console.log("Form data:", data);
    } catch (e) {
      console.error("Error adding document:", e);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Tambah Konten Kegiatan
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3 
        }}>
          <Stack spacing={3}>
            {/* Judul Konten */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Judul Konten
              </Typography>
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
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
            </Box>

            {/* Deskripsi Kegiatan */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Deskripsi Kegiatan
              </Typography>
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
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
            </Box>

            {/* Tanggal Kegiatan */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Tanggal Kegiatan
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                <DateTimePicker 
                  label="Pilih Tanggal dan Waktu"
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{ 
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
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
            </Box>
          </Stack>

          <Divider sx={{ my: 1 }} />

          {/* Gambar Sampul */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Gambar Sampul
            </Typography>
            <Box sx={{ 
              border: '1px dashed',
              borderColor: errors.ImageSampul ? 'error.main' : 'divider',
              p: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'background.paper'
            }}>
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<CloudUploadIcon />}
                sx={{ 
                  textTransform: 'none', 
                  px: 3,
                  py: 1.5,
                  borderRadius: 1.5,
                  mb: 2
                }}
              >
                Pilih File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'ImageSampul')}
                  hidden
                />
              </Button>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: formData.ImageSampul ? 'success.main' : 'text.secondary'
              }}>
                {formData.ImageSampul ? (
                  <>
                    <CheckCircleOutlineIcon fontSize="small" />
                    <Typography variant="body2">
                      Gambar Sampul telah diupload!
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2">
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
              </Box>
              {!!errors.ImageSampul && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.ImageSampul}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Gambar Kegiatan */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Gambar Kegiatan
            </Typography>
            <Box sx={{ 
              border: '1px dashed',
              borderColor: errors.ImageDesc ? 'error.main' : 'divider',
              p: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'background.paper'
            }}>
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<CloudUploadIcon />}
                sx={{ 
                  textTransform: 'none', 
                  px: 3,
                  py: 1.5,
                  borderRadius: 1.5,
                  mb: 2
                }}
              >
                Pilih File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'ImageDesc')}
                  hidden
                />
              </Button>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: formData.ImageDesc ? 'success.main' : 'text.secondary'
              }}>
                {formData.ImageDesc ? (
                  <>
                    <CheckCircleOutlineIcon fontSize="small" />
                    <Typography variant="body2">
                      Gambar Kegiatan telah diupload!
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2">
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
              </Box>
              {!!errors.ImageDesc && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.ImageDesc}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Submit Button */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || isUploading}
              sx={{ 
                minWidth: '150px', 
                py: 1.5,
                px: 4,
                borderRadius: 1.5,
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
              startIcon={isSubmitting || isUploading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Mengirim...' : 'SUBMIT'}
            </Button>
            {isUploading && (
              <Typography variant="caption" sx={{ ml: 2, alignSelf: 'center', color: 'text.secondary' }}>
                Sedang mengunggah gambar...
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Container>
  );
}