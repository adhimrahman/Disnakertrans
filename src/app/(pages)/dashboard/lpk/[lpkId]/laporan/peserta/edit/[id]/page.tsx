'use client';

import { doc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Form from 'next/form';
import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { PesertaLpk } from '@/models/PesertaLpk';
import { useParams } from 'next/navigation';

export default function EditAkunPage() {
  const [formData, setFormData] = useState<PesertaLpk>({
    nama: "",
    lpk: 0,
    jurusan: "",
    jenis_kelamin: false,
    tanggal_lahir: null,
    kontak: { alamat_tinggal: "", email: "", nomor_hp: "" },
    tanggal_daftar: null,
    lulus: false,
    isDelete: false
  });

  const [errors, setErrors] = useState<Partial<PesertaLpk>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { lpkId, id } = useParams();

  useEffect(() => {
    async function fetchLowongan() {
      if (!id) return;
      const docRef = doc(db, `lpk/${lpkId}/peserta`, id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          nama: data.nama || '',
          jurusan: data.jurusan || '',
          lpk: data.lpk || '',
          jenis_kelamin: data.jenis_kelamin || false,
          tanggal_lahir: data.tanggal_lahir || '',
          kontak: data.kontak || { alamat_tinggal: "", email: "", nomor_hp: "" },
          tanggal_daftar: data.tanggal_daftar || '',
          lulus: data.lulus || false,
          isDelete: false
        });
      }
    }
    fetchLowongan();
  }, [ id, lpkId ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    
    // Perform form validation here
    if (!formData.nama) newErrors.nama = "nama harus diisi";
    if (!formData.jurusan) newErrors.jurusan = "jurusan harus diisi";
    if (!formData.tanggal_lahir) newErrors.tanggal_lahir = "tanggal lahir perusahaan harus diisi";
    if (!formData.kontak?.alamat_tinggal) newErrors.kontak = { ...(newErrors.kontak || {}), alamat_tinggal: "alamat_tinggal harus diisi" };
    if (!formData.kontak?.email) newErrors.kontak = { ...(newErrors.kontak || {}), email: "email harus diisi" };
    if (!formData.kontak?.nomor_hp) newErrors.kontak = { ...(newErrors.kontak || {}), nomor_hp: "nomor hp harus diisi" };
    if (!formData.tanggal_daftar) newErrors.tanggal_daftar = "tanggal pendaftaran harus diisi";
    
    setErrors(newErrors);
    
    try {
      const docRef = doc(db, `lpk/${lpkId}/peserta`, id as string);
      await updateDoc(docRef, {
        ...formData,
        tanggal_daftar: formData.tanggal_daftar instanceof Timestamp
          ? formData.tanggal_daftar : formData.tanggal_daftar
          ? Timestamp.fromDate(new Date(formData.tanggal_daftar))
          : null, // kalau null ya langsung null
        tanggal_lahir: formData.tanggal_lahir instanceof Timestamp
          ? formData.tanggal_lahir : formData.tanggal_lahir
          ? Timestamp.fromDate(new Date(formData.tanggal_lahir))
          : null
      });

      alert("Akun berhasil diupdate");
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form action="" onSubmit={handleSubmit} className="flex flex-col gap-y-6 p-6">
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Nama peserta</p>
      <TextField
        placeholder='Tuliskan peserta disini'
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        error={!!errors.nama}
        helperText={errors.nama}
        className='w-lg text-sm'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Nomor LPK</p>
      <TextField
        placeholder='Tuliskan Nomor LPK disini'
        name="lpk"
        value={formData.lpk}
        onChange={handleChange}
        error={!!errors.lpk}
        helperText={errors.lpk}
        className='w-lg text-sm'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Jurusan peserta</p>
      <TextField
        placeholder='Tuliskan jurusan disini'
        name="jurusan"
        value={formData.jurusan}
        onChange={handleChange}
        error={!!errors.jurusan}
        helperText={errors.jurusan}
        className='w-lg'
        required
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Jenis kelamin peserta</p>
      <div className='flex flex-row gap-x-4 justify-between w-lg'>
        <div className="flex flex-row gap-x-2">
          <label className='text-black'>
            <input
              type="radio"
              name="jenis_kelamin"
              checked={formData.jenis_kelamin === true}
              onChange={() => setFormData({ ...formData, jenis_kelamin: true })}
            />Pria
          </label>
          <label className='text-black'>
            <input
              type="radio"
              name="jenis_kelamin"
              checked={formData.jenis_kelamin === false}
              onChange={() => setFormData({ ...formData, jenis_kelamin: false })}
            />Wanita
          </label>
        </div>
      </div>
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Tanggal lahir peserta</p>
      <input
        type="date"
        name="tanggal_lahir"
        value={
          formData.tanggal_lahir instanceof Timestamp
            ? formData.tanggal_lahir.toDate().toISOString().split("T")[0] // Convert Timestamp to YYYY-MM-DD string
            : formData.tanggal_lahir || "" // If it's null, set value to empty string}
        }
        onChange={(e) => {
          // When the user changes the date, convert it to a Timestamp
          const newDate = e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null;
          setFormData({
            ...formData,
            tanggal_lahir: newDate,
          });
        }}
        className="w-34 p-1 border-1 border-black rounded-md text-black text-sm"
      />
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Kontak peserta</p>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label htmlFor="alamat_tinggal" className="text-sm font-medium text-black">Alamat Tinggal</label>
          <TextField
            name="alamat_tinggal"
            placeholder="Tuliskan alamat tinggal peserta disini"
            value={formData.kontak.alamat_tinggal}
            onChange={(e) => {
              setFormData({
                ...formData,
                kontak: {
                  ...formData.kontak,
                  alamat_tinggal: (e.target.value),
                },
              })
            }}
            error={!!errors.kontak?.alamat_tinggal}
            helperText={errors.kontak?.alamat_tinggal}
            className="w-lg"
            required
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="email" className="text-sm font-medium text-black">Kontak Email</label>
          <TextField
            name="email"
            placeholder="Tuliskan email peserta disini"
            value={formData.kontak?.email}
            onChange={(e) => {
              setFormData({
                ...formData,
                kontak: {
                  ...formData.kontak,
                  email: (e.target.value),
                },
              })
            }}
            error={!!errors.kontak?.email}
            helperText={errors.kontak?.email}
            className="w-lg"
            required
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="nomor_hp" className="text-sm font-medium text-black">Kontak Nomor HP</label>
          <TextField
            name="nomor_hp"
            placeholder="Tuliskan nomor hp peserta disini"
            value={formData.kontak.nomor_hp}
            onChange={(e) => {
              setFormData({
                ...formData,
                kontak: {
                  ...formData.kontak,
                  nomor_hp: (e.target.value),
                },
              })
            }}
            error={!!errors.kontak?.nomor_hp}
            helperText={errors.kontak?.nomor_hp}
            className="w-lg"
            required
          />
        </div>
      </div>
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Kelulusan Peserta</p>
      <div className='flex flex-row gap-x-4 justify-between w-lg'>
        <div className="flex flex-row gap-x-2">
          <label className='text-black'>
            <input
              type="radio"
              name="lulus"
              checked={formData.lulus === true}
              onChange={() => setFormData({ ...formData, lulus: true })}
            />Telah Lulus
          </label>
          <label className='text-black'>
            <input
              type="radio"
              name="lulus"
              checked={formData.lulus === false}
              onChange={() => setFormData({ ...formData, lulus: false })}
            />Belum Lulus
          </label>
        </div>
      </div>
      <p className='text-base text-black font-medium inline border-b-3 border-blue-500 w-lg'>Tanggal pendaftaran peserta</p>
      <input
        type="date"
        name="tanggal_daftar"
        value={
          formData.tanggal_daftar instanceof Timestamp
            ? formData.tanggal_daftar.toDate().toISOString().split("T")[0] // Convert Timestamp to YYYY-MM-DD string
            : formData.tanggal_daftar || "" // If it's null, set value to empty string}
        }
        onChange={(e) => {
          // When the user changes the date, convert it to a Timestamp
          const newDate = e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null;
          setFormData({
            ...formData,
            tanggal_daftar: newDate,
          });
        }}
        className="w-34 p-1 border-1 border-black rounded-md text-black text-sm"
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
};