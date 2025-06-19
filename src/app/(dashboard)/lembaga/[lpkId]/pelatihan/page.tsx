'use client';

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  getDocs,
  Timestamp
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SearchInput } from "@/components/dashboard/SearchTable";
import { SortColumn } from "@/components/dashboard/Sort";
import { IoTrash } from "react-icons/io5";
import { PulseLoader } from "react-spinners";

type PelatihanData = {
  id: string;
  judul: string;
  link_form: string;
  tanggal_kegiatan: Timestamp;
};


export default function PelatihanLpkPage() {
  const { lpkId } = useParams();
  const router = useRouter();

  const [pelatihan, setPelatihan] = useState<PelatihanData[]>([]);
  const [akunDocId, setAkunDocId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<"judul" | "tanggal_kegiatan">("tanggal_kegiatan");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const getAkunId = async () => {
      const akunRef = collection(db, "akun");
      const q = query(akunRef, where("lpkId", "==", lpkId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setAkunDocId(snapshot.docs[0].id);
      }
    };
    if (lpkId) getAkunId();
  }, [lpkId]);

  useEffect(() => {
    if (!akunDocId) return;
    setLoading(true);
    const pelatihanRef = collection(db, "pelatihan");
    const q = query(pelatihanRef, where("reference", "==", doc(db, "akun", akunDocId)));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PelatihanData, "id">)
        }));
      setPelatihan(data);
      setLoading(false);
    });
    return () => unsub();
  }, [akunDocId]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = pelatihan.filter((item) => {
      // Format and lowercase the date for searching
      const tanggalKegiatan = item.tanggal_kegiatan?.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).toLowerCase();

      // Check if search term exists in any relevant field
      return (
        (item.judul?.toLowerCase() || '').includes(term) ||
        (item.link_form?.toLowerCase() || '').includes(term) ||
        tanggalKegiatan.includes(term)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aVal = sortField === "judul" ? a.judul.toLowerCase() : a.tanggal_kegiatan?.toDate().getTime();
      const bVal = sortField === "judul" ? b.judul.toLowerCase() : b.tanggal_kegiatan?.toDate().getTime();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [pelatihan, searchTerm, sortField, sortOrder]);

  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: "judul" | "tanggal_kegiatan") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pelatihan ini?")) return;
    try {
      await deleteDoc(doc(db, "pelatihan", id));
      setPelatihan((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/lembaga/${lpkId}/pelatihan/edit/${id}`);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem("pelatihanItemsPerPage", value.toString());
  };

  return (
    <div className="flex flex-col gap-y-8 text-black">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Data Pelatihan</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola konten pelatihan lembaga pelatihan kerja</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push(`/lembaga/${lpkId}/pelatihan/add`)}
            >
              Tambah Pelatihan
            </button>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari judul..."
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full sm:w-[250px]"
            />
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
                    <SortColumn field="judul" label="Judul" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600">Link Form</th>
                  <th className="px-4 py-3 text-left text-gray-600">
                    <SortColumn field="tanggal_kegiatan" label="Tanggal Kegiatan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort} />
                  </th>
                  <th className="px-4 py-3 text-center text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                    <td className="px-4 py-3">{item.judul}</td>
                    <td className="px-4 py-3">
                      <a href={item.link_form} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Lihat Form
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {item.tanggal_kegiatan?.toDate().toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
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
        <div className="px-4 py-2 text-sm text-gray-600">
            Menampilkan halaman {currentPage} dari {totalPages}
        </div>
    </div>
  );
}