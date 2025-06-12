'use client';

import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { DocumentData } from "firebase/firestore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { SortColumn } from "@/components/Dashboard/Sort"; // Pastikan komponen ini ada
import { SearchInput } from "@/components/Dashboard/SearchTable"; // Pastikan komponen ini ada
import { IoTrash } from "react-icons/io5";
import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from "react-icons/hi";
import { PulseLoader } from "react-spinners";
import dayjs from "dayjs";
import 'dayjs/locale/id'; // Impor lokal Indonesia untuk format tanggal

// Mapping nama bulan Indonesia ke angka (0-11)
const BULAN_TO_NUMBER: Record<string, number> = {
  "JANUARI": 0, "FEBRUARI": 1, "MARET": 2, "APRIL": 3, "MEI": 4, "JUNI": 5,
  "JULI": 6, "AGUSTUS": 7, "SEPTEMBER": 8, "OKTOBER": 9, "NOVEMBER": 10, "DESEMBER": 11
};

export default function LaporanLpkPage() {
  const [laporan, setLaporan] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Set loading true di awal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<"jenis_pelatihan" | "waktu_pelatihan" | "jurusan">("waktu_pelatihan");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // Default urutkan dari terbaru
  const { lpkId } = useParams();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const monthYear = searchParams.get('month');
  
  const [filterYear, filterMonth] = useMemo(() => {
    if (!monthYear) return [null, null];
    const parts = monthYear.split(' – ');
    if (parts.length !== 2) return [null, null];
    const year = parseInt(parts[0]);
    const monthName = parts[1].toUpperCase();
    const month = BULAN_TO_NUMBER[monthName] ?? null;
    return [year, month];
  }, [monthYear]);

  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
  }, []);

  useEffect(() => {
    if (!lpkId) return;
    setLoading(true);
    const req = query(
      collection(db, `lpk/${lpkId}/laporan`),
      where("isDelete", "==", false),
    );

    const unsubscribe = onSnapshot(req, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setLaporan(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lpkId]);

  const filteredData = useMemo(() => {
    let baseData = [...laporan];
    
    if (filterYear !== null && filterMonth !== null) {
      baseData = baseData.filter(item => {
        // Pastikan waktu_pelatihan ada dan merupakan timestamp yang valid
        if (!item.waktu_pelatihan || !item.waktu_pelatihan.toDate) return false;
        const date = item.waktu_pelatihan.toDate();
        return date.getFullYear() === filterYear && date.getMonth() === filterMonth;
      });
    }

    const term = searchTerm.toLowerCase();
    const filtered = baseData.filter((item) => {
      const waktuPelatihan = item.waktu_pelatihan?.toDate ? dayjs(item.waktu_pelatihan.toDate()).locale('id').format('DD MMMM YYYY').toLowerCase() : '';
  
      return (
        (item.jenis_pelatihan || '').toLowerCase().includes(term) ||
        (item.jurusan || '').toLowerCase().includes(term) ||
        waktuPelatihan.includes(term)
      );
    });
  
    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortField === "waktu_pelatihan") {
        aVal = a.waktu_pelatihan?.toDate ? a.waktu_pelatihan.toDate().getTime() : 0;
        bVal = b.waktu_pelatihan?.toDate ? b.waktu_pelatihan.toDate().getTime() : 0;
      } else {
        aVal = (a[sortField] || '').toLowerCase();
        bVal = (b[sortField] || '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [laporan, searchTerm, sortField, sortOrder, filterYear, filterMonth]);

  // Logika Paginasi (menggunakan filteredData)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleClearFilter = () => {
    // Kembali ke halaman detail LPK (halaman dengan card)
    router.push(`/dashboard/lpk/${lpkId}/history`);
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* --- BAGIAN HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Data Laporan LPK</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola laporan pelatihan lembaga pelatihan kerja</p>
            {monthYear && (
              <div className="mt-3 flex items-center gap-x-2">
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Menampilkan laporan untuk: {monthYear.split(' – ').join(' ')}
                </span>
                <button 
                  onClick={handleClearFilter}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Hapus filter
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              className="bg-steelBlue hover:bg-darkBlue transition px-4 py-2 rounded-xl text-white w-full lg:w-auto hover:cursor-pointer"
              onClick={() => router.push(`/dashboard/lpk/${lpkId}/laporan/laporanLpk`)}
            >
              + Tambah Laporan
            </button>
            <div className="flex items-center w-full sm:w-auto">
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Cari laporan..." 
                className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
        
        {/* --- BAGIAN TABEL (UPDATED STYLING) --- */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto shadow-md">
            <thead className="bg-gray-100 text-sm font-medium">
              <tr>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">No</th>
                <th className="px-4 py-3 text-left text-white bg-steelBlue min-w-[250px]">Jenis Pelatihan</th>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">Jurusan</th>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">Waktu Pelatihan</th>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-center text-gray-500 bg-gray-50">
                    <div className="flex flex-col items-center justify-center py-5">
                      <PulseLoader color="#3B82F6" />
                      <p className="mt-2 font-medium">Memuat data laporan...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50 font-medium transition-colors duration-150 ease-in-out">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.jenis_pelatihan || "Tidak ada"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.jurusan || "Tidak ada"}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.waktu_pelatihan?.toDate ? dayjs(item.waktu_pelatihan.toDate()).locale('id').format('DD MMMM YYYY') : 'Tanggal tidak valid'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        {/* <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                          onClick={() => router.push(`/dashboard/lpk/${lpkId}/laporan/detail/${item.id}`)}
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                          </svg>
                          Detail
                        </button> */}
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                          onClick={() => router.push(`/dashboard/lpk/${lpkId}/laporan/edit/${item.id}`)}
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 rounded-md font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
                          onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
                              // Implement delete function here
                              console.log('Delete laporan:', item.id);
                            }
                          }}
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
                  <td colSpan={5} className="px-4 py-6 text-sm text-center text-gray-500 bg-gray-50">
                    <div className="flex flex-col items-center justify-center py-5">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="mt-2 font-medium">Tidak ada data laporan</p>
                      <p className="text-xs text-gray-400 mt-1">Tidak ada data laporan yang cocok untuk filter ini</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- BAGIAN PAGINASI (UPDATED STYLING) --- */}
        <span className="px-4" />
        {filteredData.length > itemsPerPage && (
          <div className="flex flex-row justify-between items-center mt-4">
            <p className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredData.length)} dari {filteredData.length} hasil
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
              >
                <HiOutlineArrowSmLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
              >
                Selanjutnya
                <HiOutlineArrowSmRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>   
  );
}