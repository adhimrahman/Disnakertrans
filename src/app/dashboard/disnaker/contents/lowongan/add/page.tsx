'use client';

import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Form from 'next/form';
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { IoTrash } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { Lowongan } from '@/models/Lowongan';
// import { CloudinaryResult } from '@/models/CloudinaryResults';

export default function ContentsJobVacancyForm() {
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
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    
    // Perform form validation here
    if (!formData.Judul) newErrors.Judul = "Judul harus diisi";
    if (!formData.nama_lowongan) newErrors.nama_lowongan = "Nama lowongan harus diisi";
    if (!formData.Deskripsi) newErrors.Deskripsi = "Deskripsi harus diisi";
    if (!formData.BatasLowongan) newErrors.BatasLowongan = "Batas lowongan harus diisi";
    if (!formData.Perusahaan) newErrors.Perusahaan = "Nama perusahaan harus diisi";
    if (!formData.Alamat) newErrors.Alamat = "Alamat perusahaan harus diisi";
    if (!formData.LinkLowongan) newErrors.LinkLowongan = "Link lowongan harus diisi";
    if (formData.Tipe.length === 0) newErrors.Tipe = "Pilih minimal satu tipe pekerjaan";
    if (formData.Syarat.length === 0) newErrors.Syarat = "Minimal satu syarat harus diisi";
    if (!formData.Range?.min) newErrors.Range = { ...(newErrors.Range || {}), min: "Gaji minimum harus diisi" };
    if (!formData.Range?.max) newErrors.Range = { ...(newErrors.Range || {}), max: "Gaji maksimum harus diisi" };
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        // const imageUrl = await handleImageUpload();
        const lowonganSnapshot = await getDocs(docRef);
        let new_id = 1;
        if (!lowonganSnapshot.empty) {
          const maxId = lowonganSnapshot.docs.reduce((max, doc) => {
            const idNumber = parseInt(doc.id.replace("lowongan_0", ""), 10);
            return idNumber > max ? idNumber : max;
          }, 0);
          new_id = maxId + 1;
        }

        let batasLowonganTimestamp;
        if (formData.BatasLowongan instanceof Date) {
          batasLowonganTimestamp = Timestamp.fromDate(formData.BatasLowongan);
        } else if (typeof formData.BatasLowongan === "string") {
          batasLowonganTimestamp = Timestamp.fromDate(new Date(formData.BatasLowongan));
        } else {
          newErrors.BatasLowongan = "Batas lowongan tidak valid";
        } // Jika string, konversi ke Date, lalu ke Timestamp

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
      } catch (e: unknown) {
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
    } else {
      console.error("Form validation failed. Errors:", newErrors);
    }
  }

  return (
    <Form action="" onSubmit={handleSubmit} className="flex flex-col gap-y-6 p-6">
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Judul Konten</p>
      <TextField
        placeholder='Tuliskan judul konten lowongan disini'
        name="Judul"
        value={formData.Judul}
        onChange={handleChange}
        error={!!errors.Judul}
        helperText={errors.Judul}
        className='w-lg'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Nama Pekerjaan</p>
      <TextField
        placeholder='Tuliskan nama pekerjaan disini'
        name="nama_lowongan"
        value={formData.nama_lowongan}
        onChange={handleChange}
        error={!!errors.nama_lowongan}
        helperText={errors.nama_lowongan}
        className='w-lg'
        required
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
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Deskripsi Pekerjaan</p>
      <TextField
        placeholder='Tuliskan deskripsi pekerjaan disini'
        name="Deskripsi"
        value={formData.Deskripsi}
        onChange={handleChange}
        error={!!errors.Deskripsi}
        helperText={errors.Deskripsi}
        className='w-lg'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Batas Lowongan</p>
      <input
        type="date"
        value={
          formData.BatasLowongan instanceof Timestamp
            ? formData.BatasLowongan.toDate().toISOString().split("T")[0] // Convert Timestamp to YYYY-MM-DD string
            : formData.BatasLowongan || "" // If it's null, set value to empty string
        }
        onChange={(e) => {
          // When the user changes the date, convert it to a Timestamp
          const newDate = e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null;
          setFormData({
            ...formData,
            BatasLowongan: newDate,
          });
        }}
      />
      <h2 className='text-base font-medium text-black inline border-b-3 border-blue-500 w-lg'>Range Gaji</h2>
      <div className='flex flex-row gap-x-5 justify-between w-sm'>
        <div className='flex flex-row gap-x-2 items-center'>
          <p className='text-sm text-black'>Maksimum</p>
          <TextField
            placeholder='Rp'
            variant='standard'
            name="Range.max"
            value={formData.Range?.max || ''}
            onChange={(e) => {
              setFormData({
                ...formData,
                Range: {
                  ...formData.Range,
                  max: parseInt(e.target.value),
                },
              })
            }}
            error={!!errors.Range?.max}
            helperText={errors.Range?.max}
            required
          />
        </div>
        <p className='text-lg font-semibold text-black items-center'>--</p>
        <div className='flex flex-row gap-x-2 items-center'>
          <p className='text-sm text-black'>Minimum</p>
          <TextField
            placeholder='Rp'
            variant='standard'
            name="Range.min"
            value={formData.Range?.min || ''}
            onChange={(e) => {
              setFormData({
                ...formData,
                Range: {
                  ...formData.Range,
                  min: parseInt(e.target.value),
                },
              })
            }}
            error={!!errors.Range?.min}
            helperText={errors.Range?.min}
            required
          />
        </div>
      </div>
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Tipe Pekerjaan</p>
      <div className='flex flex-row gap-x-4 justify-between w-lg'>
        {["Tetap", "Freelance", "Kontrak", "Paruh Waktu", "Magang"].map((type) => (
          <div className="flex flex-row gap-x-2" key={type}>
            <input
              type="checkbox"
              name={type}
              checked={formData.Tipe.includes(type)} // Check if the type is in the array
              onChange={handleCheckboxChange}
            />
            <p className="text-sm text-black">{type}</p>
          </div>
        ))}
      </div>
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Syarat Pekerjaan</p>
      <div className='flex flex-col gap-y-2'>
        <div className="flex flex-row gap-x-4">
          <TextField
            placeholder='Tuliskan syarat pekerjaan disini'
            value={newSyarat}
            onChange={handleSyaratChange}
            className="w-lg"
          />
          <Button variant="contained" color="primary" onClick={handleAddSyarat} className="self-center">
            <GoPlus className='w-6 h-6'/>
          </Button>
        </div>
        {/* Display list of added Syarat */}
        <ul className="m-1 w-xl">
          {formData.Syarat.map((syarat, index) => (
            <li key={index} className="flex justify-between items-center">
              <p className='text-sm text-black w-2xl m-4'>{syarat}</p>
              <Button
                variant='contained'
                color='error'
                onClick={() => handleRemoveSyarat(index)}  // Correctly pass index inside the onClick
                className="text-red-500 hover:text-red-700"
              >
                <IoTrash className='w-6 h-6'/>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Nama Perusahaan</p>
      <TextField
        placeholder='Tuliskan nama perusahaan disini'
        name="Perusahaan"
        value={formData.Perusahaan}
        onChange={handleChange}
        error={!!errors.Perusahaan}
        helperText={errors.Perusahaan}
        className='w-lg'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Alamat Perusahaan</p>
      <TextField
        placeholder='Tuliskan alamat pekerjaan disini'
        name="Alamat"
        value={formData.Alamat}
        onChange={handleChange}
        error={!!errors.Alamat}
        helperText={errors.Alamat}
        className='w-lg'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Link resmi lowongan pekerjaan</p>
      <TextField
        placeholder='Tuliskan link resmi informasi lowongan disini'
        type='url'
        name="LinkLowongan"
        value={formData.LinkLowongan}
        onChange={handleChange}
        error={!!errors.LinkLowongan}
        helperText={errors.LinkLowongan}
        className='w-lg'
        required
      />
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