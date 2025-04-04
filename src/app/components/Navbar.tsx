"use client";

export default function Navbar() {
  return (
    <header className="text-white p-4 flex justify-between items-center" style={{ backgroundColor: "#3561A1" }}>
      <div className="flex items-center">
        <img src="/images/Logo.png" alt="Logo Disnaker" className="h-10 mr-3" />
        <h1 className="text-lg font-semibold">DINAS KETENAGAKERJAAN DAN TRANSMIGRASI GOWA</h1>
      </div>
      <nav className="space-x-6">
        <a href="#" className="text-white hover:underline">Home</a>
        <a href="#" className="text-white hover:underline">Info</a>
        <a href="#" className="text-white hover:underline">About Us</a>
        <a href="#" className="text-white hover:underline">Contact Us</a>
        <button className="bg-red-500 px-4 py-2 rounded text-white">Login</button>
      </nav>
    </header>
  );
}