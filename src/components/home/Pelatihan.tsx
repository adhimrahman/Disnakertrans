import PelatihanHome from "@/components/ClientCompo/PelatihanHome";
import { PelatihanItem } from "@/lib/getPelatihan";

type PelatihanProps = {
    pelatihan: PelatihanItem[];
};

export default async function PelatihanCarousel({ pelatihan }: PelatihanProps) {
    return (
        <section className="pt-16 pb-10 px-5 bg-gray-100">
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 capitalize">
                Pelatihan LPK - Lembaga Pelatihan Kerja
            </h2>
            <PelatihanHome pelatihan={pelatihan} />
        </section>
    );
}