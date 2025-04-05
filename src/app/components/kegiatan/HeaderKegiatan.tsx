import React from "react";

export default function HeaderKegiatan() {
  return (
    <section className="relative w-full h-[300px]">
      <img
        src="/images/Ilustrasi.jpeg"
        alt="Header Kegiatan Disnaker"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold">
          Kegiatan Disnaker
        </h1>
      </div>
    </section>
  );
}
