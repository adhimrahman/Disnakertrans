"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { BsBriefcaseFill } from "react-icons/bs";
import Card from "@/components/dashboard/Card";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import dayjs from "dayjs";
import "dayjs/locale/id";

type Laporan = {
  id: string;
  isDelete?: boolean;
  waktu_pelatihan: Timestamp;
};

type GroupedReport = {
  monthYear: string;
  count: number;
  timestamp: Date;
};

export default function LpkDetailPage() {
  const [reports, setReports] = useState<Laporan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const params = useParams();
  const id = params?.lpkId;
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchReports = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const laporanRef = collection(db, "lpk", id as string, "laporan");
        const laporanSnap = await getDocs(laporanRef);
        const laporanData = laporanSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Laporan)).filter((doc) => doc.isDelete !== true);
        
        setReports(laporanData);
      } catch (error) {
        console.error("Gagal fetch laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReports();
  }, [id]);

  // Kelompokkan laporan berdasarkan bulan dan tahun
  const groupedReports = useMemo(() => {
    const groups: Record<string, GroupedReport> = {};
    
    reports.forEach((report) => {
      const date = report.waktu_pelatihan.toDate();
      const monthYear = dayjs(date).locale("id").format("YYYY – MMMM").toUpperCase();
      
      if (!groups[monthYear]) {
        groups[monthYear] = {
          monthYear,
          count: 0,
          timestamp: date // Simpan timestamp untuk sorting
        };
      }
      
      groups[monthYear].count++;
    });
    
    // Ubah menjadi array dan urutkan berdasarkan timestamp (terbaru pertama)
    return Object.values(groups).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [reports]);

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
                onClick={() => router.push(`/dashboard/lpk/${id}/history/laporan?month=${group.monthYear}`)}
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
                  currentPage === pageNum 
                    ? 'bg-blue-500 text-white' 
                    : 'text-black hover:bg-gray-300'
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