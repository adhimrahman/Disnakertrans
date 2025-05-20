'use client';

import { IoTrash } from "react-icons/io5";
import Link from "next/link";
import { KegiatanItem } from "@/models/Kegiatan";
import { redirect } from "next/navigation";
import PaginationControls from "./Pagination";
import { deleteKegiatanById } from "@/firebase/utils/kegiatan-service";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";

interface KegiatanListProps {
  kegiatan: KegiatanItem[];
  pageSize?: number;
}

export default function KegiatanList({ kegiatan, pageSize = 10 }: KegiatanListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(kegiatan.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRow = kegiatan.slice(startIndex, startIndex + pageSize);
  
  function formatTanggal(value: string | Timestamp | undefined | null): string {
    if (!value) return "-";

    let date: Date;

    if (typeof value === "string") {
      date = new Date(value);
    } else if (value instanceof Timestamp) {
      date = value.toDate();
    } else {
      return "-";
    }

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  
  return (
    <>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-sm font-medium">
          <tr>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">No</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue min-w-[250px]">Judul</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Tanggal</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Link Unggahan</th>
            <th className="px-4 py-3 text-left text-white bg-steelBlue">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          { visibleRow.length > 0 && kegiatan.length > 0 ? (
            visibleRow.map((item, index) => (
              <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{(index + 1)}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.Judul}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{formatTanggal(item.Tanggal)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.link ? (
                    <Link
                      href={item.link || ""}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      target="_blank" 
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
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                      onClick={() => {redirect(`/dashboard/disnaker/contents/kegiatan/edit/${item.id}`)}}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 rounded-md font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
                      onClick={() => deleteKegiatanById(item.id)}
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
          onClick={() => redirect('/dashboard/disnaker/contents/kegiatan/add')}
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