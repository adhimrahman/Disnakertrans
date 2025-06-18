'use client';

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { DocumentData } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { SortColumn } from "@/components/dashboard/Sort";
import { SearchInput } from "@/components/dashboard/SearchTable";
import { IoTrash } from "react-icons/io5";
import { useRouter, useParams } from "next/navigation";
import { PulseLoader } from "react-spinners";

export default function LaporanLpkPage() {
  const [laporan, setLaporan] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"nama_lembaga" | "tanggal_pelaksanaan">("nama_lembaga");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const { lpkId } = useParams();
  const [akunDocId, setAkunDocId] = useState<string>("");

  useEffect(() => {
    const getAkunId = async () => {
      const akunRef = collection(db, "akun");
      const q = query(akunRef, where("lpkId", "==", lpkId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const akunDoc = querySnapshot.docs[0];
        setAkunDocId(akunDoc.id);
      }
    };
    if (lpkId) getAkunId();
  }, [lpkId]);

  useEffect(() => {
    if (!akunDocId) return;
    setLoading(true);
    const laporanRef = collection(db, "laporan");
    const laporanQuery = query(laporanRef, where("reference", "==", doc(db, "akun", akunDocId)));
    const unsubscribe = onSnapshot(laporanQuery, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setLaporan(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [akunDocId]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = laporan.filter((item) => {
      // Format and lowercase the date for searching
      const waktuPelaksanaan = item.tanggal_pelaksanaan?.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).toLowerCase();

      // Check if the search term exists in any of the relevant fields
      return (
        (item.nama_lembaga?.toLowerCase() || '').includes(term) ||
        (item.jenis_pelatihan?.toLowerCase() || '').includes(term) ||
        (item.keterangan?.toLowerCase() || '').includes(term) ||
        waktuPelaksanaan.includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortField === "nama_lembaga") {
        aVal = a.nama_lembaga.toLowerCase();
        bVal = b.nama_lembaga.toLowerCase();
      } else {
        aVal = a.tanggal_pelaksanaan?.toDate().getTime() ?? 0;
        bVal = b.tanggal_pelaksanaan?.toDate().getTime() ?? 0;
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [laporan, searchTerm, sortField, sortOrder]);

  const handleSort = (field: "nama_lembaga" | "tanggal_pelaksanaan") => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem("itemsPerPage", value.toString());
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSingleDelete = async (id: string) => {
    const confirmDelete = confirm("Apakah anda yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, `laporan`, id);
      await deleteDoc(docRef);

      // langsung update state lokal (biar tidak reload ulang snapshot)
      setLaporan(prev => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

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

  const handleEdit = (id: string) => {
    router.push(`/dashboard/lpk/${lpkId}/laporan/edit/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-8 text-black">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Data Laporan LPK</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola laporan pelatihan lembaga pelatihan kerja</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push(`/dashboard/lpk/${lpkId}/laporan/add`)}
            >
              Tambah Laporan
            </button>
            <div className="flex items-center w-full sm:w-auto">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm} 
                placeholder="Cari laporan..."
                className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full min-w-[250px] text-gray-800"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-x-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">Tampilkan:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
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
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-sm font-medium">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-gray-600">
                    <SortColumn field="nama_lembaga" label="Nama Lembaga" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600">Jenis Pelatihan</th>
                  <th className="px-4 py-3 text-left text-gray-600">Keterangan</th>
                  <th className="px-4 py-3 text-left text-gray-600">
                    <SortColumn field="tanggal_pelaksanaan" label="Tanggal Pelaksanaan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                  </th>
                  <th className="px-4 py-3 text-center text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                    <td className="px-4 py-3">{item.nama_lembaga}</td>
                    <td className="px-4 py-3">{item.jenis_pelatihan}</td>
                    <td className="px-4 py-3">{item.keterangan}</td>
                    <td className="px-4 py-3">
                      {item.tanggal_pelaksanaan?.toDate().toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </button>
                        <button className="text-red-500" onClick={() => handleSingleDelete(item.id)}>
                          <IoTrash className="inline w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
