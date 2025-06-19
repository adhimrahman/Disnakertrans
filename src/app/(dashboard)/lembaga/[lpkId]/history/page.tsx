"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { BsBriefcaseFill } from "react-icons/bs";
import Card from "@/components/dashboard/Card";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import dayjs from "dayjs";
import "dayjs/locale/id";

type Laporan = {
	id: string;
	isDelete?: boolean;
	tanggal_pelaksanaan: { toDate: () => Date };
};

type GroupedReport = {
	monthYear: string;
	count: number;
	timestamp: Date;
};

export default function LpkDetailPage() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [akunDocId, setAkunDocId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const { lpkId } = useParams();

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchAkun = async () => {
      if (!lpkId) return;
      try {
        const akunRef = collection(db, "akun");
        const q = query(akunRef, where("lpkId", "==", lpkId));
        const akunSnapshot = await getDocs(q);
        if (!akunSnapshot.empty) {
          const akunDoc = akunSnapshot.docs[0];
          setAkunDocId(akunDoc.id);
        } else {
          alert("Data akun tidak ditemukan!");
        }
      } catch (error) {
        console.error("Gagal fetch akun:", error);
      }
    };

    fetchAkun();
  }, [lpkId]);

  useEffect(() => {
    if (!akunDocId) return;

    const fetchLaporan = async () => {
      setLoading(true);
      try {
        const laporanRef = collection(db, "laporan");
        const laporanQuery = query(laporanRef, where("reference", "==", doc(db, "akun", akunDocId)));
        const laporanSnapshot = await getDocs(laporanQuery);
        const laporanData = laporanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Laporan[];

        const filteredData = laporanData.filter(item => item.isDelete !== true);
        setLaporan(filteredData);
      } catch (error) {
        console.error("Gagal fetch laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, [akunDocId]);

  const groupedReports = useMemo(() => {
    const groups: Record<string, GroupedReport> = {};
    laporan.forEach((report) => {
      const date = report.tanggal_pelaksanaan.toDate();
      const monthYear = dayjs(date).locale("id").format("YYYY – MMMM").toUpperCase();
      
      if (!groups[monthYear]) {
        groups[monthYear] = { monthYear, count: 0, timestamp: date };
      }
      groups[monthYear].count++;
    });

    return Object.values(groups).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [laporan]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(groupedReports.length / itemsPerPage);
  const currentGroups = groupedReports.slice(startIndex, endIndex);

  return (
    <div className="ml-10">
      {loading ? (
        <div className="text-black">Memuat data...</div>
      ) : groupedReports.length === 0 ? (
        <div className="text-black">Belum ada laporan tersedia.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGroups.map((group) => (
              <Card
                key={group.monthYear}
                title={group.monthYear}
                body={`${group.count} Laporan`}
                icon={<BsBriefcaseFill className="text-black" />}
                onClick={() => router.push(`/lembaga/${lpkId}/history/laporan?month=${group.monthYear}`)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-base text-black border rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              <HiOutlineArrowSmLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 text-sm border rounded ${
                  currentPage === pageNum ? 'bg-blue-500 text-white' : 'text-black hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}

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
  );
}
