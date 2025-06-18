'use client';

import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Stack, Divider, Card, Container,} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Form from "next/form";
import { useParams, useRouter } from "next/navigation";
import { getProfile, updateProfileData } from "@/firebase/utils/profile-service";
import { UpdateProfile, updateProfileSchema } from "@/validation/profile-validation";
import Image from 'next/image';

export default function EditProfilePage() {
  const [formData, setFormData] = useState<Partial<UpdateProfile>>({
    gambar: "",
    nama_lengkap: "",
    awal_jabat: "",
    akhir_jabat: ""
  });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<{ gambar?: File }>({});
  const [previews, setPreviews] = useState<{ gambar?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => { 
    async function fetchProfile() {
      const data = await getProfile(id as string);
      if (data) {
        setFormData({
          id: data.id as string,
          gambar: data.gambar as string,
          nama_lengkap: data.nama_lengkap as string,
          awal_jabat: data.awal_jabat as string,
          akhir_jabat: data.akhir_jabat as string,
        });
      };
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previews.gambar) URL.revokeObjectURL(previews.gambar);
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


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar') => {
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
      gambar: previews.gambar || formData.gambar ||"",
    }

    const result = updateProfileSchema.safeParse(newFormData);
    if (!result.success) {
      setErrors(result.error.format());
      console.log(result.error.errors);
    } else {
      setErrors({});
    }

    try {
      const success = await updateProfileData(formData, files);
      if (success) {
        alert("Profile berhasil diperbarui!");
        router.push(`/dashboard/disnaker/profile/${id}`);
      } else {
        alert("Profile gagal diperbarui! Mohon periksa kembali.");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memperbarui data.");
      console.error("Error adding document:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const profileImageSrc = previews.gambar || formData.gambar || "";
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box className='bg-steelBlue flex justify-between items-center' sx={{ color: 'white', py: 2, px: 3 }} >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Ubah Profile Disnaker
          </Typography>
        </Box>
        <Form action="" onSubmit={handleSubmit} style={{
          padding: 24, display: 'flex', flexDirection: 'column', gap: 24
        }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Nama Kepala Dinas</Typography>
              <TextField
                placeholder='Tuliskan nama lengkap disini'
                name="nama_lengkap"
                value={formData.nama_lengkap || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="medium"
                className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.nama_lengkap?._errors?.length > 0 && errors.nama_lengkap._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Gambar Profil</Typography>
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
                    name="gambar"
                    type="file" accept="image/*"
                    onChange={(e) => handleFileChange(e, 'gambar')}
                    hidden
                    className='rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
                  />
                </Button>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: formData.gambar ? 'success.main' : 'text.secondary'
                }}>
                  {(previews.gambar || formData.gambar) ? (
                  <div className='flex flex-col gap-y-3 items-center'>
                    <Image
                      src={profileImageSrc}
                      alt="Preview Gambar Sampul"
                      width={200} height={150}
                    />
                    <div className='flex flex-row items-center gap-x-2'>
                      <CheckCircleOutlineIcon fontSize="small"  className='text-green-600'/>
                      <Typography variant="body2">
                        Gambar Profil telah diupload!
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2">
                    Belum ada gambar yang diunggah
                  </Typography>
                )}
                </Box>
                {errors?.gambar?._errors.length > 0 && (
                  <Typography variant="caption" color="error" className='text-md text-red-700'>
                    {errors.gambar._errors[0]}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Masa Awal Menjabat</Typography>
              <input
                type="date"
                value={formData.awal_jabat || ""}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({ ...formData, awal_jabat: newDate });
                }}
                className='w-full rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.awal_jabat?._errors?.length > 0 && errors.awal_jabat._errors.map((msg: string, i: number) => (
                <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Masa Akhir Menjabat</Typography>
              <input
                type="date"
                value={formData.akhir_jabat || ""}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({ ...formData, akhir_jabat: newDate });
                }}
                className='w-full rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-steelBlue focus:ring-2 focus:ring-darkBlue text-black text-sm font-base p-2 shadow-xl'
              />
              {errors?.akhir_jabat?._errors?.length > 0 && errors.akhir_jabat._errors.map((msg: string, i: number) => (
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
              {isSubmitting ? 'Mengirim...' : 'Update'}
            </Button>
          </Box>
        </Form>
      </Card>
    </Container>
  );
}