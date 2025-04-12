import ProtectedRoute from "@/components/ProtectedRoute";

export default function LPKDashboard() {
	return (
		<ProtectedRoute>
			<div>
				<h1>Dashboard LPK</h1>
				<p>Selamat datang di Dashboard LPK!</p>
			</div>
		</ProtectedRoute>
	);
}
