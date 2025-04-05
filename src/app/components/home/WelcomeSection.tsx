import React from 'react'

export default function WelcomeSection() {
  return (
    <section className="container mx-auto px-4 lg:px-20 py-12 flex flex-col lg:flex-row items-center justify-between bg-white">
      {/* Teks di Kiri */}
      <div className="lg:w-1/2 text-left">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900">
          Selamat Datang Di
        </h2>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-black mt-2">
          PORTAL INFORMASI DISNAKER KABUPATEN GOWA
        </h1>
        <div className="mt-6">
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-700 transition">
            Login
          </button>
        </div>
      </div>

      {/* Gambar di Kanan */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
        <img
          src="/images/Job1.png"
          alt="Illustrasi Pekerja"
          className="w-full max-w-xs sm:max-w-md lg:max-w-lg"
        />
      </div>
    </section>
  )
}
