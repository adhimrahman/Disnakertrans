import KegiatanHome from "@/components/ClientCompo/KegiatanHome";
import { KegiatanItem } from "@/lib/getKegiatan";

type KegiatanProps = {
  kegiatan: KegiatanItem[];
};

export default async function KegiatanCarousel({ kegiatan }: KegiatanProps) {
	return (
		<section className="pt-16 pb-10 px-5 bg-gray-100">
			<h2 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
				Kegiatan Disnaker Gowa
			</h2>
			<KegiatanHome kegiatan={kegiatan} />
		</section>
	);
}