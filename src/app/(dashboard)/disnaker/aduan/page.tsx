import AduanList from "@/components/dashboard/AduanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";
import { getAduanBySort, getAduanFilteredByNames } from "@/firebase/utils/aduan-service";
import { AduanItem } from "@/models/Aduan";

type SortKey = keyof AduanItem;
type Order = 'asc' | 'desc';

export default async function AduanDashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";
  const sort = (typeof searchParams?.sort === "string" ? searchParams.sort : "created_at") as SortKey;
  const order = (typeof searchParams?.order === "string" ? searchParams.order : "asc") as Order;

  const aduan = search
    ? (await getAduanFilteredByNames(search, sort, order)) ?? []
    : (await getAduanBySort(sort, order)) ?? [];

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
      <AduanList aduan={aduan} />
    </div>
  );
}