'use client';
import { IoCheckmarkDoneOutline } from "react-icons/io5";
// import { IoTrash } from "react-icons/io5";
import { AduanItem } from "@/models/Aduan";
import { redirect } from "next/navigation";
import PaginationControls from "./Pagination";
import { updateAduan } from "@/firebase/utils/aduan-service";
import { useState } from "react";

interface AduanListProps {
  aduan: AduanItem[]
  pageSize?: number
}

export default function AduanList({ aduan, pageSize = 10 }: AduanListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(aduan.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRow = aduan.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col space-y-4">
      <table className="min-w-full table-auto shadow-md">
        <thead className="bg-gray-100 text-sm font-medium">
          <tr className="text-white bg-steelBlue">
            <th className="px-4 py-3 text-left">No</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Nama Pengadu</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Email</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Tanggal Pengaduan</th>
            <th className="px-4 py-3 min-w-[180px] text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {visibleRow.length > 0 && aduan.length > 0 ? (
            visibleRow.map((item, index) => (
              <tr key={item.id} className="text-sm text-gray-800 font-medium hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                <td className="px-4 py-3">{(currentPage - 1) * 10 + (index + 1)}</td>
                <td className="px-4 py-3">{(item.nama_depan + " " + item.nama_belakang) || "Tidak ada"}</td>
                <td className="px-4 py-3">{item.email || "Tidak ada"}</td>
                <td className="px-4 py-3">{item.created_at || "Tidak ada"}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                      onClick={() => {redirect(`/dashboard/disnaker/aduan/${item.id}`)}}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      Lengkapnya
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center min-w-[160px] px-4 py-1.5 bg-green-300 border border-green-600 rounded-md font-medium text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 ease-in-out"
                      onClick={() => {
                        updateAduan(item.id).then(() => window.location.reload());
                      }}
                    >
                      <IoCheckmarkDoneOutline className="w-4 h-4 mr-1" />
                      Tandai Selesai
                    </button>
                    {/* <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 rounded-md font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
                      onClick={() => deleteAduanById(item.id)}
                    >
                      <IoTrash className="w-4 h-4 mr-1"/>
                      Hapus
                    </button> */}
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
                  <p className="mt-2 font-medium">Tidak ada data Aduan</p>
                </div>
              </td>     
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}