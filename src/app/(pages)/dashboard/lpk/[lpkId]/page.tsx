'use client';

import { Container, Box, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import DashboardLembagaHeader from '@/components/dashboard/DashboardLembagaHeader';
import DashboardLembagaStats from '@/components/dashboard/DashboardLembagaStats';
import DashboardLembagaActivity from '@/components/dashboard/DashboardLembagaActivity';
import DashboardLembagaActions from '@/components/dashboard/DashboardLembagaActions';

export default function DashboardLembagaPage() {
  const { lpkId } = useParams();
  const [akunDocId, setAkunDocId] = useState<string>("");
  const [stats, setStats] = useState({ totalLaporan: 0, totalPelatihan: 0 });
  const [recentLaporan, setRecentLaporan] = useState<any[]>([]);
  const [recentPelatihan, setRecentPelatihan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAkunDoc = async () => {
      if (!lpkId) return;
      const akunRef = collection(db, "akun");
      const akunQuery = query(akunRef, where("lpkId", "==", lpkId));
      const akunSnapshot = await getDocs(akunQuery);
      if (!akunSnapshot.empty) {
        setAkunDocId(akunSnapshot.docs[0].id);
      }
    };
    getAkunDoc();
  }, [lpkId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!akunDocId) return;
      setLoading(true);
      const akunRef = doc(db, 'akun', akunDocId);
      const laporanRef = query(collection(db, 'laporan'), where("reference", "==", akunRef));
      const laporanSnapshot = await getDocs(laporanRef);
      const laporanData = laporanSnapshot.docs.map(doc => doc.data());
      setStats(prev => ({ ...prev, totalLaporan: laporanData.length }));
      setRecentLaporan(laporanData.sort((a, b) => b.tanggal_pelaksanaan.toDate() - a.tanggal_pelaksanaan.toDate()).slice(0, 2));

      const pelatihanRef = query(collection(db, 'pelatihan'), where("reference", "==", akunRef));
      const pelatihanSnapshot = await getDocs(pelatihanRef);
      const pelatihanData = pelatihanSnapshot.docs.map(doc => doc.data());
      setStats(prev => ({ ...prev, totalPelatihan: pelatihanData.length }));
      setRecentPelatihan(pelatihanData.sort((a, b) => b.tanggal_kegiatan.toDate() - a.tanggal_kegiatan.toDate()).slice(0, 2));
      setLoading(false);
    };

    fetchData();
  }, [akunDocId]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <DashboardLembagaHeader />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DashboardLembagaStats {...stats} />
          <DashboardLembagaActivity recentLaporan={recentLaporan} recentPelatihan={recentPelatihan} />
          <DashboardLembagaActions lpkId={lpkId as string} />
        </>
      )}
    </Container>
  );
}
