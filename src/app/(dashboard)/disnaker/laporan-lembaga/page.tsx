import LaporanLPKList from "@/components/dashboard/LaporanLPKList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getLaporanLPKBySort, getLaporanLPKFiltered } from "@/firebase/utils/lpk-service";
import { LaporanItem } from "@/models/LPK";

interface LaporanLPKDashboardPageProps {
  searchParams?: Promise<{
    search?: string;
    sort?: keyof LaporanItem;
    order?: "asc" | "desc";
  }> | undefined;
};

export default async function LaporanLPKDashboardPage({ searchParams }: LaporanLPKDashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const {
    search =  "",
    sort   = "nama_lembaga",
    order  = "asc",
  } = resolvedSearchParams;

  const laporanLPK = search
    ? await getLaporanLPKFiltered(search, sort, order)
    : await getLaporanLPKBySort(sort, order);
  return (
    <div className="flex flex-col gap-y-4">
      <SearchSortControls
        sortOptions={[
          { value: "nama_lembaga", label: "Nama Lembaga" },
          { value: "tanggal_pelaksanaan", label: "Tanggal Pelaksanaan" },
        ]}
      />
      <span className="px-3" />
      <LaporanLPKList laporanLPK={laporanLPK}/>
    </div>
  );
};