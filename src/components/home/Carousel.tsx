"use client"
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import Job1 from "../../../public/images/Job1.png";
import Job2 from "../../../public/images/Job2.png";
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
                <Image src={Job1} alt="Pekerja Slide" className="w-full h-[450px] object-cover object-[50%_20%]" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={Job2} alt="Job Info Slide" className="w-full h-[450px] object-cover object-[50%_20%]" />
            </SwiperSlide>
        </Swiper>
    );
}
