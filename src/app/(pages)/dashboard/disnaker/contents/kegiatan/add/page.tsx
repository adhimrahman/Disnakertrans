'use client';

import React, { useState } from 'react';
import { 
  TextField, Button, 
  Box, Typography, 
  CircularProgress, 
  Stack, Divider, 
  Card, Container,
} from '@mui/material';
// import { Kegiatan } from '@/models/Kegiatan';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { addKegiatan } from '@/firebase/utils/kegiatan-service';
import { createKegiatanFormData, createKegiatanSchema } from '@/validation/kegiatan-validation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AddKontenKegiatanPage() {
  const [formData, setFormData] = useState<createKegiatanFormData>({
    judul: "",
    deskripsi: "",
    gambar_sampul: "",
    gambar_kegiatan: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ gambar_sampul?: File; gambar_kegiatan?: File }>({});
  const [previews, setPreviews] = useState<{ gambar_sampul?: string; gambar_kegiatan?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: { _errors: [] },
    }));

    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_sampul' | 'gambar_kegiatan') => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    if (file && file.size > MAX_FILE_SIZE) {
      alert("Ukuran file terlalu besar. Maksimum 2 MB.");
      return;
    }

    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrors((prev: any) => ({
      ...prev,
      [field]: { _errors: [] },  // clear error properly
    }));
    }
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newFormData = {
      ...formData,
      gambar_sampul: previews.gambar_sampul || "",
      gambar_kegiatan: previews.gambar_kegiatan || ""
    }

    const result = createKegiatanSchema.safeParse(newFormData);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
    }

    try {
      const success = await addKegiatan(formData, files);
      if (success) {
        alert("Konten kegiatan berhasil ditambahkan!");
        router.push("/dashboard/disnaker/contents/kegiatan");
      } else {
        alert("Konten Kegiatan gagal ditambahkan! Mohon periksa kembali.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error("Error adding document:", e);
    } finally {
      setIsSubmitting(false);
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
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="medium"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
              {errors?.judul?._errors?.length > 0 && errors.judul._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            {/* Deskripsi Kegiatan */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Deskripsi Kegiatan
              </Typography>
              <TextField
                placeholder='Tuliskan deskripsi pekerjaan disini'
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
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
              {errors?.deskripsi?._errors?.length > 0 && errors.deskripsi._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
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
                  name='gambar_sampul'
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'gambar_sampul')}
                  hidden
                />
              </Button>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: formData.gambar_sampul ? 'success.main' : 'text.secondary'
              }}>
                {previews.gambar_sampul ? (
                  <div className='flex flex-col gap-y-3 items-center'>
                    <Image src={previews.gambar_sampul} alt="Preview Gambar Sampul" width={200} height={150} />
                    <div className='flex flex-row items-center gap-x-2'>
                      <CheckCircleOutlineIcon fontSize="small"  className='text-green-600'/>
                      <Typography variant="body2">
                        Gambar Sampul telah diupload!
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2">
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
              </Box>
              {errors?.gambar_sampul?._errors.length > 0 && (
                <Typography variant="caption" color="error" className='text-md text-red-700'>
                  {errors.gambar_sampul._errors[0]}
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
                  name='gambar_kegiatan'
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'gambar_kegiatan')}
                  hidden
                />
              </Button>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: formData.gambar_kegiatan ? 'success.main' : 'text.secondary'
              }}>
                {previews.gambar_kegiatan ? (
                  <div className='flex flex-col gap-y-3 items-center'>
                    <Image src={previews.gambar_kegiatan} alt="Preview Gambar Sampul" width={200} height={150} />
                    <div className='flex flex-row items-center gap-x-2'>
                      <CheckCircleOutlineIcon fontSize="small"  className='text-green-600'/>
                      <Typography variant="body2">
                        Gambar Sampul telah diupload!
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2">
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
              </Box>
              {errors?.gambar_kegiatan?._errors.length > 0 && (
              <Typography variant="caption" color="error" className='text-md text-red-700'>
                {errors.gambar_kegiatan._errors[0]}
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
              disabled={isSubmitting}
              sx={{ 
                minWidth: '150px', 
                py: 1.5,
                px: 4,
                borderRadius: 1.5,
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
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