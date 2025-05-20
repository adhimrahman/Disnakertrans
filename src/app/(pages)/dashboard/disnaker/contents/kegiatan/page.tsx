import DatePickerDashboard from "@/components/dashboard/DatePicker";
import KegiatanList from "@/components/dashboard/KegiatanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getKegiatanFilteredByJudulContains, getKegiatanByDateAndSort } from "@/firebase/utils/kegiatan-service";
import { KegiatanItem } from "@/models/Kegiatan";

interface KegiatanDashboardPageProps {
  searchParams?: {
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: keyof KegiatanItem;
    order?: "asc" | "desc";
  };
}

export default async function KegiatanDashboardPage({ searchParams }: KegiatanDashboardPageProps) {
  const resolvedSearchParams = await searchParams; // await it here

    const {
      search = '',
      startDate,
      endDate,
      sort = 'Tanggal',
      order = 'asc',
  } = resolvedSearchParams || {};
  
  const kegiatan = search
  ? await getKegiatanFilteredByJudulContains(search, startDate, endDate, sort, order) 
  : await getKegiatanByDateAndSort(startDate, endDate, sort, order);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <SearchSortControls />
        <DatePickerDashboard />
      </div>
      <span className="px-3" />
      <KegiatanList kegiatan={kegiatan} />
    </>
  );
}
