import ProtectedRoute from "@/components/ProtectedRoute";

export default function DisnakerDashboard() {
	return (
		<ProtectedRoute>
			<div>
				<h1>Dashboard Disnaker</h1>
				<p>Selamat datang di Dashboard Disnaker!</p>
			</div>
		</ProtectedRoute>
	);
}
