'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Stack, Divider, Card, Container,} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getLowonganById, updateLowongan } from '@/firebase/utils/lowongan-service';
import { updateLowonganFormData, updateLowonganSchema } from '@/validation/lowongan-validation';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Form from 'next/form';
import { IoTrash } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

export default function UpdateKontenLowonganPage() {
  const [formData, setFormData] = useState<Partial<updateLowonganFormData>>({
    Judul: "",
    nama_lowongan: "",
    Deskripsi: "",
    ImageSampul: "",
    Alamat: "",
    BatasLowongan: "",
    Range: { max: 0, min: 0 },
    Tipe: [],
    Syarat: [],
    Perusahaan: "",
    LinkLowongan: "",
    link_konten: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ ImageSampul?: File }>({});
  const [newSyarat, setNewSyarat] = useState<string>("");
  const [previews, setPreviews] = useState<{ ImageSampul?: string; }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchLowonganPage() {
      const data = await getLowonganById(id as string);
      if (data) {
        setFormData({
          id: id as string,
          Judul: data.Judul,
          nama_lowongan: data.nama_lowongan,
          ImageSampul: data.ImageSampul as string,
          Deskripsi: data.Deskripsi,
          BatasLowongan: data.BatasLowongan as string,
          Range: {
            max: data.Range?.max ?? 0,
            min: data.Range?.min ?? 0
          },
          Tipe: data.Tipe,
          Syarat: data.Syarat,
          Perusahaan: data.Perusahaan,
          Alamat: data.Alamat,
          LinkLowongan: data.LinkLowongan,
          link_konten: data.link_konten
        });
      }
    }
    fetchLowonganPage();
  }, [id]);

  useEffect(() => {
  return () => {
    if (previews.ImageSampul) URL.revokeObjectURL(previews.ImageSampul);
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

  const handleSyaratChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSyarat(e.target.value);
  };

  const handleAddSyarat = () => {
    if (newSyarat.trim() !== "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Syarat: [...prevFormData.Syarat ?? [], newSyarat.trim()]
      }));
      setNewSyarat(""); // Clear input field after adding
    }
  };

  const handleRemoveSyarat = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Syarat: prevFormData.Syarat?.filter((_, i) => i !== index)
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prevFormData => {
      const newTipe = checked
        ? [...prevFormData.Tipe ?? [], name] // Add the selected type to the array
        : prevFormData.Tipe?.filter((item) => item !== name); // Remove it if unchecked
    
      return {
        ...prevFormData,
        Tipe: newTipe,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newFormData = {
      ...formData,
      ImageSampul: previews.ImageSampul || formData.ImageSampul ||"",
    }

    const result = updateLowonganSchema.safeParse(newFormData);
    if (!result.success) {
      setErrors(result.error.format());
      console.log(result.error.errors);
    } else {
      setErrors({});
    }

    try {
      const success = await updateLowongan(formData, files);
      if (success) {
        alert("Lowongan berhasil diperbarui!");
        router.push("/dashboard/disnaker/contents/lowongan");
      } else {
        alert("Konten Lowongan gagal diperbarui! Mohon periksa kembali.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memperbarui data.");
      console.error("Error adding document:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageSampulSrc = previews.ImageSampul || formData.ImageSampul || "";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box className='bg-steelBlue flex justify-between items-center' sx={{ color: 'white', py: 2, px: 3 }} >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Tambah Lowongan Kerja
          </Typography>
        </Box>
        <Form action="" onSubmit={handleSubmit} style={{
          padding: 24, display: 'flex', flexDirection: 'column', gap: 24
        }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Judul Konten</Typography>
              <TextField
                placeholder='Tuliskan judul konten lowongan disini'
                name="Judul"
                value={formData.Judul || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="medium"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.Judul?._errors?.length > 0 && errors.Judul._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Nama Pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan nama pekerjaan disini'
                name="nama_lowongan"
                value={formData.nama_lowongan || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-darkBlue focus:ring-2 focus:ring-steelBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.nama_lowongan?._errors?.length > 0 && errors.nama_lowongan._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Gambar Sampul</Typography>
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
                    type="file" accept="image/*"
                    onChange={(e) => handleFileChange(e, 'ImageSampul')}
                    hidden
                    className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
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
                  <Typography variant="body2">
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
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Deskripsi Pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan deskripsi pekerjaan disini'
                name="Deskripsi"
                value={formData.Deskripsi || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.Deskripsi?._errors?.length > 0 && errors.Deskripsi._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Batas Lowongan</Typography>
              <input
                type="date"
                value={formData.BatasLowongan || ""}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({ ...formData, BatasLowongan: newDate });
                }}
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.BatasLowongan?._errors?.length > 0 && errors.BatasLowongan._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Range Gaji</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                <div className="flex flex-row gap-x-4 items-baseline">
                  <p className='text-lg text-black'>Rp</p>
                  <TextField
                    variant='standard'
                    name="Range.min"
                    value={formData.Range?.min || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        Range: {
                          ...formData.Range,
                          max: formData.Range?.max ?? 0,
                          min: Number(e.target.value) ?? 0
                        }
                      });
                    }}
                    sx={{ minWidth: 120 }}
                    className='text-black text-sm font-base p-2'
                  />
                </div>
                {errors?.Range?.min?._errors?.length > 0 && errors.Range.min._errors.map((msg: string, i: number) => (
                  <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
                ))}
                <Typography variant="body1" sx={{ fontWeight: 600 }} >--</Typography>
                <div className="flex flex-row gap-x-4 items-baseline">
                  <p className='text-lg text-black'>Rp</p>
                  <TextField
                    placeholder='Minimal'
                    variant='standard'
                    name="Range.max"
                    value={formData.Range?.max || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        Range: {
                          ...formData.Range,
                          min: formData.Range?.min ?? 0,
                          max: Number(e.target.value) ?? 0
                        }
                      });
                    }}
                    sx={{ minWidth: 120 }}
                    className='focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2'
                  />
                </div>
                {errors?.Range?.max?.message?.length > 0 && errors.Range.max.message.map((msg: string, i: number) => (
                  <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Tipe Pekerjaan</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
                {["Tetap", "Freelance", "Kontrak", "Paruh Waktu", "Magang"].map((type) => (
                  <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      name={type}
                      value={type}
                      checked={formData.Tipe?.includes(type)}
                      onChange={handleCheckboxChange}
                    />
                    <Typography variant="body2">{type}</Typography>
                  </Box>
                ))}
              </Box>
              {errors?.Tipe?._errors?.length > 0 && errors.Tipe?._errors.map((msg: string, i: number) => (
                  <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Syarat Pekerjaan</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <TextField
                    placeholder='Tuliskan syarat pekerjaan disini'
                    fullWidth
                    value={newSyarat}
                    onChange={handleSyaratChange}
                    className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
                  />
                  <Button variant="contained" color="primary" onClick={handleAddSyarat} sx={{ alignSelf: 'center' }}>
                    <GoPlus className='w-6 h-6'/>
                  </Button>
                </Box>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {formData.Syarat?.map((syarat, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <Typography variant="body2" sx={{ ml: 1 }}>{syarat}</Typography>
                      <Button variant='contained' color='error' onClick={() => handleRemoveSyarat(index)} sx={{ ml: 2, minWidth: 0, p: 1 }}>
                        <IoTrash className='w-5 h-5'/>
                      </Button>
                    </li>
                  ))}
                </ul>
                {!!errors.Syarat && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.Syarat}</Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Nama Perusahaan</Typography>
              <TextField
                placeholder='Tuliskan nama perusahaan disini'
                name="Perusahaan"
                value={formData.Perusahaan || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.Perusahaan?._errors?.length > 0 && errors.Perusahaan._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Alamat Perusahaan</Typography>
              <TextField
                placeholder='Tuliskan alamat pekerjaan disini'
                name="Alamat"
                value={formData.Alamat || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.Alamat?._errors?.length > 0 && errors.Alamat._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Link resmi lowongan pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan link resmi informasi lowongan disini'
                type='url'
                name="LinkLowongan"
                value={formData.LinkLowongan || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.LinkLowongan?._errors?.length > 0 && errors.LinkLowongan._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Link konten lowongan pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan link konten lowongan disini'
                type='url'
                name="link_konten"
                value={formData.link_konten || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.link_konten?._errors?.length > 0 && errors.link_konten._errors.map((msg: string, i: number) => (
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
}