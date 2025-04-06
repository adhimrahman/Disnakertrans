import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHighlight from "@/components/ContactHightlight";
import { Timestamp } from "firebase/firestore";

function formatTanggal(timestamp: Timestamp) {
    const date = timestamp.toDate();
    return date
        .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Makassar",
        timeZoneName: "short",
        })
        .replace("Waktu Indonesia Tengah", "WITA");
}

export default function KegiatanDetail() {
    const params = useParams();
    // const router = useRouter();
    const { id } = params;

    const [data, setData] = useState<unknown>(null);
    const [semuaKegiatan, setSemuaKegiatan] = useState<unknown[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const docRef = doc(db, "Kegiatan", id as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData({ id: docSnap.id, ...docSnap.data() });
            }
        };

        const fetchSemuaKegiatan = async () => {
            const querySnapshot = await getDocs(collection(db, "Kegiatan"));
            const allData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown[];
            setSemuaKegiatan(allData);
        };

        fetchData();
        fetchSemuaKegiatan();
    }, [id]);

    if (!data) return <div>Loading...</div>;

    const indexSekarang = semuaKegiatan.findIndex((item) => item.id === id);
    const kegiatanSebelumnya = semuaKegiatan[indexSekarang - 1];
    const kegiatanBerikutnya = semuaKegiatan[indexSekarang + 1];

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <main className="container mx-auto px-4 py-10 max-w-4xl">
                <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    {data.Judul.toUpperCase()}
                </h1>

                <p className="text-sm text-gray-600 mb-6">
                    Tanggal: {formatTanggal(data.Tanggal)}
                </p>

                <Image
                    src={data.ImageSampul} fill
                    alt={data.Judul}
                    className="w-full rounded-lg mb-6"
                />

                <p className="text-justify text-gray-800 leading-relaxed whitespace-pre-line">
                    {data.Deskripsi}
                </p>

                {data.ImageDesc && (
                    <Image
                        src={data.ImageDesc} fill
                        alt="Gambar Tambahan"
                        className="w-full rounded-lg mt-8"
                    />
                )}

                {/* Navigasi Kegiatan */}
                <div className="py-8 bg-white border-t border-gray-300 mt-12 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {kegiatanSebelumnya && (
                        <div className="flex flex-col items-start">
                            <Image
                                src={kegiatanSebelumnya.ImageSampul} fill
                                alt={kegiatanSebelumnya.Judul}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <p className="text-sm text-gray-700 leading-snug mb-2">
                                {kegiatanSebelumnya.Deskripsi.slice(0, 80)}...
                            </p>
                            <a
                                href={`/kegiatan/${kegiatanSebelumnya.id}`}
                                className="text-sm text-blue-700 hover:underline"
                            >
                                ← Artikel Sebelumnya
                            </a>
                        </div>
                    )}

                    {kegiatanBerikutnya && (
                        <div className="flex flex-col items-start md:items-end text-right">
                            <Image
                                src={kegiatanBerikutnya.ImageSampul} fill
                                alt={kegiatanBerikutnya.Judul}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <p className="text-sm text-gray-700 leading-snug mb-2">
                                {kegiatanBerikutnya.Deskripsi.slice(0, 80)}...
                            </p>
                            <a
                                href={`/kegiatan/${kegiatanBerikutnya.id}`}
                                className="text-sm text-blue-700 hover:underline"
                            >
                                Artikel Berikutnya →
                            </a>
                        </div>
                    )}
                </div>
            </main>

            <ContactHighlight />
            <Footer />
        </div>
    );
}