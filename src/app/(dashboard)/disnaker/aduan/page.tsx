import { AduanItem } from "@/models/Aduan";
import { getAduanBySort, getAduanFilteredByNames } from "@/firebase/utils/aduan-service";
import AduanList from "@/components/dashboard/AduanList";
import SearchSortControls from "@/components/dashboard/SearchandSort";

export default async function AduanDashboardPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    sort?: keyof AduanItem;
    order?: "asc" | "desc";
  };
}) {
  const search = searchParams?.search ?? "";
  const sort = searchParams?.sort ?? "created_at";
  const order = searchParams?.order ?? "asc";

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