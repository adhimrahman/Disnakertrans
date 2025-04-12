"use client"
import Image from "next/image";
import Link from "next/link";
import Gowa from "../../../public/pemkabGowaLogo.svg"
import { useState } from "react";
import { Menu, X } from "lucide-react"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="navbar bg-[#3561A1] text-white w-full px-5 lg:px-9 py-4 lg:py-1 flex flex-wrap justify-between items-center">
            <div className="leftside logo sm:w-1/2 lg:w-1/4 flex items-center">
                <Image src={Gowa} alt="Logo Pemerintahan Kab. Gowa" width={40} height={40} className="py-1"></Image>
                <p className="pl-2 lg:pl-4 w uppercase font-semibold sm:text-xs text-sm lg:text-base">dinas ketenagakerjaan <br /> dan transmigrasi gowa</p>
             </div>

            <button className="lg:hidden ml-auto" onClick={() => setIsOpen(!isOpen)} >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className={`w-full lg:w-auto ${isOpen ? "block" : "hidden"} capitalize lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-11 mt-4 lg:mt-0`} >
                <Link href="/" className="block lg:inline-block text-white hover:underline hover:font-semibold hover:cursor-pointer">
                    Home
                </Link>
                <Link href="/kegiatan" className="block lg:inline-block text-white hover:underline hover:font-semibold hover:cursor-pointer">
                    Kegiatan
                </Link>
                <Link href="/lapangan-kerja" className="block lg:inline-block text-white hover:underline hover:font-semibold hover:cursor-pointer">
                    Lowongan
                </Link>
                <Link href="/contact-us" className="block lg:inline-block text-white hover:underline hover:font-semibold hover:cursor-pointer">
                    Contact Us
                </Link>
                <Link href="/login" passHref>
                    <button className="bg-red-500 hover:bg-red-700 transition px-4 py-2 rounded-xl text-white w-full lg:w-auto hover:cursor-pointer">
                        Login
                    </button>
                </Link>
            </nav>
        </header>
    );
}