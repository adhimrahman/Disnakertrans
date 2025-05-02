'use client';

import Sidebar from '@/components/dashboard/Sidebar';

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
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
