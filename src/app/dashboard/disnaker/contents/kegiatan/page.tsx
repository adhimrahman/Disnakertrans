'use client';

import { IoTrash } from "react-icons/io5";
import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { SortColumn } from "@/components/dashboard/Sort";
import { SearchInput } from "@/components/dashboard/SearchTable";

export default function KegiatanPage() { 
  const [kegiatan, setKegiatan] = useState<DocumentData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"Judul" | "Tanggal">("Judul");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Track the sort order
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
  }, []);

  useEffect(() => {
    // Query data untuk mengambil data yang isDelete == false
    const req = query(
      collection(db, "Kegiatan"),
      where("isDelete", "==", false),
    );
    const unsubscribe = onSnapshot(req, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKegiatan(data);
    });

    return () => unsubscribe();
  }, [])

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
  
    const filtered = kegiatan.filter((item) => {
      const tanggalStr = item.Tanggal.toDate().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).toLowerCase();
  
      return (
        item.Judul.toLowerCase().includes(term) ||
        tanggalStr.includes(term)
      );
    });
  
    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;
  
      if (sortField === "Judul") {
        aVal = a.Judul.toLowerCase();
        bVal = b.Judul.toLowerCase();
      } else {
        aVal = a.Tanggal.toDate().getTime();
        bVal = b.Tanggal.toDate().getTime();
      }
  
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  
    return sorted;
  }, [kegiatan, searchTerm, sortField, sortOrder]);

  const handleSort = (field: "Judul" | "Tanggal") => {
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

  const handelEdit = (id: string) => { router.push(`/dashboard/disnaker/contents/kegiatan/edit/${id}`) }
  
  const handleSingleDelete = (id: string) => {
    const docRef = doc(db, "Kegiatan", id);
    updateDoc(docRef, { isDelete: true });
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
    if (selectedRows.length === kegiatan.length) {
      setSelectedRows([]);  // Deselect all
    } else {
      setSelectedRows(kegiatan.map((item) => item.id));  // Select all
    }
  };

  const handleDeleteSelectedRows = () => {
    // Perform delete on selected rows (soft delete in this case)
    selectedRows.forEach(async (id) => {
      const docRef = doc(db, "Kegiatan", id);
      await updateDoc(docRef, { isDelete: true });
    });
    setSelectedRows([]);  // Clear selected rows after delete
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className='flex flex-row gap-x-2 justify-between w-full'>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 w-24 rounded-lg"
          onClick={() => {router.push('/dashboard/disnaker/accounts/add')}}
        >
          Tambah
        </button>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm} 
          placeholder="Cari Kegiatan..."
          className="border border-black rounded-md px-4 py-2 text-sm w-sm text-black"

        />
      </div>
      <div className="flex flex-row gap-x-2 items-center">
        <p className="text-black text-sm font-base">Menampilkan: </p>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-14 text-black"
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
        <table className="min-w-full table-auto shadow-sm rounded-md">
          <thead className="bg-gray-100 text-sm justify-start text-left">
            <tr>
              <th className="px-4 py-2 border-b text-black">
                <input
                  type="checkbox"
                  checked={selectedRows.length > 0 && selectedRows.length === kegiatan.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-2 border-b text-black">No</th>
              <th className="px-4 py-2 border-b text-black">
                <div className="flex flex-row gap-x-2">
                  <SortColumn field="Judul" label="Nama Kegiatan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                </div>
              </th>
              <th className="px-4 py-2 border-b text-black">
                <div className="flex flex-row gap-x-2">
                  <SortColumn field="Tanggal" label="Tanggal Unggahan" currentField={sortField} currentOrder={sortOrder} onSort={handleSort}/>
                </div>
              </th>
              <th className="px-4 py-2 border-b text-black">Link Unggahan</th>
              <th className="px-4 py-2 border-b text-black"></th>
              <th className="px-4 py-2 border-b text-black"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 text-sm">
                <td className="px-4 py-2 border-b text-black">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                  />
                </td>
                <td className="px-4 py-2 border-b text-black">{index + 1}</td>
                <td className="px-4 py-2 border-b text-black">{item.Judul}</td>
                <td className="px-4 py-2 border-b text-black">{item.Tanggal.toDate().toLocaleDateString('id-ID', {
                  day  : '2-digit',
                  month: 'long',
                  year : 'numeric',
                })}</td>
                <td className="px-4 py-2 border-b text-black">
                  <Link
                    href={item.link || ""}
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  >
                    {item.link ? 'Link' : 'None'}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b text-black">
                  <button
                    type="reset"
                    className="bg-gray-200 hover:bg-gray-300 text-black font-base py-1 px-4 w-16 rounded-lg"
                    onClick={() => {handelEdit(item.id)}}
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
            ))}
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
      </div>
    </div>
  );
}