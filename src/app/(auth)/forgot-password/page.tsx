"use client";
import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/components/ui/CustomButton";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");

	useEffect(() => {
		setEmail("");
	}, []);

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error("Email harus diisi.");
			return;
		}

		try {
			await sendPasswordResetEmail(auth, email);
			toast.success("Email reset password telah dikirim! Silakan periksa inbox Anda.");
			setEmail("");
		} catch (e) {
			toast.error("Terjadi kesalahan. Pastikan email valid dan terdaftar.");
			console.error("Error sending password reset email", e);
		}
	};

	return (
		<div className="min-h-screen h-full flex flex-col md:flex-row">
			{/* Left Side */}
			<div className="hidden md:block md:w-1/2 relative">
				<div className="absolute inset-0 bg-darkBlue bg-opacity-50 flex items-center justify-center px-20">
					<h1 className="text-white text-4xl font-bold px-6 text-center leading-13">Lupa Password? <br />Kami akan bantu reset</h1>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="w-full min-h-screen md:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-steelBlue">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center">
						<Image src="/images/Logo.png" alt="Logo" width={60} height={60} className="mx-auto mb-2 pb-2" />
						<h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Reset Password</h2>
						<p className="text-sm text-gray-100">Masukkan email Anda untuk menerima instruksi</p>
					</div>

					<form onSubmit={handleForgotPassword} className="space-y-6 py-5">
						<div>
							<label className="block text-sm font-medium text-gray-100">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@example.com"
								className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 shadow-sm focus:ring-blue700 text-gray-800"
								required
							/>
						</div>

						<CustomButton text="Kirim Link Reset" width="w-full" py={2} variant="blue" />

						<div className="text-center">
							<Link href="/login" className="text-sm text-gray-100 hover:underline">
								Kembali ke Halaman Login
							</Link>
						</div>
					</form>
				</div>
			</div>

			<ToastContainer position="top-center" autoClose={3000} />
		</div>
	);
}