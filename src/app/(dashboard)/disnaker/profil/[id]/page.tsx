'use client'

import { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation';
import Image from 'next/image';
import { getProfile } from '@/firebase/utils/profile-service';
import { Button, Box, Typography, Stack, Card, Container} from '@mui/material';

export default function ProfilePage () {
  const { id } = useParams();  // Mengambil id dari URL
  const [profile, setProfile] = useState({
    gambar: '',
    nama_lengkap: '',
    awal_jabat: '',
    akhir_jabat: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        const data = await getProfile(id as string);
        if (!data) return;
        setProfile(data);
        setLoading(false);
      };
      fetchProfile();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box className="bg-steelBlue flex justify-between items-center" sx={{ color: 'white', py: 2, px: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Informasi Mengenai Kepala Dinas Ketenagakerjaan
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ mt: 5, textAlign: 'center' }}>
          {profile ? (
            <div className="flex flex-col items-center">
              <Image
                src={profile.gambar}
                alt={profile.nama_lengkap}
                width={200}
                height={200}
                className="rounded-full object-cover aspect-square mb-4"
              />
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-row justify-center gap-x-2 text-xl">
                  <p className="font-semibold">Nama Lengkap</p>
                  <p>:</p>
                  <p>{profile.nama_lengkap}</p>
                </div>
                <div className="flex flex-row justify-center gap-x-2 text-xl">
                  <p className="font-semibold">Masa Jabatan</p>
                  <p>:</p>
                  <div className='flex flex-row'>
                    <p>{profile.awal_jabat}</p>
                    <span className="mx-1"></span>
                    <p className="font-semibold">s/d</p>
                    <span className="mx-1"></span>
                    <p>{profile.akhir_jabat}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-700">Profile not found.</p>
          )}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => redirect(`/disnaker/profil/${id}/edit`)} 
            sx={{ paddingX: 3, paddingY: 1, borderRadius: '8px', mb: 4 }}

          >
            Edit
          </Button>
        </Box>
      </Card>
    </Container>
  );
};