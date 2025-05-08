"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { BsBriefcaseFill } from "react-icons/bs";
import Card from "@/components/dashboard/Card";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import dayjs from "dayjs";
import "dayjs/locale/id";

type Laporan = {
  isDelete?: boolean;
  waktu_pelatihan: Timestamp;
};

export default function LpkDetailPage() {
  const [reports, setReports] = useState<any[]>([]);
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
        console.log("Jumlah laporan:", laporanSnap.size);
        const laporanData = laporanSnap.docs.map((doc) => {
          const data = doc.data() as Laporan;
          return {
            id: doc.id,
            ...data,
          };
        }).filter((doc) => doc.isDelete !== true);
        console.log("Data laporan:", laporanData);
        setReports(laporanData);
      } catch (error) {
        console.error("Gagal fetch laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReports();
    console.log("Params ID:", id);
  }, [id]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const formatBulanTahun = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return dayjs(date).locale("id").format("YYYY – MMMM").toUpperCase();
  };

  return (
    <>
      {loading ? (
        <div className="ml-10 text-black">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="ml-10 text-black">Belum ada laporan tersedia.</div>
      ) : (
        <div className="grid grid-cols-3 grid-rows-3 gap-12 ml-10">
          {reports.slice(startIndex, endIndex).map((report) => (
            <Card
              key={report.id}
              title={formatBulanTahun(report.waktu_pelatihan)}
              body=""
              icon={<BsBriefcaseFill className="text-black" />}
              onClick={() => router.push(`/dashboard/disnaker/lpk/${id}/laporan/${report.id}`)}
            />
          ))}
        </div>
      )}
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
  );
}
