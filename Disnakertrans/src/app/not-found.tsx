import Navbar from "@/components/Navbar";
import HomeImg from "../../public/pemkabGowaLogo.svg";
import Image from 'next/image';
import Link from "next/link";

export default function NotFound() {
    
    return (
        <div className="h-screen w-full bg-steelBlue text-gray-900 flex justify-center">
            <Navbar />

            <section className="home grid h-screen pt-32 pb-16">
                <div className="home__container container grid content-center gap-12 lg:max-w-5xl lg:grid-cols-2 lg:items-center">
                    <div className="home__data justify-self-center text-center lg:text-left">
                        <p className="pb-2 font-semibold">Error 404</p>
                        <h1 className="pb-4 text-5xl font-bold lg:text-6xl capitalize">Oopss...</h1>
                        <p className="pb-8 font-semibold">
                            Kami tidak dapat menemukan halaman <br /> yang Anda cari.
                        </p>
                        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-gray-900 py-4 px-8 font-bold text-white hover:bg-gray-600 hover:cursor-pointer">
                            Kembali ke Home
                        </Link>
                    </div>

                    <div className="home__img justify-self-center">
                        <Image src={HomeImg} className="w-64 animate-floting" alt="gambar beranda"/>
                        <div className="home__shadow mx-auto h-8 w-36 animate-shadow rounded-[50%] bg-gray-900/30 blur-md lg:w-64"></div>
                    </div>
                </div>

                <div className="home__footer flex items-center justify-center gap-2 self-end text-sm font-semibold">
                    <p>Hak Cipta © 2025 Teknik Informatika Universitas Hasanuddin - Semua hak dilindungi.</p>
                </div>
            </section>
        </div>
    );
}