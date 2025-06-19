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
    const [files, setFiles] = useState<{ gambar_sampul?: File; gambar_kegiatan?: File }>({});
    const [previews, setPreviews] = useState<{ gambar_sampul?: string; gambar_kegiatan?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: { _errors: [] } }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_sampul' | 'gambar_kegiatan') => {
        const MAX_FILE_SIZE = 2 * 1024 * 1024;
        if (field === 'gambar_kegiatan') {
        const file = e.target.files?.[0];
        if (!file || file.size > MAX_FILE_SIZE) {
            alert('Ukuran file terlalu besar. Maksimum 2MB.');
            return;
        }
        setFiles(prev => ({ ...prev, [field]: file }));
        setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        } else {
        const file = e.target.files?.[0];
        if (!file || file.size > MAX_FILE_SIZE) {
            alert('Ukuran file terlalu besar. Maksimum 2MB.');
            return;
        }
        setFiles(prev => ({ ...prev, [field]: file }));
        setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = createKegiatanSchema.safeParse({
            ...formData,
            gambar_sampul: previews.gambar_sampul || "",
            gambar_kegiatan: previews.gambar_kegiatan || "",
        });

        if (!result.success) {
            setErrors(result.error.format());
            setIsSubmitting(false);
            return;
        } else {
            setErrors({});
        }

        try {
            const success = await addKegiatan(formData, files);
            if (success) {
                alert('Kegiatan berhasil ditambahkan!');
                router.push('/disnaker/konten/kegiatan');
            } else {
                alert('Gagal menambahkan kegiatan.');
            }
        } catch (e) {
            alert('Terjadi kesalahan.');
            console.error(e);
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