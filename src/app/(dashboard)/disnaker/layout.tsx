'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import useSessionExpire from '@/hooks/useSessionExpire';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	useSessionExpire();

	return (
		<ProtectedRoute expectedRole='disnaker'>
			<div className="flex h-screen overflow-hidden">
				<Sidebar />
				
				<div className="flex flex-col flex-1 bg-gray-100 h-full overflow-y-auto w-full lg:ml-64">
					<main className="p-4 sm:p-6 lg:p-8 flex-1 pt-16 lg:pt-6">{children}</main>
				</div>
			</div>
		</ProtectedRoute>
	);
}