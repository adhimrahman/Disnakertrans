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
import { SortColumn } from "@/components/Dashboard/Sort";
import { SearchInput } from "@/components/Dashboard/SearchTable";
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
    <div className="flex flex-col gap-y-12">
      <div className='flex flex-row gap-x-2 justify-end w-full hover:ring-black focus:ring-2 focus:ring-blue-500'>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm} 
          className="border border-gray-400 rounded-md px-4 py-2 text-sm w-sm text-black "
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
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader color="#3B82F6" />
          </div>
        ) : (
          <>
            <table className="min-w-full table-auto shadow-md rounded-xl">
              <thead className="bg-white text-sm">
                <tr>
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
                </tr>
              </thead>
              <tbody className="bg-white">
                {akun.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-4 py-2 border-t text-black">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                      <td className="px-4 py-2 border-t text-black">{item.nama}</td>
                      <td className="px-4 py-2 border-t text-black">{item.lpk}</td>
                      <td className="px-4 py-2 border-t text-black">{item.jurusan}</td>
                      <td className="px-4 py-2 border-t text-black">{item.tanggal_lahir ? `${umur(item.tanggal_lahir)} tahun` : "-"}</td>
                      <td className="px-4 py-2 border-t text-black">{item.lulus ? "Lulus" : "Belum lulus"}</td>
                      <td className="px-4 py-2 border-t text-black">{item.tanggal_daftar instanceof Timestamp
                        ? item.tanggal_daftar.toDate().toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        }) : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-2 border-b text-black text-center">Tidak ada peserta LPK</td>
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
          </>
        )}
      </div>
    </div>
  );
}