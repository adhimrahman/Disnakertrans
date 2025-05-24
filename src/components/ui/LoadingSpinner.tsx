"use client";

export default function LoadingSpinner() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<div className="flex flex-col items-center">
				<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
				<p className="mt-4 text-white text-sm">Memuat halaman...</p>
			</div>
		</div>
	);
}