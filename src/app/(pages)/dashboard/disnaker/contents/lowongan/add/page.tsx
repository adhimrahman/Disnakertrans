'use client';

import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Form from 'next/form';
import React, { useState } from 'react';
import { TextField, Button, Card, Container, Divider, CircularProgress, Typography, Box, Stack } from '@mui/material';
import { IoTrash } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { Lowongan } from '@/models/Lowongan';

export default function AddLowonganKerjaPage() {
  const docRef = collection(db, "lowongan");
  const [formData, setFormData] = useState<Lowongan>({
    Judul: "",
    nama_lowongan: "",
    BatasLowongan: null,
    LinkLowongan: "",
    Tipe: [],
    Deskripsi: "",
    Perusahaan: "",
    Alamat: "",
    Syarat: [],
    Range: {
      min: 0,
      max: 0,
    },
    tanggal_unggah: null,
    link_konten: null,
    ImageSampul: "",
    isDelete: false
  });

  const [errors, setErrors] = useState<Partial<Lowongan>>({});
  const [newSyarat, setNewSyarat] = useState<string>("");
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

  const handleSyaratChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSyarat(e.target.value);
  };

  const handleAddSyarat = () => {
    if (newSyarat.trim() !== "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Syarat: [...prevFormData.Syarat, newSyarat.trim()]
      }));
      setNewSyarat(""); // Clear input field after adding
    }
  };

  const handleRemoveSyarat = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Syarat: prevFormData.Syarat.filter((_, i) => i !== index)
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
  
    setFormData(prevFormData => {
      const newTipe = checked
        ? [...prevFormData.Tipe, name] // Add the selected type to the array
        : prevFormData.Tipe.filter((item) => item !== name); // Remove it if unchecked
  
      return {
        ...prevFormData,
        Tipe: newTipe,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    const newErrors: any = {};
    
    if (!formData.Judul) newErrors.Judul = "Judul harus diisi";
    if (!formData.nama_lowongan) newErrors.nama_lowongan = "Nama lowongan harus diisi";
    if (!formData.Deskripsi) newErrors.Deskripsi = "Deskripsi harus diisi";
    if (!formData.BatasLowongan) {
      newErrors.BatasLowongan = "Batas lowongan harus diisi"
    };
    if (!formData.Perusahaan) newErrors.Perusahaan = "Nama perusahaan harus diisi";
    if (!formData.Alamat) newErrors.Alamat = "Alamat perusahaan harus diisi";
    if (!formData.LinkLowongan) newErrors.LinkLowongan = "Link lowongan harus diisi";
    if (formData.Tipe.length === 0) newErrors.Tipe = "Pilih minimal satu tipe pekerjaan";
    if (formData.Syarat.length === 0) newErrors.Syarat = "Minimal satu syarat harus diisi";
    if (!formData.Range?.min) newErrors.Range = { ...(newErrors.Range || {}), min: "Gaji minimum harus diisi" };
    if (!formData.Range?.max) newErrors.Range = { ...(newErrors.Range || {}), max: "Gaji maksimum harus diisi" };
    
    let batasLowonganTimestamp: Timestamp | null = null;
    if (formData.BatasLowongan instanceof Timestamp) {
      batasLowonganTimestamp = formData.BatasLowongan;
    }
    else if (typeof formData.BatasLowongan === "string") {
      const parsedDate = new Date(formData.BatasLowongan);
      if (!isNaN(parsedDate.getTime())) { 
        batasLowonganTimestamp = Timestamp.fromDate(parsedDate);
      } else {
        newErrors.BatasLowongan = "Format tanggal batas lowongan tidak valid";
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      console.error("Form validation failed. Errors:", newErrors);
      setIsSubmitting(false);
      setIsUploading(false);
      return;
    }
      
    try {
      const lowonganSnapshot = await getDocs(docRef);
      let new_id = 1;

      if (!lowonganSnapshot.empty) {
        const maxId = lowonganSnapshot.docs.reduce((max, doc) => {
          const idNumber = parseInt(doc.id.replace("lowongan_", ""), 10);
          return idNumber > max ? idNumber : max;
        }, 0);
        new_id = maxId + 1;
      }

      const data = {
        ...formData,
        BatasLowongan: batasLowonganTimestamp,
        ImageSampul: null,
        tanggal_unggah: Timestamp.now(),
        isDelete: false
      };

      const docId = `lowongan_${new_id}`;
      const newDocRef = doc(docRef, docId);
      await setDoc(newDocRef, data);
      alert("Konten Lowongan Berhasil Ditambahkan");
      console.log("Form data:", formData);
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error adding document:", e.message);
      } else {
        console.error("Unknown error occurred", e);
      }
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
            Tambah Lowongan Kerja
          </Typography>
        </Box>
        <Form action="" onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Judul Konten</Typography>
              <TextField
                placeholder='Tuliskan judul konten lowongan disini'
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
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Nama Pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan nama pekerjaan disini'
                name="nama_lowongan"
                value={formData.nama_lowongan}
                onChange={handleChange}
                error={!!errors.nama_lowongan}
                helperText={errors.nama_lowongan}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Gambar Sampul</Typography>
              <Box sx={{ border: '1px dashed', borderColor: errors.ImageSampul ? 'error.main' : 'divider', p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
                <Button variant="outlined" component="label" sx={{ textTransform: 'none', px: 3, py: 1.5, borderRadius: 1.5, mb: 2 }}>
                  Pilih File
                  <input type="file" accept="image/*" hidden />
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: formData.ImageSampul ? 'success.main' : 'text.secondary' }}>
                  {formData.ImageSampul ? (
                    <Typography variant="body2">Gambar Sampul telah diupload!</Typography>
                  ) : (
                    <Typography variant="body2">Belum ada gambar yang diunggah</Typography>
                  )}
                </Box>
                {!!errors.ImageSampul && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.ImageSampul}</Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Deskripsi Pekerjaan</Typography>
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
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Batas Lowongan</Typography>
              <input
                type="date"
                value={formData.BatasLowongan instanceof Timestamp ? formData.BatasLowongan.toDate().toISOString().split("T")[0] : formData.BatasLowongan || ""}
                onChange={(e) => {
                  const newDate = e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null;
                  setFormData({ ...formData, BatasLowongan: newDate });
                }}
                className='w-40 rounded-lg ring-2 ring-gray-200 hover:ring-1 hover:ring-black focus:ring-2 focus:ring-blue-500 text-black text-sm font-base p-2 shadow-xl'
              />
              {!!errors.BatasLowongan && typeof errors.BatasLowongan === 'string' && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.BatasLowongan}</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Range Gaji</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                <TextField
                  placeholder='Minimum'
                  variant='standard'
                  name="Range.min"
                  value={formData.Range?.min || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, Range: { ...formData.Range, min: parseInt(e.target.value) } });
                  }}
                  error={!!errors.Range?.min}
                  helperText={errors.Range?.min}
                  required
                  sx={{ minWidth: 120 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>-</Typography>
                <TextField
                  placeholder='Maksimum'
                  variant='standard'
                  name="Range.max"
                  value={formData.Range?.max || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, Range: { ...formData.Range, max: parseInt(e.target.value) } });
                  }}
                  error={!!errors.Range?.max}
                  helperText={errors.Range?.max}
                  required
                  sx={{ minWidth: 120 }}
                />
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
                      checked={formData.Tipe.includes(type)}
                      onChange={handleCheckboxChange}
                    />
                    <Typography variant="body2">{type}</Typography>
                  </Box>
                ))}
              </Box>
              {!!errors.Tipe && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.Tipe}</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Syarat Pekerjaan</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <TextField
                    placeholder='Tuliskan syarat pekerjaan disini'
                    value={newSyarat}
                    onChange={handleSyaratChange}
                    sx={{ minWidth: 200 }}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddSyarat} sx={{ alignSelf: 'center' }}>
                    <GoPlus className='w-6 h-6'/>
                  </Button>
                </Box>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {formData.Syarat.map((syarat, index) => (
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
                value={formData.Perusahaan}
                onChange={handleChange}
                error={!!errors.Perusahaan}
                helperText={errors.Perusahaan}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Alamat Perusahaan</Typography>
              <TextField
                placeholder='Tuliskan alamat pekerjaan disini'
                name="Alamat"
                value={formData.Alamat}
                onChange={handleChange}
                error={!!errors.Alamat}
                helperText={errors.Alamat}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Link resmi lowongan pekerjaan</Typography>
              <TextField
                placeholder='Tuliskan link resmi informasi lowongan disini'
                type='url'
                name="LinkLowongan"
                value={formData.LinkLowongan}
                onChange={handleChange}
                error={!!errors.LinkLowongan}
                helperText={errors.LinkLowongan}
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
              />
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || isUploading}
              sx={{ minWidth: '150px', py: 1.5, px: 4, borderRadius: 1.5, textTransform: 'uppercase', fontWeight: 'bold' }}
              startIcon={isSubmitting || isUploading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Mengirim...' : 'SUBMIT'}
            </Button>
          </Box>
        </Form>
      </Card>
    </Container>
  );
}