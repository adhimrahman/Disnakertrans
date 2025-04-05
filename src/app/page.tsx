"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/home/HeroSection";
import WelcomeSection from "./components/home/WelcomeSection";
import NarrativeSection from "./components/home/NarrativeSection";
import Kegiatan from "./components/home/Kegiatan";
import LowonganCarousel from "./components/home/LowonganCarousel";
import InfografisSection from "./components/home/InfografisSection";
import AboutSection from "./components/home/AboutSection";
import ContactHighlight from "./components/ContactHighlight";

export default function HomePage() {
	return (
		<div className="min-h-screen">
		  <Navbar />
		  <HeroSection />
		  <WelcomeSection />
		  <NarrativeSection />
		  <Kegiatan />
		  <LowonganCarousel />
		  <InfografisSection />
		  <AboutSection />
		  <ContactHighlight />
		  <Footer />
		</div>
	  );
}