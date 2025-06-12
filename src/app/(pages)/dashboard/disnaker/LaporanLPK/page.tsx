import LaporanLPKList from "@/components/dashboard/LaporanLPKList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getLaporanLPKBySort, getLaporanLPKFiltered } from "@/firebase/utils/lpk-service";
import { LaporanItem } from "@/models/Laporan";

interface LaporanLPKDashboardPageProps {
  searchParams?: {
    search?: string;
    sort?: keyof LaporanItem;
    order?: "asc" | "desc";
  };
};

export default async function LaporanLPKDashboardPage({ searchParams }: LaporanLPKDashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const {
    search =  "",
    sort   = "nama_lembaga",
    order  = "asc",
  } = resolvedSearchParams || {};

  const laporanLPK = search
    ? await getLaporanLPKFiltered(search, sort, order)
    : await getLaporanLPKBySort(sort, order);
  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      <SearchSortControls
        sortOptions={[
          { value: "nama_lembaga", label: "Nama LPK" },
          { value: "tanggal_pelaksanaan", label: "Tanggal Pelaksanaan" },
        ]}
      />
      <span className="px-3" />
      <LaporanLPKList laporanLPK={laporanLPK} />
    </div>
  );
};