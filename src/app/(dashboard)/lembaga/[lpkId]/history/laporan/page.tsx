'use client';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { DocumentData } from "firebase/firestore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from "react-icons/hi";
import { PulseLoader } from "react-spinners";
import dayjs from "dayjs";
import 'dayjs/locale/id';

type Laporan = {
  id: string;
  jenis_pelatihan?: string;
  tanggal_pelaksanaan?: { toDate: () => Date };
  isDelete?: boolean;
  [key: string]: unknown;
};

// Mapping nama bulan Indonesia ke angka (0-11)
const BULAN_TO_NUMBER: Record<string, number> = {
  "JANUARI": 0, "FEBRUARI": 1, "MARET": 2, "APRIL": 3, "MEI": 4, "JUNI": 5,
  "JULI": 6, "AGUSTUS": 7, "SEPTEMBER": 8, "OKTOBER": 9, "NOVEMBER": 10, "DESEMBER": 11
};

export default function LaporanLpkPage() {
  const [laporan, setLaporan] = useState<DocumentData[]>([]);
  const [akunDocId, setAkunDocId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
    const getAkunId = async () => {
      if (!lpkId) return;
      try {
        const akunRef = collection(db, "akun");
        const q = query(akunRef, where("lpkId", "==", lpkId));
        const akunSnapshot = await getDocs(q);
        if (!akunSnapshot.empty) {
          const akunDoc = akunSnapshot.docs[0];
          setAkunDocId(akunDoc.id);
        } else {
          alert("Data akun tidak ditemukan");
        }
      } catch (error) {
        console.error("Error get akunId:", error);
      }
    };
    getAkunId();
  }, [lpkId]);

  useEffect(() => {
    if (!akunDocId) return;
    const getLaporan = async () => {
      setLoading(true);
      try {
        const laporanRef = collection(db, "laporan");
        const q = query(laporanRef, where("reference", "==", doc(db, "akun", akunDocId)));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docu) => ({
          id: docu.id,
          ...docu.data()
        })).filter((item: Laporan) => item.isDelete !== true);

        setLaporan(data);
      } catch (error) {
        console.error("Error ambil laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    getLaporan();
  }, [akunDocId]);

  const filteredData = useMemo(() => {
    let baseData = [...laporan];

    if (filterYear !== null && filterMonth !== null) {
      baseData = baseData.filter(item => {
        if (!item.tanggal_pelaksanaan?.toDate) return false;
        const date = item.tanggal_pelaksanaan.toDate();
        return date.getFullYear() === filterYear && date.getMonth() === filterMonth;
      });
    }
    return baseData;
  }, [laporan, filterYear, filterMonth]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleClearFilter = () => {
    router.push(`/lembaga/${lpkId}/history`);
  };

  return (
    <div className="flex flex-col gap-y-8 text-black">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Data History Laporan</h2>
          {monthYear && (
            <div className="flex items-center gap-x-2">
              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Filter bulan: {monthYear.split(' – ').join(' ')}
              </span>
              <button onClick={handleClearFilter} className="text-sm text-blue-600 hover:underline">
                Hapus filter
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto shadow-md">
            <thead className="bg-gray-100 text-sm font-medium">
              <tr>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">No</th>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">Jenis Pelatihan</th>
                <th className="px-4 py-3 text-left text-white bg-steelBlue">Tanggal Pelaksanaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    <PulseLoader color="#3B82F6" />
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3">{startIndex + index + 1}</td>
                    <td className="px-4 py-3">{item.jenis_pelatihan || "-"}</td>
                    <td className="px-4 py-3">
                      {item.tanggal_pelaksanaan?.toDate 
                        ? dayjs(item.tanggal_pelaksanaan.toDate()).locale("id").format("DD MMMM YYYY") 
                        : "-"
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > itemsPerPage && (
          <div className="flex justify-between mt-4">
            <p className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
            </p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="btn-pagination">
                <HiOutlineArrowSmLeft /> Prev
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="btn-pagination">
                Next <HiOutlineArrowSmRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
