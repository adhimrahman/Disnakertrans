'use client';

import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from "react-icons/hi";
import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  DocumentData
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { SortColumn } from "@/components/dashboard/Sort";
import { SearchInput } from "@/components/dashboard/SearchTable";
import { PulseLoader } from "react-spinners";

export default function AccountsPage() {  
  const [akun, setAkun] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<"nama" |"tanggal_daftar" | "lpk" | "jurusan">("tanggal_daftar");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Track the sort order
  const [searchTerm, setSearchTerm] = useState<string>("");


  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchAllPeserta = async () => {
      console.log("fetchAllPeserta triggered. sort:", sortField, sortOrder);
      const lpkCollection = collection(db, "lpk");
      const lpkSnapshot = await getDocs(lpkCollection);

      const semuaPeserta = await Promise.all(
        lpkSnapshot.docs.map(async (lpkDoc) => {
          const lpkId = lpkDoc.id;
          const pesertaRef = collection(db, `lpk/${lpkId}/peserta`);
          const pesertaQuery = query(
            pesertaRef,
            where("isDelete", "==", false),
          );

          const pesertaSnapshot = await getDocs(pesertaQuery);

          const pesertaList = pesertaSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLoading(false);
          return pesertaList;
        })
      );

      const gabungPeserta = semuaPeserta.flat();

      gabungPeserta.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any  
        const getField = (item: any) => {
          if (sortField === "nama") return item.nama.toLowerCase();
          if (sortField === "jurusan") return item.jurusan.toLowerCase();
          if (sortField === "tanggal_daftar") return item.tanggal_daftar?.toDate();
          if (sortField === "lpk") return item.lpk
          return "";
        };
      
        const valA = getField(a);
        const valB = getField(b);
      
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      setAkun(gabungPeserta);
      console.log("Data peserta:", gabungPeserta);
    };

    fetchAllPeserta();
  }, [sortField, sortOrder]);

  const umur = (tanggalLahir: Timestamp) => {
    const today = new Date();
    const birthDate = tanggalLahir.toDate(); // Konversi dari Firestore Timestamp ke Date
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    // Koreksi jika belum ulang tahun tahun ini
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
  
    return akun.filter((item) => {
      const status = item.lulus === true ? "lulus" : "belum lulus";
      return (
        item.nama.toLowerCase().includes(term) ||
        item.jurusan.toLowerCase().includes(term) ||
        item.lpk.toString().includes(term) ||
        status.includes(term)
      );
    });
  }, [akun, searchTerm]);

  const handleSort = (field: "nama" | "jurusan" | "lpk" | "tanggal_daftar") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
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

  return (
    <div className="flex flex-col gap-y-8">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Akun</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola data seluruh akun pengguna</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm} 
              placeholder="Cari peserta..."
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
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <PulseLoader color="#3B82F6" size={12} />
          </div>
        ) : (
          <>
            <div className="overflow-hidden bg-white rounded-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-sm font-medium">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600">No</th>
                    <th className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="nama" label="Nama" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="lpk" label="LPK" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="jurusan" label="Jurusan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600">Umur</th>
                    <th className="px-4 py-3 text-left text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-gray-600">
                      <div className="flex flex-row items-center gap-x-2">
                        <SortColumn field="tanggal_daftar" label="Tanggal Daftar" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {(currentPage - 1) * itemsPerPage + (index + 1)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.nama}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.lpk}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.jurusan}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{item.tanggal_lahir ? `${umur(item.tanggal_lahir)} tahun` : "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.lulus 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {item.lulus ? "Lulus" : "Belum lulus"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {item.tanggal_daftar instanceof Timestamp
                            ? item.tanggal_daftar.toDate().toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            }) : "-"
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-sm text-center text-gray-500 bg-gray-50">
                        <div className="flex flex-col items-center justify-center py-5">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <p className="mt-2 font-medium">Tidak ada data peserta</p>
                          <p className="text-xs text-gray-400 mt-1">Tidak ada data peserta yang tersedia</p>
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
    </div>
  );
}