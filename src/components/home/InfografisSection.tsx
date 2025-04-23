"use client"
import { useEffect, useState } from "react";
import { Briefcase, Users, GraduationCap } from "lucide-react";

export default function InfografisSection() {
	const [tenagaKerja, setTenagaKerja] = useState(0);
	const [pencariKerja, setPencariKerja] = useState(0);
	const [pelatihan, setPelatihan] = useState(0);

	useEffect(() => {
		const targetTenagaKerja = 1113;
		const targetPencariKerja = 1113;
		const targetPelatihan = 1113;
		const duration = 2000;

		const startTime = Date.now();
		const updateCounter = () => {
			const elapsedTime = Date.now() - startTime;
			const progress = Math.min(elapsedTime / duration, 1);

			setTenagaKerja(Math.floor(progress * targetTenagaKerja));
			setPencariKerja(Math.floor(progress * targetPencariKerja));
			setPelatihan(Math.floor(progress * targetPelatihan));

			if (progress < 1) {
				requestAnimationFrame(updateCounter);
			}
		};

		requestAnimationFrame(updateCounter);
	}, []);

	return (
		<section className="py-24 bg-darkBlue text-white">
			<div className="container mx-auto px-6 lg:px-20 text-center">
				<h2 className="text-3xl lg:text-4xl font-bold mb-14 capitalize">
					Infografis Ketenagakerjaan Gowa
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* Card 1 */}
					<div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition duration-300 hover:cursor-pointer">
						<Briefcase size={48} className="mb-4 text-yellow-400" />
						<p className="text-lg font-semibold capitalize">Jumlah Tenaga Kerja</p>
						<p className="text-5xl font-bold mt-2 text-yellow-200">{tenagaKerja}</p>
					</div>

					{/* Card 2 */}
					<div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition duration-300 hover:cursor-pointer">
						<Users size={48} className="mb-4 text-pink-400" />
						<p className="text-lg font-semibold capitalize">Jumlah Pencari Kerja</p>
						<p className="text-5xl font-bold mt-2 text-pink-200">{pencariKerja}</p>
					</div>

					{/* Card 3 */}
					<div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition duration-300 hover:cursor-pointer">
						<GraduationCap size={48} className="mb-4 text-green-400" />
						<p className="text-lg font-semibold capitalize">Program Pelatihan</p>
						<p className="text-5xl font-bold mt-2 text-green-200">{pelatihan}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
