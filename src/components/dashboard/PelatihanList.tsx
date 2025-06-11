'use client';

import Link from "next/link";
import { PelatihanItem } from "@/models/Pelatihan";
import { useState } from "react";
import PaginationControls from "./Pagination"; // jika Anda punya komponen ini

interface PelatihanListProps {
  pelatihan: PelatihanItem[];
  pageSize?: number;
}

export default function PelatihanList({ pelatihan, pageSize = 10 }: PelatihanListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(pelatihan.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRow = pelatihan.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <table className="min-w-full table-auto shadow-md">
        <thead className="bg-gray-100 text-sm font-medium">
          <tr>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">No</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Judul</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Deskripsi</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Tanggal Kegiatan</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Gambar</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Link Form</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {visibleRow.length > 0 ? (
            visibleRow.map((item, index) => (
              <tr key={item.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-3 text-sm">{item.judul || 'Tidak ada'}</td>
                <td className="px-4 py-3 text-sm">{item.deskripsi || 'Tidak ada'}</td>
                <td className="px-4 py-3 text-sm">
                  {item.tanggal_kegiatan
                    ? new Date(item.tanggal_kegiatan).toLocaleDateString()
                    : 'Tidak ada'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.gambar_pelatihan ? (
                    <img
                      src={item.gambar_pelatihan}
                      alt="gambar"
                      className="h-16 w-28 object-cover rounded"
                    />
                  ) : (
                    'Tidak ada'
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.link_form ? (
                    <Link
                      href={item.link_form}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Formulir
                    </Link>
                  ) : (
                    'Tidak ada'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-6">
                Tidak ada data pelatihan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <span />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
