"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomButton from "@/components/ui/CustomButton";
import { resetPassword } from "@/lib/auth";
import Link from "next/link";

export default function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) { toast.error("Email harus diisi."); return; }

		try {
			setLoading(true);
			await resetPassword(email);
			toast.success("Link reset password berhasil dikirim.");
			setEmail("");
		} catch (error) {
			console.error(error);
			toast.error("Gagal mengirim email. Pastikan email valid dan terdaftar.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 py-5">
			<div>
				<label className="block text-sm font-medium text-gray-100">Email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required
					className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 shadow-sm focus:ring-blue700 text-gray-800"
				/>
			</div>

			<CustomButton text="Kirim Link Reset" width="w-full" py={3} variant="blue" disabled={loading} className="flex justify-center" />

			<div className="text-center">
				<Link href="/login" className="text-sm text-gray-100 hover:underline">Kembali ke Halaman Login</Link>
			</div>
		</form>
	);
}