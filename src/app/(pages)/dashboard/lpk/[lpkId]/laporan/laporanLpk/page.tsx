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

  const seeDetail = (id: string) => { router.push(`/dashboard/disnaker/lpk/${id}`) }

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
    <div className="flex flex-col gap-y-12">
      <div className='flex flex-row gap-x-2 justify-end w-full'>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm} 
          placeholder="Cari Laporan..."
          className="border border-black rounded-md px-4 py-2 text-sm w-sm text-black"
        />
      </div>
      <div className="flex flex-row gap-x-2 items-center">
        <p className="text-black text-sm font-base">Menampilkan: </p>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-black rounded-md px-4 py-2 text-sm w-14 text-black"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </select>
        <p className="text-black text-sm font-base">entries</p>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader color="#3B82F6" />
          </div>
        ) : (
          <>
            <table className="min-w-full table-auto border-collapse shadow-xl rounded-md">
            <thead className="bg-white text-sm justify-center text-center">
              <tr>
                <th rowSpan={2} className="px-4 py-1 border-b text-black">
                  <input
                    type="checkbox"
                    checked={selectedRows.length > 0 && selectedRows.length === laporan.length}
                    onChange={handleSelectAllRow}
                  />
                </th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black text-sm font-light">No</th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black text-sm font-light">
                  <SortColumn field="jenis_pelatihan" label="Jenis Pelatihan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>    
                </th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black font-light">
                  <SortColumn field="waktu_pelatihan" label="Waktu Pelatihan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                </th>
                <th colSpan={2} className="px-4 py-1 border-b text-black font-light">Jumlah Pendaftar</th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black font-light">
                  <SortColumn field="jurusan" label="Jurusan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                </th>
                <th colSpan={2} className="px-4 py-1 border-b text-black font-light">Jumlah Peserta Lulus</th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black font-light">Laporan Lengkap</th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black font-light"></th>
                <th rowSpan={2} className="px-4 py-1 border-b text-black font-light"></th>
              </tr>
              <tr>
                <th className="px-4 py-1 border-black border-b border-t border-r text-black">Pria</th>
                <th className="px-4 py-1 border-black border-b border-t border-l text-black">Wanita</th>
                <th className="px-4 py-1 border-black border-b border-t border-r text-black">Pria</th>
                <th className="px-4 py-1 border-black border-b border-t border-l text-black">Wanita</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 text-sm border-b border-black">
                      <td className="px-4 py-2 border-b text-black">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleSelectRow(item.id)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-t text-black">{index + 1}</td>
                      <td className="px-4 py-2 border-b border-t text-black">{item.jenis_pelatihan}</td>
                      <td className="px-4 py-2 border-b border-t text-black text-center">{item.waktu_pelatihan.toDate().toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</td>
                      <td className="px-4 py-2 border-b border-t text-black text-center">{item.jumlah_pendaftar.pria}</td>
                      <td className="px-4 py-2 border-b border-t text-black text-center">{item.jumlah_pendaftar.wanita}</td>
                      <td className="px-4 py-2 border-b border-t text-black">{item.jurusan}</td>
                      <td className="px-4 py-2 border-b border-t text-black text-center">{item.jumlah_lulus.pria}</td>
                      <td className="px-4 py-2 border-b border-t text-black text-center">{item.jumlah_lulus.wanita}</td>
                      <td className="px-4 py-2 border-b border-t text-black text-center">
                        <button
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 text-black font-base py-1 px-4 w-16 rounded-lg"
                          onClick={() => { seeDetail(item.id) }}
                        >Detail
                        </button>
                      </td>
                      <td className="px-4 py-2 border-b text-black">
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 w-12 rounded-lg text-center"
                          onClick={() => { handleSingleDelete(item.id) }}
                        >
                          <IoTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 bg-white text-black text-center border-b">
                      Tidak ada data laporan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex items-center space-x-2 mt-8 justify-end">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-base text-black border rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                <HiOutlineArrowSmLeft />
              </button>
    
              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 text-sm font-base ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'text-black hover:bg-gray-300'
                  } border rounded-md`}
                >
                  {index + 1}
                </button>
              ))}
    
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-base text-black border rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                <HiOutlineArrowSmRight />
              </button>
            </div>
            {selectedRows.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={handleDeleteSelectedRows}
                  className="bg-red-500 hover:bg-red-700 text-white text-xs font-medium py-2 px-4 rounded-lg"
                >
                  Hapus Terpilih
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>   
  );
}