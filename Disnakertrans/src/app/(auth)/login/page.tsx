"use client";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "@/components/Auth/LoginForm";
import RedirectIfAuthenticated from "@/components/Auth/RedirectIfAuthenticated";

export default function LoginPage() {
	const router = useRouter();

	return (
		<RedirectIfAuthenticated>	
			<div className="min-h-screen h-full flex flex-col md:flex-row">
				{/* Tombol Back & Home di Desktop - kiri atas */}
				<div className="hidden md:flex fixed top-10 left-10 gap-5 z-50">
					<button type="button" onClick={() => router.back()}
						className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-lg text-sm font-medium shadow-md transition hover:cursor-pointer"
					>
						← Kembali
					</button>
					<button type="button" onClick={() => router.push("/")}
						className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-lg text-sm font-medium shadow-md transition hover:cursor-pointer"
					>
						🏠 Home
					</button>
				</div>

				{/* Left Side */}
				<div className="hidden md:block md:w-1/2 relative">
					<div className="absolute inset-0 bg-darkBlue bg-opacity-50 flex items-center justify-center px-20">
						<h1 className="text-white text-5xl font-bold px-6 text-center leading-13">Selamat Datang di Portal Admin Gowa</h1>
					</div>
				</div>

				{/* Right Side - Form */}
				<div className="w-full min-h-screen md:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-steelBlue">
					<div className="w-full max-w-md space-y-6">

						<div className="md:hidden flex items-center mb-4">
							<button type="button" onClick={() => router.back()} className="text-white flex items-center gap-2 text-sm hover:underline" >
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
									Kembali
							</button>
						</div>

						<div className="text-center">
							<div className="relative w-[64px] h-[64px] mx-auto mb-2 pb-2">
								<Image src="/images/Logo.png" alt="Logo" fill sizes="64px" className="object-contain mx-auto mb-2 pb-2" />
							</div>
							<h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Masuk ke Akun Anda</h2>
							<p className="text-sm text-gray-100">Admin Disnaker & LPK Gowa</p>
						</div>

						<LoginForm />
						<ToastContainer position="top-right" autoClose={3000} />
					</div>
				</div>
			</div>
		</RedirectIfAuthenticated>
	);
}