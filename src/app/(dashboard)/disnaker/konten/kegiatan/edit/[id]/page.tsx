'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Divider, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { getKegiatanById, updateKegiatan } from '@/firebase/utils/kegiatan-service';
import { uploadKegiatanImage } from '@/firebase/uploadToStorage';
import { updateKegiatanSchema } from '@/validation/kegiatan-validation';
import UpdateKegiatanTextFields from '@/components/dashboard/kegiatan/KegiatanTextFields';
import UpdateKegiatanUploadFields from '@/components/dashboard/kegiatan/KegiatanUploadFields';

interface FieldError {
  _errors: string[];
}

export default function UpdateKontenKegiatanPage() {
  const [formData, setFormData] = useState<{
    judul: string;
    deskripsi: string;
    gambar_sampul: string;
    gambar_kegiatan: string;
    tanggal_kegiatan: string;
    id?: string;
  }>({
    judul: '',
    deskripsi: '',
    gambar_sampul: '',
    gambar_kegiatan: '',
    tanggal_kegiatan: '',
  });
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [files, setFiles] = useState<{ gambar_sampul?: File; gambar_kegiatan?: File[] }>({});
  const [previews, setPreviews] = useState<{ gambar_sampul?: string; gambar_kegiatan?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchKegiatan() {
      const data = await getKegiatanById(id as string);
      if (data) {
        setFormData({
          id: id as string,
          judul: data.judul,
          deskripsi: data.deskripsi,
          gambar_sampul: data.gambar_sampul as string,
          gambar_kegiatan: data.gambar_kegiatan as string,
          tanggal_kegiatan: data.tanggal_kegiatan as string,
        });
      }
    }
    fetchKegiatan();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previews.gambar_sampul) URL.revokeObjectURL(previews.gambar_sampul);
      previews.gambar_kegiatan?.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: { _errors: [] } }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_sampul' | 'gambar_kegiatan') => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (field === 'gambar_kegiatan') {
      const filesArray = Array.from(e.target.files || []);
      if (filesArray.length > 5 || filesArray.some(file => file.size > MAX_FILE_SIZE)) {
        alert('Maksimal 5 gambar dan ukuran maksimal 2MB.');
        return;
      }
      setFiles(prev => ({ ...prev, gambar_kegiatan: filesArray }));
      setPreviews(prev => ({ ...prev, gambar_kegiatan: filesArray.map(f => URL.createObjectURL(f)) }));
    } else {
      const file = e.target.files?.[0];
      if (!file || file.size > MAX_FILE_SIZE) {
        alert('Ukuran file terlalu besar. Maksimum 2MB.');
        return;
      }
      setFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newFormData = { ...formData };
      if (files.gambar_sampul) {
        const uploaded = await uploadKegiatanImage(files.gambar_sampul);
        if (typeof uploaded === 'string') newFormData.gambar_sampul = uploaded;
      }
      if (files.gambar_kegiatan?.length) {
        const uploaded = await uploadKegiatanImage(files.gambar_kegiatan[0]);
        if (typeof uploaded === 'string') newFormData.gambar_kegiatan = uploaded;
      }
      const result = updateKegiatanSchema.safeParse(newFormData);
      if (!result.success) {
        const formatted = result.error.format() as unknown as Record<string, FieldError>;
        setErrors(formatted);
        return;
      }
      const success = await updateKegiatan(newFormData, {});
      if (success) {
        alert('Kegiatan berhasil diperbarui!');
        router.push('/disnaker/konten/kegiatan');
      } else {
        alert('Konten Kegiatan gagal diperbarui!');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat memperbarui data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
          <Typography variant="h5" fontWeight="bold">Tambah Konten Kegiatan</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stack spacing={3}>
            <UpdateKegiatanTextFields formData={formData} handleChange={handleChange} errors={errors} />
          </Stack>
          <Divider sx={{ my: 1 }} />
          <UpdateKegiatanUploadFields
            previews={previews}
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />
          <Divider sx={{ my: 1 }} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ minWidth: '150px', py: 1.5, px: 4, borderRadius: 1.5, textTransform: 'uppercase', fontWeight: 'bold' }}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Mengirim...' : 'SUBMIT'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}