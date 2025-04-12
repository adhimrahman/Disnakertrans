"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ambil data role dari Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "disnaker") {
          router.push("/dashboard/disnaker");
        } else if (userData.role === "lpk") {
          router.push("/dashboard/lpk");
        } else {
          setError("Role tidak valid.");
        }
      } else {
        setError("Data pengguna tidak ditemukan.");
      }
    } catch (err: any) {
      console.error("Login error", err.message);
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-xl flex overflow-hidden">
        <div className="hidden md:flex w-1/2 relative">
          <Image src="/images/Login.jpg" alt="Login Illustration" fill className="object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <Image src="/images/Logo.png" alt="Logo" width={50} height={50} />
          <h2 className="text-2xl text-black font-bold mb-2 mt-4">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Masuk menggunakan akun Admin Disnaker atau LPK Gowa
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className="w-full text-black px-4 py-2 border rounded bg-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Password</label>
              <input
                type="password"
                className="w-full text-black px-4 py-2 border rounded bg-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="cursor-pointer w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}