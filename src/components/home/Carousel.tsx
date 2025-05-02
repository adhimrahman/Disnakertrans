"use client"
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import Gambar6 from "../../../public/images/Gambar6.jpg";
import Gambar7 from "../../../public/images/Gambar7.jpg";
import Gambar from "../../../public/images/Gambar.png";

export default function HeroCarousel() {
    return (
        <Swiper modules={[Autoplay, Pagination]} loop={true} pagination={{ clickable: true }} className="w-full h-[450px]" autoplay={{
            delay: 3000,
            disableOnInteraction: false,
        }}>
            <SwiperSlide>
                <Image src={Gambar} alt="Hero Gowa" className="w-full h-[450px] object-cover object-[50%_20%]" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={Gambar6} alt="Pekerja Slide" className="w-full h-[450px] object-cover object-[50%_20%]" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={Gambar7} alt="Job Info Slide" className="w-full h-[450px] object-cover object-[50%_20%]" />
            </SwiperSlide>
        </Swiper>
    );
}
