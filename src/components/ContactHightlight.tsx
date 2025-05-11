import Image from "next/image";
import React from "react";
import Logo from "../../public/images/Logo.png";
import Garuda from "../../public/images/Garuda.png";
import Link from "next/link";

export default function ContactHighlight() {
	return (
		<section className="py-20 bg-darkBlue text-white">
			<div className="container mx-auto px-6 lg:px-24 flex flex-col lg:flex-row items-center gap-10">
				<div className="lg:w-1/3 flex justify-center items-center gap-8">
					<div className="bg-white/10 p-4 rounded-xl shadow-md hover:scale-105 transition hover:cursor-pointer">
						<Image src={Garuda} alt="Garuda Logo" className="w-24 h-24 object-contain" />
					</div>
					<div className="bg-white/10 p-4 rounded-xl shadow-md hover:scale-105 transition hover:cursor-pointer">
						<Image src={Logo} alt="Logo Gowa" className="w-24 h-24 object-contain" />
					</div>
				</div>

				<div className="lg:w-2/3 text-center lg:text-left">
					<h2 className="text-3xl lg:text-5xl font-bold mb-6">
						Hubungi Kami
					</h2>
					<p className="text-lg leading-relaxed text-gray-200 max-w-2xl mx-auto lg:mx-0 text-justify">
						Dinas Ketenagakerjaan Gowa siap membantu Anda. Jika Anda memiliki pertanyaan, saran,
						atau ingin mengetahui lebih lanjut mengenai layanan kami, silakan hubungi kami melalui halaman berikut.
					</p>

					<div className="mt-8">
						<Link href="/contact-us">
							<button className="bg-red-600 hover:bg-red-700 transition px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:cursor-pointer">
								Hubungi Sekarang
							</button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
