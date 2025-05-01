// src/app/disnaker/dashboard/layout.tsx
'use client';

import Searchbar from '@/components/dashboard/Searchbar';
import Sidebar from '@/components/dashboard/Sidebar'; // adjust this path if needed

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar />
      <div className="ml-60 flex flex-col flex-1 bg-gray-100">
        <Searchbar />
        <main className="p-20 w-full">{children}</main>
      </div>
    </div>
  );
}
