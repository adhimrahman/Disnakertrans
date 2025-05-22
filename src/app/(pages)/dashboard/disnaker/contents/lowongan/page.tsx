import LowonganList from "@/components/dashboard/LowonganList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getLowonganFilteredByJudulContains, getLowonganByDateAndSort } from "@/firebase/utils/lowongan-service";
import { LowonganItem } from "@/models/Lowongan";

interface LowonganDashboardPageProps {
  searchParams?: {
    search?: string;
    sort?: keyof LowonganItem;
    order?: "asc" | "desc";
  };
};

export default async function LowonganDashboardPage ({ searchParams }: LowonganDashboardPageProps) {
  const resolvedSearchParams = await searchParams; // await it here
  const {
    search = '',
    sort = 'tanggal_unggah',
    order = 'asc',
  } = resolvedSearchParams || {};

  const lowongan = search
  ? await getLowonganFilteredByJudulContains(search, sort, order) 
  : await getLowonganByDateAndSort(sort, order);
  
  return (
    <>
      <SearchSortControls
        sortOptions={[
          { value: "nama_lowongan", label: "Nama Lowongan" },
          { value: "BatasLowongan", label: "Batas Lowongan" },
          { value: "tanggal_unggah", label: "Tanggal Unggah" },
          { value: "Perusahaan", label: "Perusahaan" },
        ]}
      />
      <span className="px-3" />
      <LowonganList lowongan={lowongan} />
    </>
  );
}