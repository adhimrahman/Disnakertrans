'use client';

import Sidebar from '@/components/Dashboard/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar component */}
      <Sidebar />

      <ProtectedRoute>
        {/* Konten Utama */}
        <div className="flex flex-col flex-1 bg-gray-100 h-full overflow-y-auto w-full lg:ml-64">
          {/* Main content with padding adjustment for mobile */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 pt-16 lg:pt-6">{children}</main>
        </div>
      </ProtectedRoute>
    </div>
  );
}
