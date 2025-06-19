import { Box, TextField, Typography } from '@mui/material';
import { KegiatanTextFieldProps } from '@/models/DashboardKegiatan';

export default function UpdateKegiatanTextFields({ formData, handleChange, errors }: KegiatanTextFieldProps) {
    return (
        <>
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Judul Konten
                </Typography>
                <TextField
                    placeholder='Tuliskan judul konten kegiatan disini'
                    name="judul"
                    value={formData.judul || ''}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="medium"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
                {errors?.judul?._errors?.map((msg: string, i: number) => (
                    <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
                ))}
            </Box>

            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Deskripsi Kegiatan
                </Typography>
                <TextField
                    placeholder='Tuliskan deskripsi pekerjaan disini'
                    name="deskripsi"
                    value={formData.deskripsi || ''}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={8}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
                {errors?.deskripsi?._errors?.map((msg: string, i: number) => (
                    <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
                ))}
            </Box>

            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Tanggal Kegiatan
                </Typography>
                <input
                    name='tanggal_kegiatan'
                    value={formData.tanggal_kegiatan || ''}
                    onChange={handleChange}
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors?.tanggal_kegiatan?._errors?.map((msg: string, i: number) => (
                    <p key={i} className='text-red-600 mt-2 text-sm text-right'>*{msg}</p>
                ))}
            </Box>
        </>
    );
}