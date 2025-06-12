'use client';

import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from "react-icons/hi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { IoTrash } from "react-icons/io5";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
  doc,
  DocumentData
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { SortColumn } from "@/components/Dashboard/Sort";
import { SearchInput } from "@/components/Dashboard/SearchTable";
import { PulseLoader } from "react-spinners";

export default function AccountsPage() {  
  const [akun, setAkun] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"nama" |"tanggal_daftar" | "lpk" | "jurusan">("nama");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Track the sort order
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const { lpkId } = useParams();

  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchAllPeserta = async () => {
      if (!lpkId) return;
      console.log("fetchAllPeserta triggered. sort:", sortField, sortOrder);
      const pesertaRef = collection(db, `lpk/${lpkId}/peserta`);
      const req = query(
        pesertaRef,
        where("isDelete", "==", false),
      );

      const pesertaSnapshot = await getDocs(req);

      const pesertaList = pesertaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      pesertaList.sort((a, b) => {
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

      setAkun(pesertaList);
      setLoading(false);
      console.log("Data peserta:", pesertaList);
    };

    fetchAllPeserta();
  }, [lpkId, sortField, sortOrder]);

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
    const term = searchTerm.toLowerCase().trim();
  
    return akun.filter((item) => {
      try {
        const status = item.lulus === true ? "lulus" : "belum lulus";
        return (
          (item.nama && item.nama.toLowerCase().includes(term)) ||
          (item.jurusan && item.jurusan.toLowerCase().includes(term)) ||
          (item.lpk && item.lpk.toString().includes(term)) ||
          status.includes(term)
        );
      } catch (error) {
        console.error("Error filtering item:", error, item);
        return false;
      }
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

  const handelEdit = async (id: string) => { 
    router.push(`/dashboard/lpk/${lpkId}/laporan/peserta/edit/${id}`);
  }

  const handleSingleDelete = async (id: string) => {
    try {
      const docRef = doc(db, `lpk/${lpkId}/peserta`, id);
      await updateDoc(docRef, { isDelete: true });
      // Notification could be added here
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);  // Deselect row
      } else {
        return [...prevSelectedRows, id];  // Select row
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === akun.length) {
      setSelectedRows([]);  // Deselect all
    } else {
      setSelectedRows(akun.map((item) => item.id));  // Select all
    }
  };

  const handleDeleteSelectedRows = async () => {
    try {
      // Use Promise.all to wait for all deletions to complete
      await Promise.all(selectedRows.map(async (id) => {
        const docRef = doc(db, `lpk/${lpkId}/peserta`, id);
        await updateDoc(docRef, { isDelete: true });
      }));
      setSelectedRows([]);  // Clear selected rows after delete
    } catch (error) {
      console.error("Error deleting multiple documents:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Data Peserta LPK</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola data peserta lembaga pelatihan kerja</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              onClick={() => {router.push(`/dashboard/lpk/${lpkId}/laporan/peserta/add`)}}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Tambah Peserta
            </button>
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
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-sm font-medium">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedRows.length > 0 && selectedRows.length === akun.length}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
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
                    <th className="px-4 py-3 text-left text-gray-600">Aksi</th>
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
                              })
                            : "-"
                          }
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => {handelEdit(item.id)}}
                              className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
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
                      <td colSpan={9} className="px-4 py-6 text-sm text-center text-gray-500 bg-gray-50">
                        <div className="flex flex-col items-center justify-center py-5">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <p className="mt-2 font-medium">Tidak ada data peserta</p>
                          <p className="text-xs text-gray-400 mt-1">Silakan tambahkan data peserta baru</p>
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
