import Card from '@/components/dashboard/Card';
import { BsFillFileEarmarkArrowUpFill } from "react-icons/bs";
import { MdContentPasteSearch } from "react-icons/md";
import Link from 'next/link';

export default function ContentsForm() {
  return (
    <div className="flex flex-row justify-center h-36 w-full gap-x-36 mt-48 min-h-screen">
      <Link href="/dashboard/disnaker/contents/content-activity">
        <Card
          className="w-72 h-96"
          title="Kegiatan Disnaker"
          body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae."
          icon={<BsFillFileEarmarkArrowUpFill />}
        />
      </Link>
      <Link href="/dashboard/disnaker/contents/content-jobvacancy">
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