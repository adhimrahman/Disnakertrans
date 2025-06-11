"use client";

import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Stack, Card, Container } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter, useParams } from "next/navigation";
import { getPelatihanById, getPelatihan as updatePelatihan } from "@/firebase/utils/pelatihan-service";
import { uploadPelatihanImage } from "@/firebase/utils/pelatihan-service";
import Image from "next/image";

export default function EditPelatihanPage() {
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal_kegiatan: "",
    gambar_pelatihan: "",
    link_form: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined; submit?: string }>(
    {}
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    type Pelatihan = {
      judul: string;
      deskripsi: string;
      tanggal_kegiatan: string;
      gambar_pelatihan: string;
      link_form: string;
      [key: string]: any;
    };

    async function fetchPelatihan() {
      const data = await getPelatihanById(params.lpkId as string, params.id as string) as Pelatihan | null;
      if (data) {
        setFormData({
          judul: data.judul,
          deskripsi: data.deskripsi,
          tanggal_kegiatan: data.tanggal_kegiatan,
          gambar_pelatihan: data.gambar_pelatihan,
          link_form: data.link_form,
        });
        setPreview(data.gambar_pelatihan);
      }
    }
    fetchPelatihan();
  }, [params.lpkId, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let gambarUrl = formData.gambar_pelatihan;
      if (file) {
        gambarUrl = await uploadPelatihanImage(file);
      }
      await updatePelatihan(params.lpkId as string, params.id as string, {
        ...formData,
        gambar_pelatihan: gambarUrl,
      });
      router.push(`/dashboard/lpk/${params.lpkId}/pelatihan`);
    } catch (err: any) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" mb={2}>Edit Pelatihan</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Judul" name="judul" value={formData.judul} onChange={handleChange} required />
            <TextField label="Deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} required multiline rows={3} />
            <TextField label="Tanggal Kegiatan" name="tanggal_kegiatan" type="date" value={formData.tanggal_kegiatan} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
            <TextField label="Link Form" name="link_form" value={formData.link_form} onChange={handleChange} />
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              Upload Gambar Sampul
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {preview && <Image src={preview} alt="Preview" width={200} height={120} style={{ objectFit: "cover" }} />}
            {errors.submit && <Typography color="error">{errors.submit}</Typography>}
            <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircleOutlineIcon />}>
              Simpan
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
