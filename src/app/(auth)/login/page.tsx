"use client";

import { useState, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false); // track if we're on the client
  const [showSuccess, setShowSuccess] = useState(false); // track success state for popup

  useEffect(() => {
    setIsClient(true); // set to true after component is mounted on the client
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false); // reset success message on new attempt

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ambil data role dari Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "disnaker") {
          setShowSuccess(true); // Show success message after successful login
          setTimeout(() => {
            router.push("/dashboard/disnaker");
          }, 3000); // Delay navigation by 3 seconds
        } else if (userData.role === "lpk") {
          setShowSuccess(true); // Show success message after successful login
          setTimeout(() => {
            router.push("/dashboard/lpk");
          }, 5000); // Delay navigation by 5 seconds
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

  if (!isClient) return null; // prevent server-side rendering issues

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

            <div className="text-end mt-4">
              <a href="/forgot-password" className="text-blue-500 text-sm hover:underline">Lupa Password?</a>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>

          {/* Success Popup */}
          {showSuccess && (
            <div className="fixed top-0 left-0 right-0 bg-green-500 text-white py-2 px-4 text-center">
              <p>Anda telah berhasil login! Anda akan diarahkan dalam 3 detik.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
