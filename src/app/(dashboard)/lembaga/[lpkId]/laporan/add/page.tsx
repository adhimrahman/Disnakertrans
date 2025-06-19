  'use client';

  import React, { useState, useEffect } from 'react';
  import { collection, addDoc, Timestamp, doc, getDocs, query, where } from 'firebase/firestore';
  import { db } from '@/firebase/config';
  import { useRouter, useParams } from 'next/navigation';
  import {
    Container, Card, Box, Divider, Stack, TextField, Button, Typography,
    Checkbox, IconButton, Grid, FormControlLabel
  } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import DeleteIcon from '@mui/icons-material/Delete';

  type Instruktur = { nama: string; sertifikasi: boolean; };

  type LaporanLpk = {
    jenis_pelatihan: string;
    nama_lembaga: string;
    keterangan: string;
    waktu_pelatihan: Timestamp;
    jumlah_pendaftar: { pria: number; wanita: number; };
    jumlah_lulus: { pria: number; wanita: number; };
    instruktur: Instruktur[];
    lulus_bersertifikat: number;
    lulus_kompeten: number;
    bekerja: number;
  };

  type ErrorState = Partial<Record<keyof LaporanLpk | 'waktu_pelatihan', string>>;

  export default function ContentsJobVacancyForm() {
    const router = useRouter();
    const { lpkId } = useParams();
    const laporanRef = collection(db, `laporan`);

    const [formData, setFormData] = useState<LaporanLpk>({
      jenis_pelatihan: '',
      nama_lembaga: '',
      keterangan: '',
      waktu_pelatihan: Timestamp.now(),
      jumlah_pendaftar: { pria: 0, wanita: 0 },
      jumlah_lulus: { pria: 0, wanita: 0 },
      instruktur: [{ nama: '', sertifikasi: false }],
      lulus_bersertifikat: 0,
      lulus_kompeten: 0,
      bekerja: 0,
    });

    const [jenisLembaga, setJenisLembaga] = useState<string>("");
    const [akunDocId, setAkunDocId] = useState<string>("");
    const [waktuPelatihanStr, setWaktuPelatihanStr] = useState<string>('');
    const [errors, setErrors] = useState<ErrorState>({});
    const [instrukturErrors, setInstrukturErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
      const fetchAkun = async () => {
        const akunSnapshot = await getDocs(query(collection(db, "akun"), where("lpkId", "==", lpkId)));
        akunSnapshot.forEach((docu) => {
          const data = docu.data() as { jenis_lembaga: string };
          setJenisLembaga(data.jenis_lembaga);
          setAkunDocId(docu.id);
        });
      };
      fetchAkun();
    }, [lpkId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors((prev: ErrorState) => ({ ...prev, [name]: '' }));
    };

    const handleNestedChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      parent: 'jumlah_pendaftar' | 'jumlah_lulus',
      child: 'pria' | 'wanita'
    ) => {
      const { value } = e.target;
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: Number(value) }
      }));
    };

    const handleInstrukturChange = (index: number, field: keyof Instruktur, value: string | boolean) => {
      const newInstruktur = [...formData.instruktur];
      newInstruktur[index] = { ...newInstruktur[index], [field]: value };
      setFormData(prev => ({ ...prev, instruktur: newInstruktur }));
    };

    const addInstruktur = () => {
      setFormData(prev => ({
        ...prev,
        instruktur: [...prev.instruktur, { nama: '', sertifikasi: false }]
      }));
    };

    const removeInstruktur = (index: number) => {
      if (formData.instruktur.length > 1) {
        const newInstruktur = [...formData.instruktur];
        newInstruktur.splice(index, 1);
        setFormData(prev => ({ ...prev, instruktur: newInstruktur }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const newErrors: ErrorState = {};
      const newInstrukturErrors: string[] = [];

      if (!formData.jenis_pelatihan) newErrors.jenis_pelatihan = 'Jenis pelatihan harus diisi';
      if (!formData.nama_lembaga) newErrors.nama_lembaga = 'Nama lembaga harus diisi';
      if (!formData.keterangan) newErrors.keterangan = 'Keterangan harus diisi';
      if (!waktuPelatihanStr) newErrors.waktu_pelatihan = 'Waktu pelatihan harus diisi';

      formData.instruktur.forEach((inst, i) => {
        if (!inst.nama) {
          newInstrukturErrors[i] = `Nama instruktur #${i + 1} harus diisi`;
        } else newInstrukturErrors[i] = '';
      });

      setErrors(newErrors);
      setInstrukturErrors(newInstrukturErrors);

      if (Object.keys(newErrors).length > 0 || newInstrukturErrors.some(Boolean)) {
        setIsSubmitting(false);
        return;
      }

      try {
        await addDoc(laporanRef, {
          jenis_pelatihan: formData.jenis_pelatihan,
          nama_lembaga: formData.nama_lembaga,
          keterangan: formData.keterangan,
          tanggal_pelaksanaan: Timestamp.fromDate(new Date(waktuPelatihanStr)),
          instruktur: {
            jumlah_instruktur: formData.instruktur.length,
            jumlah_instruktur_sertifikat: formData.instruktur.filter(i => i.sertifikasi).length,
          },
          peserta: {
            jumlah_pendaftar: formData.jumlah_pendaftar.pria + formData.jumlah_pendaftar.wanita,
            jumlah_lulus: formData.jumlah_lulus.pria + formData.jumlah_lulus.wanita,
            jumlah_peserta_sertifikat: formData.lulus_bersertifikat,
            jumlah_dilatih: formData.lulus_kompeten,
            jumlah_bekerja: formData.bekerja
          },
          jenis_lembaga: jenisLembaga,
          reference: doc(db, `akun/${akunDocId}`),
          created_at: Timestamp.now(),
          updated_at: Timestamp.now()
        });

        alert('Laporan berhasil ditambahkan');
        router.push(`/lembaga/${lpkId}/laporan`);
      } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan saat menyimpan data');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={1}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Tambah Laporan LPK
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2}>
              <TextField label="Jenis Pelatihan" name="jenis_pelatihan" value={formData.jenis_pelatihan}
                onChange={handleChange} error={!!errors.jenis_pelatihan} helperText={errors.jenis_pelatihan} fullWidth required />

              <TextField label="Nama Lembaga" name="nama_lembaga" value={formData.nama_lembaga}
                onChange={handleChange} error={!!errors.nama_lembaga} helperText={errors.nama_lembaga} fullWidth required />

              <TextField label="Keterangan" name="keterangan" value={formData.keterangan}
                onChange={handleChange} error={!!errors.keterangan} helperText={errors.keterangan} fullWidth required />

              <TextField label="Waktu Pelatihan" type="date" value={waktuPelatihanStr} onChange={e => setWaktuPelatihanStr(e.target.value)}
                error={!!errors.waktu_pelatihan} helperText={errors.waktu_pelatihan} InputLabelProps={{ shrink: true }} fullWidth required />

              <Typography variant="subtitle1">Jumlah Pendaftar</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField label="Pria" type="number" value={formData.jumlah_pendaftar.pria}
                  onChange={(e) => handleNestedChange(e, 'jumlah_pendaftar', 'pria')} fullWidth inputProps={{ min: 0 }} /></Grid>
                <Grid item xs={6}><TextField label="Wanita" type="number" value={formData.jumlah_pendaftar.wanita}
                  onChange={(e) => handleNestedChange(e, 'jumlah_pendaftar', 'wanita')} fullWidth inputProps={{ min: 0 }} /></Grid>
              </Grid>

              <Typography variant="subtitle1">Jumlah Lulus</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField label="Pria" type="number" value={formData.jumlah_lulus.pria}
                  onChange={(e) => handleNestedChange(e, 'jumlah_lulus', 'pria')} fullWidth inputProps={{ min: 0 }} /></Grid>
                <Grid item xs={6}><TextField label="Wanita" type="number" value={formData.jumlah_lulus.wanita}
                  onChange={(e) => handleNestedChange(e, 'jumlah_lulus', 'wanita')} fullWidth inputProps={{ min: 0 }} /></Grid>
              </Grid>

              <Typography variant="subtitle1">Instruktur</Typography>
              {formData.instruktur.map((instruktur, index) => (
                <Grid container key={index} spacing={2} alignItems="center">
                  <Grid item xs={9}><TextField label={`Nama Instruktur #${index + 1}`} error={!!instrukturErrors[index]}
                    helperText={instrukturErrors[index]} value={instruktur.nama}
                    onChange={(e) => handleInstrukturChange(index, 'nama', e.target.value)} fullWidth /></Grid>
                  <Grid item xs={2}>
                    <FormControlLabel control={<Checkbox checked={instruktur.sertifikasi}
                      onChange={(e) => handleInstrukturChange(index, 'sertifikasi', e.target.checked)} color="primary" />}
                      label="Sertifikasi" />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeInstruktur(index)} disabled={formData.instruktur.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addInstruktur} sx={{ alignSelf: 'flex-start' }}>
                Tambah Instruktur
              </Button>

              <Typography variant="subtitle1">Statistik Kelulusan</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}><TextField label="Lulus Bersertifikat" type="number" name="lulus_bersertifikat"
                  value={formData.lulus_bersertifikat} onChange={handleChange} fullWidth inputProps={{ min: 0 }} /></Grid>
                <Grid item xs={4}><TextField label="Lulus Kompeten" type="number" name="lulus_kompeten"
                  value={formData.lulus_kompeten} onChange={handleChange} fullWidth inputProps={{ min: 0 }} /></Grid>
                <Grid item xs={4}><TextField label="Bekerja" type="number" name="bekerja"
                  value={formData.bekerja} onChange={handleChange} fullWidth inputProps={{ min: 0 }} /></Grid>
              </Grid>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Laporan'}
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }
