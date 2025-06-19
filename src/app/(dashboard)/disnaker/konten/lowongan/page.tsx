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
    const resolvedSearchParams = await searchParams;
    const { search = '', sort = 'created_at', order = 'asc', } = resolvedSearchParams || {};

    const lowongan = search
        ? await getLowonganFilteredByJudulContains(search, sort, order) 
        : await getLowonganByDateAndSort(sort, order);
    
    return (
        <div className="min-w-full flex flex-col gap-y-4 bg-white rounded-md p-4">
            <SearchSortControls
                sortOptions={[
                    { value: "tenggat_lowongan", label: "Batas Lowongan" },
                    { value: "created_at", label: "Tanggal Unggah" },
                    { value: "perusahaan", label: "Perusahaan" },
                ]}
            />
            <span className="px-3" />
            <LowonganList lowongan={lowongan} />
        </div>
    );
}