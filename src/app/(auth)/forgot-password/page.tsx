"use client";
import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config"; // Ensure that your Firebase config is correct

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Reset error and success messages when the component mounts or re-renders
  useEffect(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only proceed if the email is not empty
    if (!email) {
      setError("Email harus diisi.");
      return;
    }

    try {
      // Send password reset email to the entered email
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Email reset password telah dikirim! Silakan periksa inbox Anda.");
      setEmail(""); // Reset the email after successful submission
    } catch (err: any) {
      console.error("Error sending password reset email", err);
      setError("Terjadi kesalahan, pastikan email yang Anda masukkan benar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-xl flex overflow-hidden  py-11 px-10">
        {/* Left side: Image (optional) */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/images/Login.jpg"
            alt="Forgot Password Illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl text-black font-bold mb-2 mt-4">Lupa Password?</h2>
          <p className="text-sm text-gray-500 mb-6">
            Masukkan email Anda untuk menerima instruksi reset password.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className="w-full text-black px-4 py-2 border rounded bg-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Display error or success message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
            >
              Kirim Link Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
