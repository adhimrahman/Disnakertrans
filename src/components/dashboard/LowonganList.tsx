'use client';

import { IoTrash } from "react-icons/io5";
import Link from "next/link";
import { LowonganItem } from "@/models/Lowongan";
import { redirect } from "next/navigation";
import PaginationControls from "./Pagination";
import { deleteLowonganById } from "@/firebase/utils/lowongan-service";
import { useState } from "react";

interface LowonganListProps {
  lowongan: LowonganItem[]
  pageSize?: number
}

export default function LowonganList({ lowongan, pageSize = 10 }: LowonganListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(lowongan.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRow = lowongan.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-sm font-medium">
          <tr className="text-white bg-steelBlue">
            <th className="px-4 py-3 text-left">No</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Nama Lowongan</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Perusahaan</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Batas Lowongan</th>
            <th className="px-4 py-3 text-left min-w-[180px]">Tipe</th>
            <th className="px-4 py-3 text-left">Link Lowongan</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Tanggal Unggah</th>
            <th className="px-4 py-3 text-left">Link Konten</th>
            <th className="px-4 py-3 text-left">Aksi</th>
            <th className="px-4 py-3 text-left"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {visibleRow.length > 0 && lowongan.length > 0 ? (
            visibleRow.map((item, index) => (
              <tr key={item.id} className="text-sm text-gray-800 font-medium hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                <td className="px-4 py-3">{(currentPage - 1) * 10 + (index + 1)}</td>
                <td className="px-4 py-3">{item.nama_lowongan || "Tidak ada"}</td>
                <td className="px-4 py-3">{item.Perusahaan || "Tidak ada"}</td>
                <td className="px-4 py-3">{item.BatasLowongan || "Tidak ada"}</td>
                <td className="px-4 py-3">{item.Tipe.join(", ") || "Tidak ada"}</td>
                <td className="px-4 py-3">
                  {item.LinkLowongan ? (
                    <Link
                      href={item.LinkLowongan ?? ""}
                      target="_blank"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      rel="noopener noreferrer"
                    > 
                      <span className="underline">Link</span>
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                    </Link>
                  ) : (
                    <span className="text-gray-500">Tidak ada</span>
                  )}
                </td>
                <td className="px-4 py-3">{item.tanggal_unggah}</td>
                <td className="px-4 py-3">
                  {item.link_konten ? (
                    <Link
                      href={item.link_konten ?? ""}
                      target="_blank"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      rel="noopener noreferrer"
                    > 
                      <span className="underline">Link</span>
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                    </Link>
                  ) : (
                    <span className="text-gray-500">Tidak ada</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                      onClick={() => {redirect(`/dashboard/disnaker/contents/lowongan/edit/${item.id}`)}}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 rounded-md font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
                      onClick={() => deleteLowonganById(item.id)}
                    >
                      <IoTrash className="w-4 h-4 mr-1"/>
                      Hapus
                    </button>
                  </div>
                </td>
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
        <div className="flex flex-row justify-between">
          <button
            className="bg-steelBlue hover:bg-darkBlue transition px-4 py-2 rounded-xl text-white w-full lg:w-auto hover:cursor-pointer"
              onClick={() => redirect('/dashboard/disnaker/contents/lowongan/add')}
          >
            + Tambah Konten
          </button>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    </>
  );
}