"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import CustomButton from "@/components/ui/CustomButton";
import Image from "next/image";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isClient, setIsClient] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setShowSuccess(false);

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const userData = docSnap.data();
				if (userData.role === "disnaker") {
					setShowSuccess(true);
					setTimeout(() => router.push("/dashboard/disnaker"), 3000);
				} else if (userData.role === "lpk") {
					if (!userData.lpkId) {
						setError("ID LPK tidak ditemukan.");
						return;
					}
					setShowSuccess(true);
					setTimeout(() => router.push(`/dashboard/lpk/${userData.lpkId}`), 5000);
				} else {
					setError("Role tidak valid.");
				}
			} else {
				setError("Data pengguna tidak ditemukan.");
			}
		} catch (err: any) {
			setError("Email atau password salah.");
		}
	};

	if (!isClient) return null;

	return (
		<div className="min-h-screen h-full flex flex-col md:flex-row">
			{/* Left Side - Image Background */}
			<div className="hidden md:block md:w-1/2 relative">
				<Image
					src="/images/Logo.png"
					alt="Login Background"
					fill
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-darkBlue bg-opacity-50 flex items-center justify-center px-20">
					<h1 className="text-white text-5xl font-bold px-6 text-center leading-13">Selamat Datang di Portal Admin Gowa</h1>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="w-full min-h-screen md:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-steelBlue">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center">
						<Image src="/images/Logo.png" alt="Logo" width={60} height={60} className="mx-auto mb-2 pb-2" />
						<h2 className="text-2xl lg:text-3xl font-bold text-gray-100">Masuk ke Akun Anda</h2>
						<p className="text-sm text-gray-100">Admin Disnaker & LPK Gowa</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-6 py-5">
						<div>
							<label className="block text-sm font-medium text-gray-100">Email</label>
							<input
								type="email"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="email@example.com"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-100">Password</label>
							<input
								type="password"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••••••"
								required
							/>
						</div>

						{error && <p className="text-sm text-red-500 text-center">{error}</p>}

						<div className="text-right">
							<a href="/forgot-password" className="text-sm text-gray-100 hover:underline">Lupa password?</a>
						</div>

						<CustomButton text="Login" width="w-full" py={2} />
					</form>

					{showSuccess && (
						<div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 px-4 shadow z-50">
							Login berhasil! Mengarahkan Anda...
						</div>
					)}
				</div>
			</div>
		</div>
	);
}