import LowonganList from "@/components/dashboard/LowonganList";
import { getLowonganByDateAndSort } from "@/firebase/utils/lowongan-service";

export default async function LowonganDashboardPage() {
  const lowongan = await getLowonganByDateAndSort("created_at", "asc");

  return (
    <div className="min-w-full flex flex-col gap-y-4 bg-white rounded-md p-4">
      <LowonganList lowongan={lowongan} />
    </div>
  );
}