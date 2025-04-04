'use client';
import React from 'react';
import { useEffect, useState } from "react";

export default function InfografisSection() {
    const [tenagaKerja, setTenagaKerja] = useState(0);
    const [pencariKerja, setPencariKerja] = useState(0);
    const [pelatihan, setPelatihan] = useState(0);

    useEffect(() => {
        const targetTenagaKerja = 1113;
        const targetPencariKerja = 1113;
        const targetPelatihan = 1113;
        const duration = 2000;

        let startTime = Date.now();
        const updateCounter = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            setTenagaKerja(Math.floor(progress * targetTenagaKerja));
            setPencariKerja(Math.floor(progress * targetPencariKerja));
            setPelatihan(Math.floor(progress * targetPelatihan));
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }, []);
  return (
    <section className="text-white py-16" style={{ backgroundColor: "#3561A1" }}>
    <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-10">
            Infografis Ketenagakerjaan Gowa
        </h2>

        {/* Grid kolom 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
                <p className="text-lg font-semibold">Jumlah Tenaga Kerja</p>
                <p className="text-4xl font-bold mt-2">{tenagaKerja}</p>
            </div>

            <div>
                <p className="text-lg font-semibold">Jumlah Pencari Kerja</p>
                <p className="text-4xl font-bold mt-2">{pencariKerja}</p>
            </div>

            <div>
                <p className="text-lg font-semibold">Program Pelatihan</p>
                <p className="text-4xl font-bold mt-2">{pelatihan}</p>
            </div>
        </div>
    </div>
  </section>
  )
}
