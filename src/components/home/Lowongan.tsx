import "swiper/css";
import "swiper/css/navigation";
import LowonganHome from "../ClientCompo/LowonganHome";
import { getLowongan } from "@/lib/getLowongan";

export default async function LowonganCarousel() {
	const lowongan = await getLowongan();

	return (
		<section className="pt-16 pb-10 px-5 bg-gray-100">
			<div>
				<h2 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
					lowongan pekerjaan di gowa
				</h2>
				<LowonganHome lowongan={lowongan} />
			</div>
		</section>
	);
}