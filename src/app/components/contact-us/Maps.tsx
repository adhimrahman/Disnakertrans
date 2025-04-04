import React from 'react'

export default function Maps() {
  return (
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
  )
}
