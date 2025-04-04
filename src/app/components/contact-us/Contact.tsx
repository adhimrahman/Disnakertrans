import React from 'react'

export default function Contact() {
  return (
    <section className="flex-grow px-4 py-10 lg:px-32">
    <h1 className="text-4xl text-black font-bold text-center mb-2">Contact Us</h1>
    <p className="text-center text-gray-600 mb-10">
      Hubungi kami untuk mengetahui informasi lebih lanjut mengenai Disnaker Gowa
    </p>

    <div className="bg-white shadow-md border rounded-md p-8 max-w-5xl mx-auto">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Depan */}
        <div>
          <label className="text-black block font-semibold mb-1">Nama Depan</label>
          <input type="text" className="w-full p-3 rounded border bg-gray-50" />
        </div>

        {/* Nama Belakang */}
        <div>
          <label className="text-black block font-semibold mb-1">Nama Belakang</label>
          <input type="text" className="w-full p-3 rounded border bg-gray-50" />
        </div>

        {/* Email */}
        <div>
          <label className="text-black block font-semibold mb-1">Email</label>
          <input type="email" className="w-full p-3 rounded border bg-gray-50" />
        </div>

        {/* No Telepon */}
        <div>
          <label className="text-black block font-semibold mb-1">No Telp</label>
          <input type="tel" className="w-full p-3 rounded border bg-gray-50" />
        </div>

        {/* Pesan Anda */}
        <div className="md:col-span-2">
          <label className="text-black block font-semibold mb-1">Pesan Anda</label>
          <textarea rows={5} className="w-full p-3 rounded border bg-gray-50"></textarea>
        </div>

        {/* Tombol Kirim */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  </section>
  )
}
