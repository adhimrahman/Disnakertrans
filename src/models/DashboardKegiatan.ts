export interface KegiatanFormErrors {
    [key: string]: {
        _errors?: string[];
    };
}

export interface KegiatanTextFieldProps {
    formData: {
        judul: string;
        deskripsi: string;
        tanggal_kegiatan: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: KegiatanFormErrors;
}

export interface KegiatanUploadFieldProps {
    setFiles: React.Dispatch<React.SetStateAction<{
        gambar_sampul?: File;
        gambar_kegiatan?: File[];
    }>>;
    setPreviews: React.Dispatch<React.SetStateAction<{
        gambar_sampul?: string;
        gambar_kegiatan?: string[];
    }>>;
    previews: {
        gambar_sampul?: string;
        gambar_kegiatan?: string[];
    };
    errors: KegiatanFormErrors;
}