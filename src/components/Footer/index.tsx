import Link from "next/link";
import Image from "next/image";
import Garuda from "../../../public/images/Garuda.png"
import Logo from "../../../public/images/Logo.png"
import FacebookLogo from "../../../public/facebook-logo.svg";
import InstagramLogo from "../../../public/instagram-logo.svg";

export default function Footer() {
    return (
		<footer className="bg-[#1E1E1E] text-white pt-12 pb-6">
			<div className="container mx-auto px-6 lg:px-20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Left side - Logos and Info */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left">
						<div className="flex space-x-4 justify-center md:justify-start mb-4">
							<Image src={Garuda} alt="Garuda Logo" className="w-16 lg:w-20 h-16 lg:h-20 object-contain" />
							<Image src={Logo} alt="Logo" className="w-16 lg:w-20 h-16 lg:h-20 object-contain" />
						</div>
						
						<p className="text-lg font-bold mb-4">DINAS KETENAGAKERJAAN <br /> DAN TRANSMIGRASI GOWA</p>

						<div className="flex space-x-6 mt-4">
							<Link href="https://www.facebook.com/people/Disnakertrasn-Gowa/100068958707988/" target="_blank" rel="noopener noreferrer">
								<Image src={FacebookLogo} alt="Facebook" width={28} height={28} className="hover:opacity-70 transition-opacity duration-200" />
							</Link>
							<Link href="https://www.instagram.com/disnakergowakab/" target="_blank" rel="noopener noreferrer">
								<Image src={InstagramLogo} alt="Instagram" width={28} height={28} className="hover:opacity-70 transition-opacity duration-200" />
							</Link>
						</div>
					</div>

					{/* Right side - Navigation & Info */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2 text-sm text-gray-300">
							<Link href="/" className="block hover:underline hover:font-medium">Home</Link>
							<Link href="/kegiatan" className="block hover:underline hover:font-medium">Kegiatan</Link>
							<Link href="/lapangan-kerja" className="block hover:underline hover:font-medium">Lowongan</Link>
							<Link href="/contact-us" className="block hover:underline hover:font-medium">Contact Us</Link>
						</div>
						<div className="text-sm text-gray-300 space-y-3">
							<div>
								<h4 className="font-bold text-white mb-1">Tentang Kami</h4>
								<p>
									Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Sed do eiusmod tempor incididunt ut labore. At vero eos et accusamus et iusto odio dignissimos ducimus qui fuga.
								</p>
							</div>
							<div className="mt-6">
								<h4 className="font-bold text-white">Alamat</h4>
								<p>QCJW+VP7, Bontoala, Pallangga,<br />Gowa Regency, South Sulawesi 92114</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div className="border-t border-white border-opacity-40 my-8 w-full"></div>

			<div className="flex flex-col md:flex-row justify-between items-center text-center text-sm text-gray-300 px-4">
				<p>@Copyright 2025</p>
				<p className="mt-2 md:mt-0 font-semibold">
					Universitas Hasanuddin &nbsp; | &nbsp; Teknik Informatika 2022
				</p>
			</div>
		</footer>
    );
}