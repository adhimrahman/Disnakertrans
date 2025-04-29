'use client';

import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Form from 'next/form';
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Kegiatan } from '@/models/Kegiatan';
// import { CloudinaryResult } from '@/models/CloudinaryResults';

export default function AddKontenKegiatanPage() {
  const docRef = collection(db, "lowongan");
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
    
    if (Object.keys(newErrors).length > 0) {
      console.error("Form validation failed. Errors:", newErrors);
      setIsSubmitting(false);
      setIsUploading(false);
      return; // STOP lanjut submit kalau ada error
    }
      
    try {
      // const imageUrl = await handleImageUpload();
      const kegiatanSnapshot = await getDocs(docRef);
      let new_id = 1;
      if (!kegiatanSnapshot.empty) {
        const maxId = kegiatanSnapshot.docs.reduce((max, doc) => {
          const idNumber = parseInt(doc.id.replace("kegiatan_", ""), 10);
          return idNumber > max ? idNumber : max;
        }, 0);
        new_id = maxId + 1;
      }

      const data = {
        ...formData,
        ImageSampul: null,
        ImageDesc: null,
        tanggal_unggah: Timestamp.now(),
        link: "",
        isDelete: false
      };

      const docId = `kegiatan${new_id}`;
      const newDocRef = doc(docRef, docId);
      await setDoc(newDocRef, data);
      alert("Konten Kegiatan Berhasil Ditambahkan");
      console.log("Form data:", formData);
    } catch (e) {
      // Cek apakah error adalah instance dari Error
      if (e instanceof Error) {
        console.error("Error adding document:", e.message);
      } else {
        // Tangani error lainnya yang bukan instance dari Error
        console.error("Unknown error occurred", e);
      }
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
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
}