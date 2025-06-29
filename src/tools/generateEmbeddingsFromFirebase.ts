import 'dotenv/config';
import fs from 'fs';
import { pipeline } from '@xenova/transformers';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

type Kegiatan = { judul?: string; deskripsi?: string; tanggal_kegiatan?: string };
type Lowongan = { judul?: string; deskripsi?: string; tenggat_lowongan?: string; perusahaan?: string };
type Pelatihan = { judul?: string; deskripsi?: string; tanggal_kegiatan?: string };
type FirebaseDoc = Kegiatan | Lowongan | Pelatihan;

const extractText = (doc: FirebaseDoc, type: string): string => {
    if (type === 'kegiatan') {
        const d = doc as Kegiatan;
        return `${d.judul || ''}\n${d.deskripsi || ''}\nTanggal: ${d.tanggal_kegiatan || ''}`;
    }
    if (type === 'lowongan') {
        const d = doc as Lowongan;
        return `${d.judul || ''}\n${d.deskripsi || ''}\nTenggat: ${d.tenggat_lowongan || ''}\nPerusahaan: ${d.perusahaan || ''}`;
    }
    if (type === 'pelatihan') {
        const d = doc as Pelatihan;
        return `${d.judul || ''}\n${d.deskripsi || ''}\nTanggal: ${d.tanggal_kegiatan || ''}`;
    }

    return '';
};

const fetchData = async () => {
    const [kegiatan, lowongan, pelatihan] = await Promise.all([
        getDocs(collection(db, 'kegiatan')),
        getDocs(collection(db, 'lowongan')),
        getDocs(collection(db, 'pelatihan')),
    ]);

    const data: { id: string; type: string; text: string }[] = [];

    kegiatan.forEach(doc => data.push({
        id: doc.id,
        type: 'kegiatan',
        text: extractText(doc.data(), 'kegiatan'),
    }));

    lowongan.forEach(doc => data.push({
        id: doc.id,
        type: 'lowongan',
        text: extractText(doc.data(), 'lowongan'),
    }));

    pelatihan.forEach(doc => data.push({
        id: doc.id,
        type: 'pelatihan',
        text: extractText(doc.data(), 'pelatihan'),
    }));
    
    return data;
};

const generateEmbeddings = async () => {
    const data = await fetchData();
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const embedded = await Promise.all(data.map(async item => {
        const output = await extractor(item.text, { pooling: 'mean', normalize: true });
        return { ...item, embedding: output.data };
    }));
    fs.writeFileSync('public/embeddings.json', JSON.stringify(embedded, null, 2));
    console.log(`✅ Embeddings berhasil disimpan ke public/embeddings.json (total: ${embedded.length})`);
};

generateEmbeddings();