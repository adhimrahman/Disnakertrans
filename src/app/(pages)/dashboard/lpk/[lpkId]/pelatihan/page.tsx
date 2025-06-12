import PelatihanList from "@/components/dashboard/PelatihanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getPelatihanFilteredByJudulContains } from "@/firebase/utils/pelatihan-service";
import { PelatihanItem } from "@/models/Pelatihan";

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

  const search = searchParams?.search?.trim() || "";
  const sort: keyof PelatihanItem = (searchParams?.sort as keyof PelatihanItem) || "created_at";
  const order = searchParams?.order || "asc";

  const pelatihan = await getPelatihanFilteredByJudulContains(lpkId, search, sort, order);

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      <SearchSortControls
        sortOptions={[
          { value: "created_at", label: "Tanggal Dibuat" },
          { value: "judul", label: "Judul" },
        ]}
      />
      <PelatihanList pelatihan={pelatihan} />
    </div>
  );
}
