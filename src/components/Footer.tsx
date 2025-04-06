import Image from "next/image";
import Garuda from "../../public/images/Garuda.png"
import Logo from "../../public/images/Logo.png"

export default function Footer() {
    return (
		<footer className="bg-black text-white py-10">
			<div className="container mx-auto px-6 lg:px-20">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
					<div>
					<h3 className="text-lg font-bold mb-3">Ketenagakerjaan Gowa</h3>
					<p className="text-sm text-gray-400">
						Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
					</p>
					<div className="flex justify-center md:justify-start space-x-4 mt-4">
						<a href="#" className="text-white hover:text-gray-400 text-2xl">
						<i className="fab fa-instagram"></i>
						</a>
						<a href="#" className="text-white hover:text-gray-400 text-2xl">
						<i className="fab fa-facebook"></i>
						</a>
					</div>
					</div>
		
					<div>
					<h3 className="text-lg font-bold mb-3">Transmigrasi Gowa</h3>
					<p className="text-sm text-gray-400">
						Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
					</div>
		
					<div>
					<h3 className="text-lg font-bold mb-3">Pemerintahan Gowa</h3>
					<p className="text-sm text-gray-400">
						Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
					</div>
		
					<div className="flex flex-col items-center">
					<div className="flex space-x-4">
						<Image src={Garuda} alt="Garuda Logo" className="w-16 h-16 object-contain" />
						<Image src={Logo} alt="Logo" className="w-16 h-16 object-contain" />
					</div>
					<p className="text-sm font-semibold mt-3 text-center">
						DINAS KETENAGAKERJAAN <br /> DAN TRANSMIGRASI GOWA
					</p>
					</div>
				</div>
				</div>
		
				<div className="border-t border-gray-600 my-6"></div>
				<div className="flex flex-col md:flex-row justify-between text-center text-gray-400 text-sm ml-6 mr-6">
				<p>@Copyright 2025</p>
				<p>Universitas Hasanuddin | Teknik Informatika 2022</p>
			</div>
		</footer>
    );
}
  