import LaporanLPKList from "@/components/dashboard/LaporanLPKList";
import { getLaporanLPKBySort } from "@/firebase/utils/lpk-service";

export default async function LaporanLPKDashboardPage() {
  const laporanLPK = await getLaporanLPKBySort("nama_lembaga", "asc");

  return (
    <div className="flex flex-col gap-y-4">
      <LaporanLPKList laporanLPK={laporanLPK} />
    </div>
  );
}
