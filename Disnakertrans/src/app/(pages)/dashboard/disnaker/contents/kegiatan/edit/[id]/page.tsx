'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Stack, Divider, Card, Container,} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getKegiatanById, updateKegiatan } from '@/firebase/utils/kegiatan-service';
import { updateKegiatanFormData, updateKegiatanSchema } from '@/validation/kegiatan-validation';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { uploadKegiatanImage } from '@/firebase/uploadToStorage';

export default function UpdateKontenKegiatanPage() {
  const [formData, setFormData] = useState<Partial<updateKegiatanFormData>>({
    judul: "",
    deskripsi: "",
    gambar_sampul: "",
    tanggal_kegiatan: "",
    gambar_kegiatan: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ gambar_sampul?: File; gambar_kegiatan?: File[] }>({});
  const [previews, setPreviews] = useState<{ gambar_sampul?: string; gambar_kegiatan?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
          gambar_kegiatan: data.gambar_kegiatan as Array<string>,
          tanggal_kegiatan: data.tanggal_kegiatan as string,
        });
      }
    }
    fetchKegiatan();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previews.gambar_sampul) {
        URL.revokeObjectURL(previews.gambar_sampul);
      }

      if (Array.isArray(previews.gambar_kegiatan)) {
        previews.gambar_kegiatan.forEach(url => URL.revokeObjectURL(url));
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_sampul' | 'gambar_kegiatan') => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (field === 'gambar_kegiatan') {
      const filesArray = Array.from(e.target.files || []);
      if (filesArray.length > 5) {
        alert('Maksimal 5 gambar kegiatan.');
        return;
      }

      for (const file of filesArray) {
        if (file.size > MAX_FILE_SIZE) {
          alert(`File ${file.name} terlalu besar (maks 2MB).`);
          return;
        }
      }

      setFiles(prev => ({ ...prev, gambar_kegiatan: filesArray }));
      setPreviews(prev => ({
        ...prev,
        gambar_kegiatan: filesArray.map(file => URL.createObjectURL(file)),
      }));
      setErrors(prev => ({
        ...prev,
        gambar_kegiatan: { _errors: [] },
      }));
    } else {
      const file = e.target.files?.[0];
      if (file && file.size > MAX_FILE_SIZE) {
        alert("Ukuran file terlalu besar. Maksimum 2 MB.");
        return;
      }
      if (file) {
        setFiles(prev => ({ ...prev, [field]: file }));
        setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        setErrors(prev => ({
          ...prev,
          [field]: { _errors: [] },
        }));
      }
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newFormData = { ...formData };

      // upload sampul jika diganti
      if (files.gambar_sampul) {
        const uploaded = await uploadKegiatanImage(files.gambar_sampul);
        if (typeof uploaded === "string") {
          newFormData.gambar_sampul = uploaded;
        }
      }

      // upload gambar kegiatan jika ada yang diganti
      if (files.gambar_kegiatan && files.gambar_kegiatan.length > 0) {
        const uploaded = await uploadKegiatanImage(files.gambar_kegiatan);
        if (Array.isArray(uploaded)) {
          newFormData.gambar_kegiatan = uploaded;
        }
      }

      const result = updateKegiatanSchema.safeParse(newFormData);
      if (!result.success) {
        setErrors(result.error.format());
        return;
      }

      const success = await updateKegiatan(newFormData, {}); // sudah tidak butuh files
      if (success) {
        alert("Kegiatan berhasil diperbarui!");
        router.push("/dashboard/disnaker/contents/kegiatan");
      } else {
        alert("Konten Kegiatan gagal diperbarui! Mohon periksa kembali.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memperbarui data.");
      console.error("Error updating document:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageSampulSrc = previews.gambar_sampul || formData.gambar_sampul || "";
  const imageKegiatanSrc = previews.gambar_kegiatan || (Array.isArray(formData.gambar_kegiatan) ? formData.gambar_kegiatan : []);


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
                value={formData.judul || ""}
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
                name="deskripsi"
                value={formData.deskripsi || ""}
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
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                Tanggal Kegiatan
              </Typography>
              <input
                name='tanggal_kegiatan'
                value={formData.tanggal_kegiatan}
                onChange={handleChange}
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors?.tanggal_kegiatan?._errors?.length > 0 && errors.tanggal_kegiatan._errors.map((msg: string, i: number) => (
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
                {(previews.gambar_sampul || formData.gambar_sampul) ? (
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
                  multiple
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
                {imageKegiatanSrc.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-4">
                    {imageKegiatanSrc.map((src, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <Image src={src} alt={`Preview ${idx + 1}`} width={200} height={150} />
                        <Typography variant="caption">Gambar {idx + 1}</Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" className='text-center text-red-600'>
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