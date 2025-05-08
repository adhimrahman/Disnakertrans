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
import { SortColumn } from "@/components/dashboard/Sort";
import { SearchInput } from "@/components/dashboard/SearchTable";
import { PulseLoader } from "react-spinners";

export default function Peserta() {
  const [akun, setAkun] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"nama" | "tanggal_daftar" | "lpk" | "jurusan">("nama");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { lpkId } = useParams();

  useEffect(() => {
    setIsClient(true); // Hanya render setelah client-side aktif
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedItemsPerPage = localStorage.getItem("itemsPerPage");
      if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
    }
  }, [isClient]);

  useEffect(() => {
    const fetchAllPeserta = async () => {
      if (!lpkId) return;

      setLoading(true);
      const pesertaRef = collection(db, `lpk/${lpkId}/peserta`);
      const req = query(pesertaRef, where("isDelete", "==", false));
      const pesertaSnapshot = await getDocs(req);

      const pesertaList = pesertaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      pesertaList.sort((a, b) => {
        const getField = (item: any) => {
          if (sortField === "nama") return item.nama.toLowerCase();
          if (sortField === "jurusan") return item.jurusan.toLowerCase();
          if (sortField === "tanggal_daftar") return item.tanggal_daftar?.toDate();
          if (sortField === "lpk") return item.lpk;
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
    };

    if (isClient) {
      fetchAllPeserta();
    }
  }, [lpkId, sortField, sortOrder, isClient]);

  const umur = (tanggalLahir: Timestamp) => {
    const today = new Date();
    const birthDate = tanggalLahir.toDate();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
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
    setCurrentPage(1);
    if (isClient) localStorage.setItem("itemsPerPage", value.toString());
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (id: string) => {
    router.push(`/dashboard/lpk/${lpkId}/laporan/peserta/edit/${id}`);
  };

  const handleSingleDelete = async (id: string) => {
    const docRef = doc(db, `lpk/${lpkId}/peserta`, id);
    await updateDoc(docRef, { isDelete: true });
    setAkun((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === akun.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(akun.map((item) => item.id));
    }
  };

  const handleDeleteSelectedRows = async () => {
    await Promise.all(
      selectedRows.map((id) =>
        updateDoc(doc(db, `lpk/${lpkId}/peserta`, id), { isDelete: true })
      )
    );
    setAkun((prev) => prev.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]);
  };

  if (!isClient) return null; // Hindari mismatch saat SSR

  return (
    <div className="flex flex-col gap-y-12">
      <div className='flex flex-row gap-x-2 justify-between w-full'>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 w-24 rounded-lg"
          onClick={() => { router.push(`/dashboard/lpk/${lpkId}/laporan/peserta/add`) }}
        >Tambah</button>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          className="border border-black rounded-md px-4 py-2 text-sm w-sm text-black"
        />
      </div>

      <div className="flex flex-row gap-x-2 items-center">
        <p className="text-black text-sm font-base">Menampilkan:</p>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-14 text-black"
        >
          {[10, 20, 30, 40, 50].map((n) => <option key={n} value={n}>{n}</option>)}
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
            <table className="min-w-full table-auto shadow-md rounded-xl">
              <thead className="bg-white text-sm">
                <tr>
                  <th className="px-4 py-2 text-left border-b text-black">
                    <input
                      type="checkbox"
                      checked={selectedRows.length > 0 && selectedRows.length === akun.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2 text-left border-b text-black">No</th>
                  <th className="px-4 py-2 text-left border-b text-black">
                    <div className="flex flex-row gap-x-2">
                      <SortColumn field="nama" label="Nama" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left border-b text-black">
                    <div className="flex flex-row gap-x-2">
                      <SortColumn field="lpk" label="LPK" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left border-b text-black">
                    <div className="flex flex-row gap-x-2">
                      <SortColumn field="jurusan" label="Jurusan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left border-b text-black">Umur</th>
                  <th className="px-4 py-2 text-left border-b text-black">Status</th>
                  <th className="px-4 py-2 text-left border-b text-black">
                    <div className="flex flex-row gap-x-2">
                      <SortColumn field="tanggal_daftar" label="Tanggal Daftar" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left border-b text-black"></th>
                  <th className="px-4 py-2 text-left border-b text-black"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 text-sm">
                    <td className="px-4 py-2 border-b text-black">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </td>
                    <td className="px-4 py-2 border-b text-black">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                    <td className="px-4 py-2 border-b text-black">{item.nama}</td>
                    <td className="px-4 py-2 border-b text-black">{item.lpk}</td>
                    <td className="px-4 py-2 border-b text-black">{item.jurusan}</td>
                    <td className="px-4 py-2 border-b text-black">{item.tanggal_lahir ? `${umur(item.tanggal_lahir)} tahun` : "-"}</td>
                    <td className="px-4 py-2 border-b text-black">{item.lulus ? "Lulus" : "Belum lulus"}</td>
                    <td className="px-4 py-2 border-b text-black">{item.tanggal_daftar instanceof Timestamp
                      ? item.tanggal_daftar.toDate().toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        }): "-"}
                    </td>
                    <td className="px-4 py-2 border-b text-black">
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-black font-base py-1 px-4 w-16 rounded-lg"
                        onClick={() => {handleEdit(item.id)}}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-2 border-b text-black">
                      <button
                        type="reset"
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 w-12 rounded-lg text-center"
                        onClick={() => {handleSingleDelete(item.id)}}
                      >
                        <IoTrash className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center bg-white text-black text-sm">
                      Tidak ada data peserta
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center space-x-2 mt-8 justify-end">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm border rounded-md hover:bg-gray-300 disabled:opacity-50">
                <HiOutlineArrowSmLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 text-sm font-base ${currentPage === index + 1 ? "bg-blue-500 text-white" : "text-black hover:bg-gray-300"} border rounded-md`}>
                  {index + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm border rounded-md hover:bg-gray-300 disabled:opacity-50">
                <HiOutlineArrowSmRight />
              </button>
            </div>

            {selectedRows.length > 0 && (
              <div className="mt-4">
                <button onClick={handleDeleteSelectedRows} className="bg-red-500 hover:bg-red-700 text-white text-xs font-medium py-2 px-4 rounded-lg">
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
