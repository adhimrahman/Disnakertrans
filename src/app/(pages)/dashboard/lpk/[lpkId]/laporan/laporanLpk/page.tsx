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
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { SortColumn } from "@/components/Dashboard/Sort";
import { SearchInput } from "@/components/Dashboard/SearchTable";
import { IoTrash } from "react-icons/io5";
import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from "react-icons/hi";
import { PulseLoader } from "react-spinners";

export default function LaporanLpkPage() {
  const [laporan, setLaporan] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"jenis_pelatihan" | "waktu_pelatihan" | "jurusan">("jenis_pelatihan");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { lpkId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
  }, []);

  useEffect(() => {
    setLoading(true);
    const req = query(
      collection(db, `lpk/${lpkId}/laporan`),
      where("isDelete", "==", false),
    )

    const unsubscribe = onSnapshot(req, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setLoading(false);
      setLaporan(data);
    })

    return () => unsubscribe();
  }, [lpkId]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const filtered = laporan.filter((item) => {
      const waktuPelatihan = item.waktu_pelatihan.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).toLowerCase();
  
      return (
        item.jenis_pelatihan.toLowerCase().includes(term) ||
        item.jurusan.toLowerCase().includes(term) ||
        waktuPelatihan.includes(term)
      );
    });
  
    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;

      if (sortField === "jenis_pelatihan") {
        aVal = a.jenis_pelatihan.toLowerCase();
        bVal = b.jenis_pelatihan.toLowerCase();
      } else {
        aVal = a.waktu_pelatihan.toDate().getTime();
        bVal = b.waktu_pelatihan.toDate().getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [laporan, searchTerm, sortField, sortOrder]);

  const handleSort = (field: "jenis_pelatihan" | "waktu_pelatihan" | "jurusan") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset halaman ke 1
    localStorage.setItem("itemsPerPage", value.toString()); // Simpan ke localStorage
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const seeDetail = (id: string) => { router.push(`/dashboard/lpk/${lpkId}/laporan/laporanLpk/edit/${id}`) }

  const handleSingleDelete = (id: string) => {
    const docRef = doc(db, `lpk/${lpkId}/laporan`, id);
    updateDoc(docRef, { isDelete: true });
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleSelectAllRow = () => {
    if (selectedRows.length === laporan.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(laporan.map((item) => item.id));
    }
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach(async (id) => {
      const docRef = doc(db, `lpk/${lpkId}/laporan`, id);
      await updateDoc(docRef, { isDelete: true });
    });
    setSelectedRows([]);
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Data Laporan LPK</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola laporan pelatihan lembaga pelatihan kerja</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              onClick={() => {router.push(`/dashboard/lpk/${lpkId}/laporan/laporanLpk/add`)}}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Tambah Laporan
            </button>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm} 
              placeholder="Cari laporan..."
              className="border border-gray-300 rounded-md px-4 py-2 text-sm min-w-[250px] text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-x-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">
              Tampilkan:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          
          {selectedRows.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 ml-auto">
              <span className="font-medium">{selectedRows.length}</span>
              <span className="ml-1">item terpilih</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <PulseLoader color="#3B82F6" size={12} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-sm font-medium">
                  <tr>
                    <th rowSpan={2} className="px-4 py-3 text-left text-gray-600">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedRows.length > 0 && selectedRows.length === laporan.length}
                          onChange={handleSelectAllRow}
                        />
                      </div>
                    </th>
                    <th rowSpan={2} className="px-4 py-3 text-left text-gray-600">No</th>
                    <th rowSpan={2} className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="jenis_pelatihan" label="Jenis Pelatihan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>    
                      </div>
                    </th>
                    <th rowSpan={2} className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="waktu_pelatihan" label="Waktu Pelatihan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                      </div>
                    </th>
                    <th colSpan={2} className="px-4 py-3 text-center text-gray-600 border-b border-gray-200">Jumlah Pendaftar</th>
                    <th rowSpan={2} className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="jurusan" label="Jurusan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                      </div>
                    </th>
                    <th colSpan={2} className="px-4 py-3 text-center text-gray-600 border-b border-gray-200">Jumlah Peserta Lulus</th>
                    <th rowSpan={2} className="px-4 py-3 text-center text-gray-600">Aksi</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-center text-gray-600 border-t border-gray-200">Pria</th>
                    <th className="px-4 py-3 text-center text-gray-600 border-t border-gray-200">Wanita</th>
                    <th className="px-4 py-3 text-center text-gray-600 border-t border-gray-200">Pria</th>
                    <th className="px-4 py-3 text-center text-gray-600 border-t border-gray-200">Wanita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {(currentPage - 1) * itemsPerPage + (index + 1)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.jenis_pelatihan}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {item.waktu_pelatihan.toDate().toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center font-medium">{item.jumlah_pendaftar.pria}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center font-medium">{item.jumlah_pendaftar.wanita}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.jurusan}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center font-medium">{item.jumlah_lulus.pria}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center font-medium">{item.jumlah_lulus.wanita}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2 justify-center">
                            <button
                              type="button"
                              onClick={() => {seeDetail(item.id)}}
                              className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {handleSingleDelete(item.id)}}
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 rounded-md font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
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
                      <td colSpan={10} className="px-4 py-6 text-sm text-center text-gray-500 bg-gray-50">
                        <div className="flex flex-col items-center justify-center py-5">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="mt-2 font-medium">Tidak ada data laporan</p>
                          <p className="text-xs text-gray-400 mt-1">Silakan tambahkan data laporan baru</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Menampilkan {currentItems.length} dari {filteredData.length} data
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineArrowSmLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => {
              // Show first page, last page, and pages around current page
              const pageNum = index + 1;
              const isCurrentPage = currentPage === pageNum;
              const isFirstPage = pageNum === 1;
              const isLastPage = pageNum === totalPages;
              const isWithinRange = Math.abs(pageNum - currentPage) <= 1;
              
              if (isFirstPage || isLastPage || isWithinRange) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if ((pageNum === currentPage - 2 && currentPage > 3) || 
                        (pageNum === currentPage + 2 && currentPage < totalPages - 2)) {
                return (
                  <span key={pageNum} className="px-2 py-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          {/* Simplified Mobile View */}
          <div className="sm:hidden text-sm font-medium text-gray-700">
            <span>{currentPage} dari {totalPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineArrowSmRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {selectedRows.length > 0 && (
        <div className="fixed bottom-5 inset-x-0 flex justify-center">
          <div className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <span className="font-medium">{selectedRows.length} item terpilih</span>
            <button
              onClick={handleDeleteSelectedRows}
              className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
            >
              <IoTrash className="w-4 h-4 mr-1.5" />
              Hapus Terpilih
            </button>
          </div>
        </div>
      )}
    </div>   
  );
}