import Card from '@/components/Dashboard/Card';
import { BsFillFileEarmarkArrowUpFill } from "react-icons/bs";
import { MdContentPasteSearch } from "react-icons/md";
import Link from 'next/link';

export default function ContentsForm() {
  return (
    <div className="flex flex-row justify-center w-full gap-x-36 items-center mt-20">
      <Link href="/dashboard/disnaker/contents/kegiatan">
        <Card
          className="w-72 h-96 align-middle"
          title="Kegiatan Disnaker"
          body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae."
          icon={<BsFillFileEarmarkArrowUpFill />}
        />
      </Link>
      <Link href="/dashboard/disnaker/contents/lowongan">
        <Card
          className="w-72 h-96"
          title="Lowongan Perkerjaan"
          body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae."
          icon={<MdContentPasteSearch />}
        />
      </Link>
    </div>
  );
}