'use client';
import { Aduan } from "@/models/Aduan";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Card, Container,} from '@mui/material';
import { getAduanById } from "@/firebase/utils/aduan-service";

export default function AduanDetailPage() {
    const [formData, setFormData] = useState<Partial<Aduan>>({
        nama_depan: "", nama_belakang: "", email: "", no_telp: "", pesan: ""
    });

    const { id } = useParams();

    useEffect(() => {
        async function fetchAduan() {
            const data = await getAduanById(id as string);
            if (data) { setFormData({
                id: id as string,
                nama_depan: data.nama_depan as string,
                nama_belakang: data.nama_belakang as string,
                email: data.email as string,
                no_telp: data.no_telp,
                pesan: data.pesan as string
            })};
        };
        fetchAduan();
    }, [id]);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                        Detail Aduan
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    {/* Baris 1: Nama Depan & Nama Belakang */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                        <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Nama Depan
                            </Typography>
                            <Typography variant="body1">
                                {formData.nama_depan || '-'}
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Nama Belakang
                            </Typography>
                            <Typography variant="body1">
                                {formData.nama_belakang || '-'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Baris 2: Email & Nomor Handphone */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                        <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Email
                            </Typography>
                            <Typography variant="body1">
                                {formData.email || '-'}
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Nomor Handphone
                            </Typography>
                            <Typography variant="body1">
                                {"0" + (formData.no_telp || '-')}
                            </Typography>
                        </Box>
                    </Box>
                
                    {/* Baris 3: Pesan (full width) */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Pesan
                        </Typography>
                        <Typography variant="body1" whiteSpace="pre-line">
                            {formData.pesan || '-'}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
};