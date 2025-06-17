//'pelatihan/page.tsx'

import PelatihanList from "@/components/dashboard/PelatihanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getPelatihanFiltered, getPelatihanBySort } from "@/firebase/utils/pelatihan-service";
import { PelatihanItem } from "@/models/Pelatihan";

interface PelatihanDashboardPageProps {
  params: {
    lpkId: string,
  };
  searchParams?: {
    search?: string;
    sort?: keyof PelatihanItem;
    order?: "asc" | "desc";
  };
};

export default async function PelatihanDashboardPage({ params, searchParams }: PelatihanDashboardPageProps) {
  const resolvedSearchParams = await searchParams; // await it here
  const {
    search = '',
    sort = 'tanggal_kegiatan',
    order = 'asc',
  } = resolvedSearchParams || {};

  const pelatihan = search
    ? await getPelatihanFiltered(params.lpkId, search, sort, order)
    : await getPelatihanBySort(params.lpkId, sort, order);
  
  return (
    <div className="min-w-full flex flex-col gap-y-4 bg-white rounded-md p-4">
      <SearchSortControls
        sortOptions={[
          { value: "tanggal_kegiatan", label: "Tanggal Kegiatan" },
          { value: "judul", label: "Judul" },
        ]}
      />
      <span className="px-3" />
      <PelatihanList pelatihan={pelatihan} lpkId={params.lpkId} />
    </div>
  );
};