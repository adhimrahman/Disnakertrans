"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/auth";
import { toast } from "react-toastify";
import CustomButton from "@/components/ui/CustomButton";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { userData } = await handleLogin(email, password);
			toast.success("Login berhasil!");

			if (userData.role === "disnaker") router.push("/dashboard/disnaker");
			else if (userData.role === "lpk") router.push(`/dashboard/lpk/${userData.lpkId}`);
			else setError("Role tidak valid.");
		} catch (err) {
			console.error(err);
			setError("Email atau password salah.");
			toast.error("Email atau password salah.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
                <label className="block text-sm font-medium text-gray-100">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg 
                    bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-100">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg 
                    bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="text-right">
                <a href="/forgot-password" className="text-sm text-gray-100 hover:underline">Lupa password?</a>
            </div>
			<CustomButton text="Login" width="w-full" py={2} variant="blue" />
		</form>
	);
}