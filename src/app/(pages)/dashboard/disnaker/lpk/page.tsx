"use client"

// import { useState } from "react"
import { BsBriefcaseFill } from "react-icons/bs";
import Card from "@/components/Dashboard/Card"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, where, query, DocumentData, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";

export default function LpkPage() {
  const [lpk, setLpk] = useState<DocumentData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  const itemsPerPage = 9;

  useEffect(() => {
    const req = query(
      collection(db, "lpk"),
      where("isDelete", "==", false),
      orderBy("nama", "asc")
    );

    const fetch = async () => {
      const data = await getDocs(req);
      setLpk(data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })));
    };

    fetch();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(lpk.length / itemsPerPage);

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-3 gap-12 ml-10">
        {lpk.slice(startIndex, endIndex).map((item) => {
          return (
            <Card
              key={item.id}
              title={item.nama}
              body={item.alamat}
              icon={<BsBriefcaseFill className="text-black "/>}
              onClick={() => router.push(`/dashboard/disnaker/lpk/${item.id}`)}
            />
          );
        })}
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
            } border rounded-md`}
        >{pageNum}
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
};