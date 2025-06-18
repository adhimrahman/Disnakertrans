import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function useSessionExpire() {
	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(async () => {
			const lastActivity = localStorage.getItem("lastActivity");
			if (!lastActivity) return;

			const lastTime = new Date(lastActivity).getTime();
			const now = Date.now();
			const timeout = 1 * 60 * 1000; // 3 menit

			if (now - lastTime > timeout) {
				localStorage.removeItem("lastActivity");
				toast.warning("Sesi Anda telah kedaluwarsa. Silakan login ulang.");
				await signOut(auth);
				router.push("/expired");
			}
		}, 1 * 60 * 1000); // Cek setiap 5 menit
		// }, 24 * 60 * 60 * 1000; // Cek setiap 24 jam

		const updateActivity = () => {
			localStorage.setItem("lastActivity", new Date().toISOString());
		};

		window.addEventListener("click", updateActivity);
		window.addEventListener("keydown", updateActivity);
		window.addEventListener("mousemove", updateActivity);
		window.addEventListener("scroll", updateActivity);

		return () => {
			clearInterval(interval);
			window.removeEventListener("click", updateActivity);
			window.removeEventListener("keydown", updateActivity);
			window.removeEventListener("mousemove", updateActivity);
			window.removeEventListener("scroll", updateActivity);
		};
	}, [router]);
}