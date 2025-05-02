import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <section className="flex-grow px-4 py-16 lg:px-32 bg-white pt-30">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
                    <p className="text-lg text-gray-600">
                        Silakan isi formulir di bawah ini untuk informasi lebih lanjut mengenai Disnaker Gowa.
                    </p>
                </div>

                <div className="bg-white shadow-lg border rounded-xl p-8 mt-6 max-w-5xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-800 font-medium mb-2 block">Nama Depan</label>
                            <input type="text" placeholder="Dean" className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-gray-800 font-medium mb-2 block">Nama Belakang</label>
                            <input type="text" placeholder="Pasamba" className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-gray-800 font-medium mb-2 block">Email</label>
                            <input type="email" placeholder="dean@example.com" className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400" />
                        </div>
                        <div>
                            <label className="text-gray-800 font-medium mb-2 block">No Telp</label>
                            <input type="tel" placeholder="08xxxxxxxx" className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-gray-800 font-medium mb-2 block">Pesan Anda</label>
                            <textarea rows={5} placeholder="Tulis pesan Anda..." className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400"></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-semibold py-3 rounded-lg hover:cursor-pointer">
                                Kirim Pesan
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="py-16 bg-gray-50 mb-14">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center lg:text-left">Lokasi Kami</h2>
                    <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-gray-300">
                        <iframe 
                            title="Lokasi Disnaker Gowa"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.8384255281273!2d119.4565429749946!3d-5.162242552232058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbefd6bfeabbb0f%3A0x94b5942556cf2530!2sDinas%20Tenaga%20Kerja%20dan%20Transmigrasi%20Kabupaten%20Gowa!5e0!3m2!1sid!2sid!4v1712238472454!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            className="w-full h-full"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
