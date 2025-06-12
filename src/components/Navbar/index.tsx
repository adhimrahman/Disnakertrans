"use client";
import Image from "next/image";
import Link from "next/link";
import Gowa from "../../../public/pemkabGowaLogo.svg";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/kegiatan", label: "Kegiatan" },
        { href: "/lapangan-kerja", label: "Lowongan" },
        { href: "/pelatihan", label: "Pelatihan" },
        { href: "/contact-us", label: "Contact Us" }
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="navbar fixed bg-darkBlue text-white w-full px-5 lg:px-9 py-2 lg:py-1 flex flex-wrap justify-between items-center z-50">
            <div className="leftside logo sm:w-1/2 lg:w-1/4 flex items-center py-1">
                <Image src={Gowa} alt="Logo Pemerintahan Kab. Gowa" width={40} style={{ height: "57px" }} />
                <p className="pl-2 lg:pl-4 w uppercase font-semibold sm:text-xs text-sm lg:text-base">
                    dinas ketenagakerjaan <br /> dan transmigrasi gowa
                </p>
            </div>

            <button className="lg:hidden ml-auto hover:cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className={`w-full lg:w-auto ${isOpen ? "block" : "hidden"} capitalize lg:flex lg:justify-center lg:items-center space-y-6 lg:space-y-0 lg:space-x-11 mt-4 lg:mt-0 pb-5 lg:pb-0`}>
                {navLinks.map(({ href, label }) => (
                    <Link key={href} href={href}
                        className={`block lg:inline-block text-white hover:underline hover:font-semibold hover:cursor-pointer ${isActive(href) ? "underline font-bold text-gray-100" : ""}`}>
                        {label}
                    </Link>
                ))}
                <Link href="/login" passHref>
                    <CustomButton px={4} py={2} text="Login" width="w-auto" />
                </Link>
            </nav>
        </header>
    );
}