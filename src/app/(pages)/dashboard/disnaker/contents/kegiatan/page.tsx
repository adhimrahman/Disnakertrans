import KegiatanList from "@/components/dashboard/KegiatanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getKegiatanFilteredByJudulContains, getKegiatanByDateAndSort } from "@/firebase/utils/kegiatan-service";
import { KegiatanItem } from "@/models/Kegiatan";

interface KegiatanDashboardPageProps {
  searchParams?: {
    search?: string;
    sort?: keyof KegiatanItem;
    order?: "asc" | "desc";
  };
}

export default async function KegiatanDashboardPage({ searchParams }: KegiatanDashboardPageProps) {
  const resolvedSearchParams = await searchParams; // await it here
  const {
      search = '',
      sort = 'Tanggal',
      order = 'asc',
  } = resolvedSearchParams || {};
  
  const kegiatan = search
  ? await getKegiatanFilteredByJudulContains(search, sort, order) 
  : await getKegiatanByDateAndSort(sort, order);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <SearchSortControls
          sortOptions={[
            { value: "Tanggal", label: "Tanggal" },
            { value: "Judul", label: "Judul" },
          ]}
        />
      </div>
      <span className="px-3" />
      <KegiatanList kegiatan={kegiatan} />
    </>
  );
}
