// ✅ UpdateKegiatanUploadFields.tsx disamakan dengan versi original user tanpa ubah layout atau styling, dan diberi type fix

import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from 'next/image';

interface FieldError {
  _errors?: string[];
}

interface Props {
  previews?: {
    gambar_sampul?: string;
    gambar_kegiatan?: string;
  };
  formData?: {
    gambar_sampul?: string;
    gambar_kegiatan?: string;
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'gambar_sampul' | 'gambar_kegiatan') => void;
  errors?: {
    gambar_sampul?: FieldError;
    gambar_kegiatan?: FieldError;
  };
  setFiles?: React.Dispatch<React.SetStateAction<{ gambar_sampul?: File; gambar_kegiatan?: File }>>;
  setPreviews?: React.Dispatch<React.SetStateAction<{ gambar_sampul?: string; gambar_kegiatan?: string }>>;
}

export default function UpdateKegiatanUploadFields({ previews = {}, formData = {}, handleFileChange, errors = {} }: Props) {
  const imageSampulSrc = previews?.gambar_sampul ?? formData?.gambar_sampul ?? "";
  const imageKegiatanSrc = previews?.gambar_kegiatan ?? formData?.gambar_kegiatan ?? "";

  return (
    <>
      {/* Gambar Sampul */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Gambar Sampul
        </Typography>
        <Box sx={{
          border: '1px dashed',
          borderColor: errors.gambar_sampul ? 'error.main' : 'divider',
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper'
        }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: 'none', px: 3, py: 1.5, borderRadius: 1.5, mb: 2 }}
          >
            Pilih File
            <input
              type="file"
              name='gambar_sampul'
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'gambar_sampul')}
              hidden
            />
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: formData?.gambar_sampul ? 'success.main' : 'text.secondary' }}>
            {imageSampulSrc ? (
              <div className='flex flex-col gap-y-3 items-center'>
                <Image src={imageSampulSrc} alt="Preview Gambar Sampul" width={200} height={150} />
                <div className='flex flex-row items-center gap-x-2'>
                  <CheckCircleOutlineIcon fontSize="small" className='text-green-600' />
                  <Typography variant="body2">Gambar Sampul telah diupload!</Typography>
                </div>
              </div>
            ) : (
              <Typography variant="body2" className='text-center text-red-600'>Belum ada gambar yang diunggah</Typography>
            )}
          </Box>
          {errors?.gambar_sampul?._errors?.length ? (
            <Typography variant="caption" color="error" className='text-md text-red-700'>
              {errors.gambar_sampul._errors?.[0]}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {/* Gambar Kegiatan */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Gambar Kegiatan
        </Typography>
        <Box sx={{
          border: '1px dashed',
          borderColor: errors.gambar_kegiatan ? 'error.main' : 'divider',
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper'
        }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: 'none', px: 3, py: 1.5, borderRadius: 1.5, mb: 2 }}
          >
            Pilih File
            <input
              name='gambar_kegiatan'
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'gambar_kegiatan')}
              hidden
            />
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: formData?.gambar_kegiatan ? 'success.main' : 'text.secondary' }}>
            {imageKegiatanSrc ? (
              <div className='flex flex-col gap-y-3 items-center'>
                <Image src={imageKegiatanSrc} alt="Preview Gambar Kegiatan" width={200} height={150} />
                <div className='flex flex-row items-center gap-x-2'>
                  <CheckCircleOutlineIcon fontSize="small" className='text-green-600' />
                  <Typography variant="body2">Gambar Kegiatan telah diupload!</Typography>
                </div>
              </div>
            ) : (
              <Typography variant="body2" className='text-center text-red-600'>Belum ada gambar yang diunggah</Typography>
            )}
          </Box>
          {errors?.gambar_kegiatan?._errors?.length ? (
            <Typography variant="caption" color="error" className='text-md text-red-700'>
              {errors.gambar_kegiatan._errors?.[0]}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </>
  );
}