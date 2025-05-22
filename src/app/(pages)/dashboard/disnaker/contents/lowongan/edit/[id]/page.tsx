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
    judul: "",
    nama_lowongan: "",
    deskripsi: "",
    gambar_sampul: "",
    alamat: "",
    batas_lowongan: "",
    range_gaji: { max: 0, min: 0 },
    tipe: [],
    syarat: [],
    perusahaan: "",
    link_lowongan: "",
    link_konten: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ gambar_sampul?: File }>({});
  const [newSyarat, setNewSyarat] = useState<string>("");
  const [previews, setPreviews] = useState<{ gambar_sampul?: string; }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchLowonganPage() {
      const data = await getLowonganById(id as string);
      if (data) {
        setFormData({
          id: id as string,
          judul: data.judul,
          nama_lowongan: data.nama_lowongan,
          gambar_sampul: data.gambar_sampul as string,
          deskripsi: data.deskripsi,
          batas_lowongan: data.batas_lowongn as string,
          range_gaji: {
            max: data.Range?.max ?? 0,
            min: data.Range?.min ?? 0
          },
          tipe: data.Tipe,
          syarat: data.Syarat,
          perusahaan: data.Perusahaan,
          alamat: data.Alamat,
          link_lowongan: data.LinkLowongan,
          link_konten: data.link_konten
        });
      }
    }
    fetchLowonganPage();
  }, [id]);

  useEffect(() => {
  return () => {
    if (previews.gambar_sampul) URL.revokeObjectURL(previews.gambar_sampul);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_sampul') => {
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
        Syarat: [...prevFormData.syarat ?? [], newSyarat.trim()]
      }));
      setNewSyarat(""); // Clear input field after adding
    }
  };

  const handleRemoveSyarat = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Syarat: prevFormData.syarat?.filter((_, i) => i !== index)
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prevFormData => {
      const newTipe = checked
        ? [...prevFormData.tipe ?? [], name] // Add the selected type to the array
        : prevFormData.tipe?.filter((item) => item !== name); // Remove it if unchecked
    
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
      ImageSampul: previews.gambar_sampul || formData.gambar_sampul ||"",
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

  const imageSampulSrc = previews.gambar_sampul || formData.gambar_sampul || "";

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
                name="judul"
                value={formData.judul || ""}
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
                    onChange={(e) => handleFileChange(e, 'gambar_sampul')}
                    hidden
                    className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
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
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Deskripsi Pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan deskripsi pekerjaan disini'
                name="deskripsi"
                value={formData.deskripsi || ""}
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
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Batas Lowongan</Typography>
              <input
                type="date"
                value={formData.batas_lowongan || ""}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({ ...formData, batas_lowongan: newDate });
                }}
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.batas_llowongan?._errors?.length > 0 && errors.batas_llowongan._errors.map((msg: string, i: number) => (
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
                    name="range.min"
                    value={formData.range_gaji?.min || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        range_gaji: {
                          ...formData.range_gaji,
                          max: formData.range_gaji?.max ?? 0,
                          min: Number(e.target.value) ?? 0
                        }
                      });
                    }}
                    sx={{ minWidth: 120 }}
                    className='text-black text-sm font-base p-2'
                  />
                </div>
                {errors?.range_gaji?.min?._errors?.length > 0 && errors.range_gaji.min._errors.map((msg: string, i: number) => (
                  <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
                ))}
                <Typography variant="body1" sx={{ fontWeight: 600 }} >--</Typography>
                <div className="flex flex-row gap-x-4 items-baseline">
                  <p className='text-lg text-black'>Rp</p>
                  <TextField
                    placeholder='Minimal'
                    variant='standard'
                    name="range_gaji.max"
                    value={formData.range_gaji?.max || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        range_gaji: {
                          ...formData.range_gaji,
                          min: formData.range_gaji?.min ?? 0,
                          max: Number(e.target.value) ?? 0
                        }
                      });
                    }}
                    sx={{ minWidth: 120 }}
                    className='focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2'
                  />
                </div>
                {errors?.range_gaji?.max?.message?.length > 0 && errors.range_gaji.max.message.map((msg: string, i: number) => (
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
                      checked={formData.tipe?.includes(type)}
                      onChange={handleCheckboxChange}
                    />
                    <Typography variant="body2">{type}</Typography>
                  </Box>
                ))}
              </Box>
              {errors?.tipe?._errors?.length > 0 && errors.tipe?._errors.map((msg: string, i: number) => (
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
                  {formData.syarat?.map((syarat, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <Typography variant="body2" sx={{ ml: 1 }}>{syarat}</Typography>
                      <Button variant='contained' color='error' onClick={() => handleRemoveSyarat(index)} sx={{ ml: 2, minWidth: 0, p: 1 }}>
                        <IoTrash className='w-5 h-5'/>
                      </Button>
                    </li>
                  ))}
                </ul>
                {!!errors.Syarat && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.syarat}</Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Nama Perusahaan</Typography>
              <TextField
                placeholder='Tuliskan nama perusahaan disini'
                name="perusahaan"
                value={formData.perusahaan || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.perusahaan?._errors?.length > 0 && errors.perusahaan._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Alamat Perusahaan</Typography>
              <TextField
                placeholder='Tuliskan alamat pekerjaan disini'
                name="alamat"
                value={formData.alamat || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.alamat?._errors?.length > 0 && errors.alamat._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Link resmi lowongan pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan link resmi informasi lowongan disini'
                type='url'
                name="link_lowongan"
                value={formData.link_lowongan || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.link_lowongan?._errors?.length > 0 && errors.link_lowongan._errors.map((msg: string, i: number) => (
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