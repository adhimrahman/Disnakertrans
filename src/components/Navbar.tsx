"use client"
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../../public/images/Logo.png"
import Link from "next/link";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="text-white p-4 flex flex-wrap justify-between items-center bg-[#3561A1]">
			<div className="flex items-center">
				<Image src={Logo} alt="Logo Disnaker" width={40} height={40} className="mr-4" />
				<h1 className="text-lg font-semibold">DINAS KETENAGAKERJAAN DAN TRANSMIGRASI GOWA</h1>
			</div>

			{/* Hamburger menu for mobile */}
			<button
				className="lg:hidden ml-auto"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
			</button>

			{/* Nav Links */}
			<nav
				className={`w-full lg:w-auto ${isOpen ? "block" : "hidden"} lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mt-4 lg:mt-0`}
			>
				<Link href="/" className="block lg:inline-block text-white hover:underline">
				Home
				</Link>
				<Link href="/kegiatan" className="block lg:inline-block text-white hover:underline">
				Kegiatan
				</Link>
				<Link href="/lapangan-kerja" className="block lg:inline-block text-white hover:underline">
				Lowongan
				</Link>
				<a href="/contact-us" className="block lg:inline-block text-white hover:underline">
				Contact Us
				</a>
				<button className="bg-red-500 px-4 py-2 rounded text-white w-full lg:w-auto">
				Login
				</button>
			</nav>
		</header>
	);
}