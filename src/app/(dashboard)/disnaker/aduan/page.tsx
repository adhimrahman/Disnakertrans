import { getAllAduan } from "@/firebase/utils/aduan-service";
import AduanList from "@/components/dashboard/AduanList";

export default async function AduanDashboardPage() {
  const aduan = await getAllAduan(); // ambil semua aduan tanpa filter/sort

  return (
    <div className="flex flex-col gap-y-4 bg-white rounded-md p-4">
      <AduanList aduan={aduan ?? []} />
    </div>
  );
}
