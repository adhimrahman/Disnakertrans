'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Stack, Divider, Card, Container,} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getKegiatanById, updateKegiatan } from '@/firebase/utils/kegiatan-service';
import { updateKegiatanFormData, updateKegiatanSchema } from '@/validation/kegiatan-validation';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

export default function UpdateKontenKegiatanPage() {
  const [formData, setFormData] = useState<Partial<updateKegiatanFormData>>({
    Judul: "",
    Deskripsi: "",
    ImageSampul: "",
    ImageDesc: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ ImageSampul?: File; ImageDesc?: File }>({});
  const [previews, setPreviews] = useState<{ ImageSampul?: string; ImageDesc?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchKegiatan() {
      const data = await getKegiatanById(id as string);
      if (data) {
        setFormData({
          id: id as string,
          Judul: data.Judul,
          Deskripsi: data.Deskripsi,
          ImageSampul: data.ImageSampul as string,
          ImageDesc: data.ImageDesc as string
        });
      }
    }
    fetchKegiatan();
  }, [id]);

  useEffect(() => {
  return () => {
    if (previews.ImageSampul) URL.revokeObjectURL(previews.ImageSampul);
    if (previews.ImageDesc) URL.revokeObjectURL(previews.ImageDesc);
  };
}, [previews]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'ImageSampul' | 'ImageDesc') => {
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
      ImageSampul: previews.ImageSampul || formData.ImageSampul ||"",
      ImageDesc: previews.ImageDesc || formData.ImageDesc ||""
    }

    const result = updateKegiatanSchema.safeParse(newFormData);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
    }

    try {
      const success = await updateKegiatan(formData, files);
      if (success) {
        alert("Kegiatan berhasil diperbarui!");
        router.push("/dashboard/disnaker/contents/kegiatan");
      } else {
        alert("Konten Kegiatan gagal diperbarui! Mohon periksa kembali.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memperbarui data.");
      console.error("Error adding document:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageSampulSrc = previews.ImageSampul || formData.ImageSampul || "";
  const imageKegiatanSrc = previews.ImageDesc || formData.ImageDesc || "";

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
                value={formData.Judul || ""}
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
              {errors?.Judul?._errors?.length > 0 && errors.Judul._errors.map((msg: string, i: number) => (
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
                name="Deskripsi"
                value={formData.Deskripsi || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
              {errors?.Deskripsi?._errors?.length > 0 && errors.Deskripsi._errors.map((msg: string, i: number) => (
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
                  name='ImageSampul'
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'ImageSampul')}
                  hidden
                />
              </Button>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: formData.ImageSampul ? 'success.main' : 'text.secondary'
              }}>
                {(previews.ImageSampul || formData.ImageSampul) ? (
                  <div className='flex flex-col gap-y-3 items-center'>
                    <Image src={imageSampulSrc} alt="Preview Gambar Sampul" width={200} height={150} />
                    <div className='flex flex-row items-center gap-x-2'>
                      <CheckCircleOutlineIcon fontSize="small"  className='text-green-600'/>
                      <Typography variant="body2">
                        Gambar Sampul telah diupload!
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2" className='text-center text-red-600'>
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
              </Box>
              {errors?.ImageSampul?._errors.length > 0 && (
                <Typography variant="caption" color="error" className='text-md text-red-700'>
                  {errors.ImageSampul._errors[0]}
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
                  name='ImageDesc'
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'ImageDesc')}
                  hidden
                />
              </Button>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: formData.ImageDesc ? 'success.main' : 'text.secondary'
              }}>
                {(previews.ImageDesc || formData.ImageDesc) ? (
                  <div className='flex flex-col gap-y-3 items-center'>
                    <Image src={imageKegiatanSrc} alt="Preview Gambar Sampul" width={200} height={150} />
                    <div className='flex flex-row items-center gap-x-2'>
                      <CheckCircleOutlineIcon fontSize="small"  className='text-green-600'/>
                      <Typography variant="body2">
                        Gambar Kegiatan telah diupload!
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2" className='text-center text-red-600'>
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
              </Box>
              {errors?.ImageDesc?._errors.length > 0 && (
              <Typography variant="caption" color="error" className='text-md text-red-700'>
                {errors.ImageDesc._errors[0]}
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