'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Searchbar from '@/components/dashboard/Searchbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar tetap */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col flex-1 bg-gray-100 h-full overflow-y-auto">
        {/* Searchbar tetap di atas */}
        <Searchbar />

        {/* Main content */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
