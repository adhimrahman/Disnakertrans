'use client';
import React, { useState } from 'react';
import { Box, Button, Card, CircularProgress, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { addKegiatan } from '@/firebase/utils/kegiatan-service';
import { createKegiatanSchema, createKegiatanFormData } from '@/validation/kegiatan-validation';
import KegiatanTextFields from '@/components/dashboard/kegiatan/KegiatanTextFields';
import KegiatanUploadFields from '@/components/dashboard/kegiatan/KegiatanUploadFields';

type FieldError = { _errors?: string[] };
type KegiatanFormErrors = {
    judul?: FieldError;
    deskripsi?: FieldError;
    tanggal_kegiatan?: FieldError;
    gambar_sampul?: FieldError;
    gambar_kegiatan?: FieldError;
};

export default function AddKegiatanPage() {
    const [formData, setFormData] = useState<createKegiatanFormData>({
        judul: '',
        deskripsi: '',
        tanggal_kegiatan: '',
        gambar_sampul: '',
        gambar_kegiatan: '',
    });
    const [errors, setErrors] = useState<KegiatanFormErrors>({});
    const [files, setFiles] = useState<{ gambar_sampul?: File; gambar_kegiatan?: File[] }>({});
    const [previews, setPreviews] = useState<{ gambar_sampul?: string; gambar_kegiatan?: string[] }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: { _errors: [] } }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'gambar_sampul' | 'gambar_kegiatan'
    ) => {
        const filesInput = e.target.files;
        if (!filesInput) return;

        if (field === 'gambar_sampul') {
            const file = filesInput[0];
            if (file) {
            setFiles((prev) => ({ ...prev, gambar_sampul: file }));
            const previewUrl = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, gambar_sampul: previewUrl }));
            }
        }

        if (field === 'gambar_kegiatan') {
            const selectedFiles = Array.from(filesInput);
            setFiles((prev) => ({ ...prev, gambar_kegiatan: selectedFiles }));
            const previewsUrl = selectedFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => ({ ...prev, gambar_kegiatan: previewsUrl }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = createKegiatanSchema.safeParse({
            ...formData,
            gambar_sampul: previews.gambar_sampul,
            gambar_kegiatan: previews.gambar_kegiatan,
        });

        if (!result.success) {
            setErrors(result.error.format());
            setIsSubmitting(false);
            return;
        }

        try {
            const success = await addKegiatan(formData, files);
            if (success) {
                router.push('/disnaker/konten/kegiatan');
            } else {
                alert('Gagal menambahkan kegiatan.');
            }
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
                    <KegiatanTextFields formData={formData} handleChange={handleChange} errors={errors} />
                    <KegiatanUploadFields setFiles={setFiles} setPreviews={setPreviews} previews={previews} errors={errors}
                        handleFileChange={handleFileChange}
                    />

                    <Box textAlign="right">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                        >
                            {isSubmitting ? 'Mengirim...' : 'SUBMIT'}
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
}