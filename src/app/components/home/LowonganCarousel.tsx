import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function LowonganCarousel() {
  return (
    <section className="py-16 bg-gray-100 ,-">
    <div>
        <h2 className="text-3xl lg:text-4xl font-bold text-left ml-10 mb-10 text-black">
            Lowongan Pekerjaan di Gowa
        </h2>

        <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={3}
            navigation
            className='px-4'
        >
            {/* Card 1 */}
            <SwiperSlide>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
                    <div className="bg-gray-300 h-40"></div>
                    <div className="p-4 text-center">
                        <p className="text-gray-700">
                            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                            tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline mt-2 block">
                            Lihat selengkapnya...
                        </a>
                    </div>
                </div>
            </SwiperSlide>

            {/* Card 2 */}
            <SwiperSlide>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
                    <div className="bg-gray-300 h-40"></div>
                    <div className="p-4 text-center">
                        <p className="text-gray-700">
                            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                            tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline mt-2 block">
                            Lihat selengkapnya...
                        </a>
                    </div>
                </div>
            </SwiperSlide>

            {/* Card 3 */}
            <SwiperSlide>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
                    <div className="bg-gray-300 h-40"></div>
                    <div className="p-4 text-center">
                        <p className="text-gray-700">
                            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                            tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline mt-2 block">
                            Lihat selengkapnya...
                        </a>
                    </div>
                </div>
            </SwiperSlide>

            {/* Card 4 */}
            <SwiperSlide>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 m-4">
                    <div className="bg-gray-300 h-40"></div>
                    <div className="p-4 text-center">
                        <p className="text-gray-700">
                            Dinas KetenagaLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                            tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <a href="#" className="text-blue-600 hover:underline mt-2 block">
                            Lihat selengkapnya...
                        </a>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
  </section>
  )
}
