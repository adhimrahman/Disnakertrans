'use client'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { createPelatihanSchema } from '@/validation/pelatihan-validation'// Pastikan path-nya benar
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/firebase/config'

const formSchema = z.object({
  nama: z.string().min(1, { message: 'Nama pelatihan wajib diisi' }),
  tanggal: z.string().min(1, { message: 'Tanggal wajib diisi' }),
  lokasi: z.string().min(1, { message: 'Lokasi wajib diisi' }),
  penyelenggara: z.string().min(1, { message: 'Penyelenggara wajib diisi' }),
  deskripsi: z.string().min(1, { message: 'Deskripsi wajib diisi' }),
})

type FormData = z.infer<typeof formSchema>

export default function TambahPelatihanPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    try {
      let gambarUrl = ''

      if (selectedImage) {
        const storageRef = ref(storage, `pelatihan/${selectedImage.name}`)
        const uploadTask = uploadBytesResumable(storageRef, selectedImage)
        await uploadTask
        gambarUrl = await getDownloadURL(uploadTask.snapshot.ref)
      }

      createPelatihanSchema.parse({ ...data, gambar: gambarUrl })

      toast.success('Pelatihan berhasil ditambahkan!')
      reset()
      router.push('/admin/pelatihan')
    } catch (error) {
      console.error('Gagal menambahkan pelatihan:', error)
      toast.error('Gagal menambahkan pelatihan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Tambah Pelatihan" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nama Pelatihan"
                fullWidth
                {...register('nama')}
                error={!!errors.nama}
                helperText={errors.nama?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Tanggal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('tanggal')}
                error={!!errors.tanggal}
                helperText={errors.tanggal?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lokasi"
                fullWidth
                {...register('lokasi')}
                error={!!errors.lokasi}
                helperText={errors.lokasi?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Penyelenggara"
                fullWidth
                {...register('penyelenggara')}
                error={!!errors.penyelenggara}
                helperText={errors.penyelenggara?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Deskripsi"
                fullWidth
                multiline
                rows={4}
                {...register('deskripsi')}
                error={!!errors.deskripsi}
                helperText={errors.deskripsi?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Gambar
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSelectedImage(e.target.files[0])
                    }
                  }}
                />
              </Button>
              {selectedImage && (
                <Typography variant="body2" mt={1}>
                  Gambar dipilih: {selectedImage.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Tambah Pelatihan'}
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
