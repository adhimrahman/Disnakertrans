import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Image from "next/image";
import kami from "../../../../public/images/kami.jpg"

export default function ContactUsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            
            <section className="flex-grow px-4 py-10 lg:px-32">
                <h1 className="text-4xl text-black font-bold text-center mb-2">Contact Us</h1>
                <p className="text-center text-gray-600 mb-10">
                    Hubungi kami untuk mengetahui informasi lebih lanjut mengenai Disnaker Gowa
                </p>

                <div className="bg-white shadow-md border rounded-md p-8 max-w-5xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Depan */}
                        <div>
                            <label className="text-black block font-semibold mb-1">Nama Depan</label>
                            <input type="text" placeholder="Dean" className="w-full p-3 rounded border bg-gray-50 placeholder:text-gray-200" />
                        </div>

                        {/* Nama Belakang */}
                        <div>
                            <label className="text-black block font-semibold mb-1">Nama Belakang</label>
                            <input type="text" placeholder="Pasamba" className="w-full p-3 rounded border bg-gray-50 placeholder:text-gray-200" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-black block font-semibold mb-1">Email</label>
                            <input type="email" placeholder="Dean@example.com" className="w-full p-3 rounded border bg-gray-50 placeholder:text-gray-200" />
                        </div>

                        {/* No Telepon */}
                        <div>
                            <label className="text-black block font-semibold mb-1">No Telp</label>
                            <input type="tel" placeholder="12345" className="w-full p-3 rounded border bg-gray-50 placeholder:text-gray-200" />
                        </div>

                        {/* Pesan Anda */}
                        <div className="md:col-span-2">
                            <label className="text-black block font-semibold mb-1">Pesan Anda</label>
                            <textarea rows={5} placeholder="Tuliskan Pesan Anda...." className="w-full p-3 rounded border bg-gray-50 placeholder:text-gray-200"></textarea>
                        </div>

                        {/* Tombol Kirim */}
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded" >
                                Kirim
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            
            <section className="py-16 bg-white">
                <div className="container mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 px-4 lg:px-20">Lokasi Kami</h2>
                    <div className="w-full h-[600px]">
                        <iframe 
                            title="Lokasi Disnaker Gowa"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.8384255281273!2d119.4565429749946!3d-5.162242552232058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefd6bfeabbb0f%3A0x94b5942556cf2530!2sDinas%20Tenaga%20Kerja%20dan%20Transmigrasi%20Kabupaten%20Gowa!5e0!3m2!1sid!2sid!4v1712238472454!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            className="rounded-md border-2 border-gray-300"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
		    </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10">
                    <div className="lg:w-1/2 flex flex-col justify-start h-full">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            Tentang Kami
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                            in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
    
                    <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
                        <Image
                            src={kami} 
                            alt="About Us Illustration" 
                            className="h-[500px] w-auto object-cover rounded-3xl"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}