import Image from "next/image";
import { PelatihanItem } from "@/models/Pelatihan";

export default function PelatihanList({ pelatihan }: { pelatihan: PelatihanItem[] }) {
  if (pelatihan.length === 0) {
    return <div className="text-center text-gray-500">Tidak ada pelatihan ditemukan.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pelatihan.map((item) => (
        <div key={item.id} className="border rounded-md p-4 shadow-sm">
          <img src={item.gambar_pelatihan} alt={item.judul} className="w-full h-40 object-cover rounded-md mb-2" />
          <h2 className="font-semibold text-lg">{item.judul}</h2>
          <p className="text-sm text-gray-700 line-clamp-3">{item.deskripsi}</p>
          <div className="mt-2 text-sm text-gray-500">
            Tanggal Kegiatan: {new Date(item.tanggal_kegiatan).toLocaleDateString()}
          </div>
          <a
            href={item.link_form}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Daftar
          </a>
        </div>
      ))}
    </div>
  );
}
