import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ui/ContactForm";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />

            <section className="flex-grow px-4 py-16 lg:px-32 bg-gray-100 pt-30">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
                    <p className="text-lg text-gray-600">
                        Silakan isi formulir di bawah ini untuk informasi lebih lanjut mengenai Disnaker Gowa.
                    </p>
                </div>

                <div className="bg-white shadow-lg border rounded-xl p-8 mt-6 max-w-5xl mx-auto">
                    <ContactForm />
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center lg:text-left">Lokasi Kami</h2>
                    <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 mb-14">
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

            <ToastContainer position="top-right" autoClose={3000} />
            <Footer />
        </div>
    );
}
