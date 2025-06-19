import { AduanItem } from "@/models/Aduan";
import { getAduanBySort, getAduanFilteredByNames } from "@/firebase/utils/aduan-service";
import AduanList from "@/components/dashboard/AduanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";

interface PageProps {
  searchParams?: Record<string, string | string[]>;
}

export default async function AduanDashboardPage({ searchParams }: PageProps) {
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";
  const sort = typeof searchParams?.sort === "string" ? (searchParams.sort as keyof AduanItem) : "created_at";
  const order = typeof searchParams?.order === "string" ? (searchParams.order as "asc" | "desc") : "asc";

  const aduan = search
    ? await getAduanFilteredByNames(search, sort, order)
    : await getAduanBySort(sort, order);

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      <SearchSortControls
        sortOptions={[
          { value: "created_at", label: "Tanggal Unggah" },
          { value: "nama_depan", label: "Nama" },
          { value: "is_done", label: "Status" },
        ]}
      />
      <span className="px-3" />
      <AduanList aduan={aduan ?? []} />
    </div>
  );
}