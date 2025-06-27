"use client";
import { JSX, useEffect, useState } from "react";
import { Briefcase, Users, GraduationCap } from "lucide-react";
import { getPelatihan } from "@/lib/getPelatihan";
import { getStatistikLaporan } from "@/firebase/utils/lpk-service";

export default function InfografisSection() {
	const [displayed, setDisplayed] = useState({ tenagaKerja: 0, pencariKerja: 0, pelatihan: 0 });
	const [target, setTarget] = useState({ tenagaKerja: 0, pencariKerja: 0, pelatihan: 0 });

	useEffect(() => {
		const fetchData = async () => {
			const { jumlahTenagaKerja, jumlahPencariKerja } = await getStatistikLaporan();
			const pelatihanData = await getPelatihan();

			setTarget({
				tenagaKerja: jumlahTenagaKerja,
				pencariKerja: jumlahPencariKerja,
				pelatihan: pelatihanData.length,
			});
		};

		fetchData();
	}, []);

	useEffect(() => {
		const duration = 2000;
		const startTime = Date.now();

		if (
			!Number.isFinite(target.tenagaKerja) || !Number.isFinite(target.pencariKerja) || !Number.isFinite(target.pelatihan)
		) { return }

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			setDisplayed({
				tenagaKerja: Math.floor(progress * target.tenagaKerja),
				pencariKerja: Math.floor(progress * target.pencariKerja),
				pelatihan: Math.floor(progress * target.pelatihan),
			});

			if (progress < 1) { requestAnimationFrame(animate) }
		};

		if (target.tenagaKerja > 0 || target.pencariKerja > 0 || target.pelatihan > 0) {
			requestAnimationFrame(animate);
		}
	}, [target]);

	return (
		<section className="py-24 bg-darkBlue text-white">
			<div className="container mx-auto px-6 lg:px-20 text-center">
				<h2 className="text-3xl lg:text-4xl font-bold mb-14 capitalize">
					Infografis Ketenagakerjaan Gowa
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					<Card icon={<Briefcase size={48} className="mb-4 text-yellow-400" />}
						label="Jumlah Tenaga Kerja" value={displayed.tenagaKerja} color="text-yellow-200"
					/>

					<Card icon={<Users size={48} className="mb-4 text-pink-400" />}
						label="Jumlah Pencari Kerja" value={displayed.pencariKerja} color="text-pink-200"
					/>

					<Card icon={<GraduationCap size={48} className="mb-4 text-green-400" />}
						label="Program Pelatihan" value={displayed.pelatihan} color="text-green-200"
					/>
				</div>
			</div>
		</section>
	);
}

function Card({ icon, label, value, color }: { icon: JSX.Element; label: string; value: number; color: string; }) {
	return (
		<div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition duration-300 hover:cursor-pointer">
			{icon}
			<p className="text-lg font-semibold capitalize">{label}</p>
			<p className={`text-5xl font-bold mt-2 ${color}`}>{value}</p>
		</div>
	);
}