'use client';

import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import Form from 'next/form';
import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { useParams } from 'next/navigation';
import { TextField, Button } from '@mui/material';
import { Kegiatan } from '@/models/Kegiatan';

export default function EditKontenKegiatanPage() {
    const [formData, setFormData] = useState<Kegiatan>({
      Judul: "",
      Deskripsi: "",
      ImageDesc: "",
      ImageSampul: "",
      Tanggal: null,
      link: null,
      isDelete: false
    });
  
  const [errors, setErrors] = useState<Partial<Kegiatan>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  
  useEffect(() => {
    async function fetchKegiatan() {
      if (!id) return;
      const docRef = doc(db, "Kegiatan", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          Judul: data.Judul || '',
          Deskripsi: data.Deskripsi || '',
          ImageSampul: data.ImageSampul || null,
          ImageDesc: data.ImageDesc || null,
          Tanggal: data.Tanggal || Timestamp.now(),
          link: data.link || "",
          isDelete: false
        });
      }
    }
    fetchKegiatan();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    
    // Perform form validation here
    if (!formData.Judul) newErrors.Judul = "Judul harus diisi";
    if (!formData.ImageSampul) newErrors.ImageSampul = "Gambar Sampul kegiatan harus diisi";
    if (!formData.ImageDesc) newErrors.ImageDesc = "Dokumentasi kegiatan harus diisi";
    if (!formData.Deskripsi) newErrors.Deskripsi = "Deskripsi harus diisi";
    if (!formData.link) newErrors.link = "Link lowongan harus diisi";

    setErrors(newErrors);

    try {
      const docRef = doc(db, "Kegiatan", id as string);
      await updateDoc(docRef, {
        ...formData,
      });

      alert("Konten Kegiatan berhasil diupdate!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Form action="" onSubmit={handleSubmit} className="flex flex-col gap-y-6 p-6 w-lg">
    <p className='text-base text-black font-medium inline border-b-3 border-blue-500'>Judul Konten</p>
    <TextField
      placeholder='Tuliskan judul konten kegiatan disini'
      name="Judul"
      value={formData.Judul}
      onChange={handleChange}
      error={!!errors.Judul}
      helperText={errors.Judul}
      fullWidth
    />
    <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Deskripsi Kegiatan</p>
    <TextField
      placeholder='Tuliskan deskripsi pekerjaan disini'
      name="Deskripsi"
      value={formData.Deskripsi}
      onChange={handleChange}
      error={!!errors.Deskripsi}
      helperText={errors.Deskripsi}
      fullWidth
    />
    <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Gambar Sampul</p>
    {/* <Button
      variant="contained"
      color="primary"
      onClick={() => handleImageUpload()}
      disabled={isUploading}
      className='w-42'
    >
      {isUploading ? 'Uploading...' : 'Upload Image'}
    </Button> */}
    <p className="mt-4 text-sm text-black">
      {formData.ImageSampul ? "Image Uploaded!" : "No Image Uploaded"}
    </p>
    <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Gambar Kegiatan</p>
    {/* <Button
      variant="contained"
      color="primary"
      onClick={() => handleImageUpload()}
      disabled={isUploading}
      className='w-42'
    >
      {isUploading ? 'Uploading...' : 'Upload Image'}
    </Button> */}
    <p className="mt-4 text-sm text-black">
      {formData.ImageSampul ? "Image Uploaded!" : "No Image Uploaded"}
    </p>
    <div className='flex flex-row gap-x-4 justify-between w-sm mt-12'>
    <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  </Form>
  );  
};