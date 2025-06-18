'use client';

import PaginationControls from "./Pagination";
import { useState } from "react";
import { LaporanItem } from "@/models/LPK";

interface LaporanLPKListProps {
  laporanLPK: LaporanItem[]
  pageSize?: number
};

export default function LaporanLPKList({ laporanLPK, pageSize = 10 }: LaporanLPKListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(laporanLPK.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRow = laporanLPK.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white rounded-md p-4 overflow-auto">
      <table className="min-w-full table-auto shadow-md">
        <thead className="bg-gray-100 text-sm font-medium">
          <tr className="text-white bg-steelBlue">
            <th className="px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 min-w-[180px] text-center">Nama Lembaga</th>
            <th className="px-4 py-3 min-w-[180px] text-center">Tanggal Pelaksanaan</th>
            <th className="px-4 py-3 min-w-[110px] text-center">Jmh Instruktur</th>
            <th className="px-4 py-3 min-w-[110px] text-center">Jmh Inst. Bersertifikat</th>
            <th className="px-4 py-3 min-w-[110px] text-center">Yang Mendaftar</th>
            <th className="px-4 py-3 min-w-[110px] text-center">Yang Dilatih</th>
            <th className="px-4 py-3 min-w-[120px] text-center">Lulus Bersertifikat</th>
            <th className="px-4 py-3 text-center">Lulus Kompeten</th>
            <th className="px-4 py-3 text-center">Bekerja</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {visibleRow.length > 0 && laporanLPK.length > 0 ? (
            visibleRow.map((item, index) => (
              <tr key={item.id} className="text-sm text-gray-800 font-medium hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                <td className="px-4 py-3 text-center">{(currentPage - 1) * 10 + (index + 1)}</td>
                <td className="px-4 py-3">{item.nama_lembaga|| "Tidak ada"}</td>
                <td className="px-4 py-3 text-center">{item.tanggal_pelaksanaan|| "Tidak ada"}</td>
                <td className="px-4 py-3 text-center">{item.instruktur.jumlah_instruktur || 0 }</td>
                <td className="px-4 py-3 text-center">{item.instruktur.jumlah_instruktur_sertifikat || 0 }</td>
                <td className="px-4 py-3 text-center">{item.peserta.jumlah_pendaftar || 0 }</td>
                <td className="px-4 py-3 text-center">{item.peserta.jumlah_dilatih || 0 }</td>
                <td className="px-4 py-3 text-center">{item.peserta.jumlah_peserta_sertifikat || 0 }</td>
                <td className="px-4 py-3 text-center">{item.peserta.jumlah_lulus || 0 }</td>
                <td className="px-4 py-3 text-center">{item.peserta.jumlah_bekerja || 0 }</td>
              </tr>
            ))
          ) : (
          <tr>
            <td colSpan={7} className="px-4 py-6 text-sm text-center text-gray-500 bg-gray-50">
              <div className="flex flex-col items-center justify-center py-5">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="mt-2 font-medium">Tidak ada data konten kegiatan</p>
                <p className="text-xs text-gray-400 mt-1">Silakan tambahkan data kegiatan baru</p>
              </div>
            </td>    
          </tr>
          )}
        </tbody>
      </table>
      <span className="px-4" />
        <div className="flex flex-row justify-end">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    </div>
  );
};