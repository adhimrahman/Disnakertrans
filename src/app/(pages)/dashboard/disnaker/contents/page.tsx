import Card from '@/components/dashboard/Card';
import { BsFillFileEarmarkArrowUpFill } from "react-icons/bs";
import { MdContentPasteSearch } from "react-icons/md";
import Link from 'next/link';

export default function ContentsForm() {
  return (
    <div className="flex flex-row justify-center w-full gap-x-44 items-center h-screen overflow-hidden">
      <Link href="/dashboard/disnaker/contents/kegiatan">
        <Card
          className="w-72 h-72 align-middle"
          title="Kegiatan Disnaker"
          icon={<BsFillFileEarmarkArrowUpFill className='text-darkBlue'/>}
        />
      </Link>
      <Link href="/dashboard/disnaker/contents/lowongan">
        <Card
          className="w-72 h-72"
          title="Lowongan Perkerjaan"
          icon={<MdContentPasteSearch className='text-darkBlue'/>}
        />
      </Link>
    </div>
  );
}