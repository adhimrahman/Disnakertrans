import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useSessionExpire() {
	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(() => {
			const lastActivity = localStorage.getItem("lastActivity");
			if (!lastActivity) return;

			const lastTime = new Date(lastActivity).getTime();
			const now = Date.now();
			// const oneDay = 24 * 60 * 60 * 1000;
			const oneDay = 5 * 60 * 1000;

			if (now - lastTime > oneDay) {
				localStorage.removeItem("token");
				localStorage.removeItem("lastActivity");
				alert("Sesi Anda telah kedaluwarsa. Silahkan login ulang.");
				router.push("/login");
			}
		}, 5 * 60 * 1000); // cek setiap 5 menit

		const updateActivity = () => localStorage.setItem("lastActivity", new Date().toISOString());
		window.addEventListener("click", updateActivity);
		window.addEventListener("keydown", updateActivity);

		return () => {
			clearInterval(interval);
			window.removeEventListener("click", updateActivity);
			window.removeEventListener("keydown", updateActivity);
		};
	}, [router]);
}