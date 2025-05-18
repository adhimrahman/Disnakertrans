'use client';

import Card from "@/components/Dashboard/Card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsFillFileEarmarkArrowUpFill } from "react-icons/bs";
import { MdContentPasteSearch } from "react-icons/md";

export default function ContentsForm() {
  const { lpkId } = useParams();
  
  return (
    <div className="flex flex-row justify-center w-full gap-x-36 items-center">
      <Link href={`/dashboard/disnaker/lpk/${lpkId}/akun`}>
        <Card
          className="w-72 h-80 mt-20"
          title="Peserta LPK"
          body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae."
          icon={<BsFillFileEarmarkArrowUpFill />}
        />
      </Link>
      <Link href={`/dashboard/disnaker/lpk/${lpkId}/laporan`}>
        <Card
          className="w-72 h-80 mt-20"
          title="Laporan LPK"
          body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae."
          icon={<MdContentPasteSearch />}
        />
      </Link>
    </div>
  );
}