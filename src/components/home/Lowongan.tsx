import LowonganHome from "@/components/ClientCompo/LowonganHome";
import { getLowongan } from "@/lib/getLowongan";

export default async function LowonganCarousel() {
	const lowongan = await getLowongan();

	return (		<section className="pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 sm:px-5 bg-gray-100">
			<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-10 text-gray-800 capitalize">
				lowongan pekerjaan di gowa
			</h2>
			<LowonganHome lowongan={lowongan} />
		</section>
	);
}