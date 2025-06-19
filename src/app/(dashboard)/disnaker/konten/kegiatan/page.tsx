import KegiatanList from "@/components/dashboard/KegiatanList";
import { getKegiatanByDateAndSort } from "@/firebase/utils/kegiatan-service";

export default async function KegiatanDashboardPage() {
  const kegiatan = await getKegiatanByDateAndSort("created_at", "asc");

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      <KegiatanList kegiatan={kegiatan} />
    </div>
  );
}