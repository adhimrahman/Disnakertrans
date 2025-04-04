"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Contact from "../components/contact-us/Contact";
import Maps from "../components/contact-us/Maps";
import About from "../components/contact-us/About";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Contact />
      <Maps />
      <About />
      <Footer />
    </div>
  );
}
