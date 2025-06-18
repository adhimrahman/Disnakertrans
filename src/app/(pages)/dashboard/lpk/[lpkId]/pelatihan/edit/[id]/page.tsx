// 'pelatihan/edit/[id]/page.tsx'

'use client';

import Form from 'next/form';
import React, { useEffect, useState } from 'react';
import { TextField, Button, Card, Container, Divider, CircularProgress, Typography, Box, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from 'next/image';
import { updatePelatihan } from '@/firebase/utils/pelatihan-service';
import { UpdatePelatihanSchema, UpdatePelatihan } from '@/validation/pelatihan-validation';
import { CloudUploadIcon } from 'lucide-react';
import { getPelatihanById } from '@/firebase/utils/pelatihan-service';

export default function AddPelatihanPage() {
  const [formData, setFormData] = useState<Partial<UpdatePelatihan>>({
    judul: '',
    deskripsi: '',
    tanggal_kegiatan: "",
    gambar_pelatihan: '',
    link_form: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ gambar_pelatihan?: File}>({});
  const [previews, setPreviews] = useState<{ gambar_pelatihan?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { lpkId, id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchPelatihanPage() {
      const data = await getPelatihanById(id as string);
      if (data) {
        setFormData({
          id: id as string,
          judul: data.judul,
          deskripsi: data.deskripsi,
          tanggal_kegiatan: data.tanggal_kegiatan as string,
          gambar_pelatihan: data.gambar_pelatihan as string,
          link_form: data.link_form
        });
      };
    };
    fetchPelatihanPage();
  }, [id, lpkId]);

  useEffect(() => {
    return () => {
      if (previews.gambar_pelatihan) URL.revokeObjectURL(previews.gambar_pelatihan);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_pelatihan') => {
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
      id: id as string,
      gambar_pelatihan: previews.gambar_pelatihan || formData.gambar_pelatihan ||"",
    };

    const result = UpdatePelatihanSchema.safeParse(newFormData);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
    };

    try {
      const success = await updatePelatihan(lpkId as string, newFormData, files);
      if (success) {
        alert("Pelatihan berhasil diperbarui!");
        router.push(`/dashboard/lpk/${lpkId}/pelatihan`);
      } else {
        alert("Pelatihan gagal ditambahkan! Mohon periksa kembali.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error("Error adding document:", e);
    } finally {
      setIsSubmitting(false);
    };
  };

  return (
<Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box className='bg-steelBlue flex justify-between items-center' sx={{ color: 'white', py: 2, px: 3 }} >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Update Informasi Pelatihan
          </Typography>
        </Box>
        <Form action="" onSubmit={handleSubmit} style={{
          padding: 24, display: 'flex', flexDirection: 'column', gap: 24
        }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Judul Konten Pelatihan</Typography>
              <TextField
                placeholder='Tuliskan judul pelatihan disini'
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="medium"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.judul?._errors?.length > 0 && errors.judul._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Gambar Pelatihan</Typography>
              <Box sx={{
                border: '1px dashed', borderColor: errors.ImageSampul ? 'error.main' : 'divider',
                p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column',
                alignItems: 'center', bgcolor: 'background.paper'
              }}>
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} sx={{
                  textTransform: 'none', px: 3, py: 1.5, borderRadius: 1.5, mb: 2
                }}>
                  Pilih File
                  <input
                    type="file"
                    name='gambar_pelatihan'
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'gambar_pelatihan')}
                    hidden
                    className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
                  />
                </Button>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: formData.gambar_pelatihan ? 'success.main' : 'text.secondary'
                }}>
                  {previews.gambar_pelatihan ? (
                  <div className='flex flex-col gap-y-3 items-center'>
                    <Image src={previews.gambar_pelatihan} alt="Preview Gambar Pelatihan" width={200} height={150} />
                    <div className='flex flex-row items-center gap-x-2'>
                      <CheckCircleOutlineIcon fontSize="small"  className='text-green-600'/>
                      <Typography variant="body2">
                        Gambar Pelatihan telah diupload!
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2">
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
                </Box>
                {errors?.gambar_pelatihan?._errors.length > 0 && (
                  <Typography variant="caption" color="error" className='text-md text-red-700'>
                    {errors.gambar_pelatihan._errors[0]}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Deskripsi Pelatihan</Typography>
              <TextField
                placeholder='Tuliskan deskripsi pelatihan disini'
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.deskripsi?._errors?.length > 0 && errors.deskripsi._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Tanggal Kegiatan</Typography>
              <input
                name="tanggal_kegiatan"
                type="date"
                value={formData.tanggal_kegiatan}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({ ...formData, tanggal_kegiatan: newDate });
                }}
                className='w-full rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base px-2 py-3'
              />
              {errors?.tanggal_kegiatan?._errors?.length > 0 && errors.tanggal_kegiatan._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Link Form Pendaftaran</Typography>
              <TextField
                placeholder='Tuliskan link form pendaftaran disini'
                name="link_form"
                value={formData.link_form}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.link_form?._errors?.length > 0 && errors.link_form._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
        </Form>
      </Card>
    </Container>    
  );
};