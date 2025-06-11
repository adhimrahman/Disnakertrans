// page.tsx
import PelatihanList from "@/components/dashboard/PelatihanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getPelatihanFilteredByJudulContains } from "@/firebase/utils/pelatihan-service";
import { PelatihanItem } from "@/lib/getPelatihan";

interface PelatihanDashboardPageProps {
  params: {
    lpkId: string;
  };
  searchParams?: {
    search?: string;
    sort?: keyof PelatihanItem;
    order?: "asc" | "desc";
  };
}

export default async function PelatihanDashboardPage({ params, searchParams }: PelatihanDashboardPageProps) {
  const { lpkId } = params;

  const {
    search = '',
    sort = 'Created' as keyof PelatihanItem,
    order = 'asc',
  } = searchParams || {};

  const pelatihan = await getPelatihanFilteredByJudulContains(lpkId, search.trim(), sort, order);

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      <SearchSortControls
        sortOptions={[
          { value: "Created", label: "Tanggal Dibuat" },
          { value: "Judul", label: "Judul" },
        ]}
      />
    </div>
  );
}
