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
    const {
        search = '',
        sort = 'created_at',
        order = 'asc',
    } = searchParams || {};

    const kegiatan = search
        ? await getKegiatanFilteredByJudulContains(search, sort, order) 
        : await getKegiatanByDateAndSort(sort, order);

    return (
        <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
            <SearchSortControls
                sortOptions={[
                    { value: "created_at", label: "Tanggal" },
                    { value: "judul", label: "Judul" },
                ]}
            />
            <span className="px-3" />
            <KegiatanList kegiatan={kegiatan} />
        </div>
    );
}