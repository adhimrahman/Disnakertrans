'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDefaultProfile } from "@/firebase/utils/profile-service";

export default function ProfileAndAbout() {
    const [profile, setProfile] = useState({
        nama_lengkap: "",
        gambar: "",
        awal_jabat: "",
        akhir_jabat: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDefaultProfile();
            if (data) setProfile(data);
        };
        fetchData();
    }, []);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 capitalize">
                        Tentang Kami
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify mb-6">
                        Dinas Ketenagakerjaan Gowa memiliki komitmen untuk meningkatkan kualitas
                        sumber daya manusia dan menciptakan lapangan kerja yang inklusif dan berkelanjutan.
                        Melalui berbagai program pelatihan, pendampingan pencari kerja, serta kerjasama dengan
                        berbagai pihak, kami hadir untuk memberikan solusi ketenagakerjaan yang nyata bagi masyarakat.
                    </p>
                    <div className="mt-6 text-gray-800 text-left">
                        <p className="text-xl font-semibold mb-2">
                            Kepala Dinas Ketenagakerjaan dan Transmigrasi Gowa:
                        </p>
                        <ul className="list-disc list-inside">
                            <li className="text-lg">Nama Lengkap : {profile.nama_lengkap}</li>
                            <li className="text-lg mt-1">
                                Masa Jabatan : {profile.awal_jabat} s/d {profile.akhir_jabat}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="lg:w-1/2 hidden lg:flex justify-center">
                {profile.gambar && (
                    <Image
                    src={profile.gambar}
                    alt={`Foto ${profile.nama_lengkap}`}
                    width={700}
                    height={700}
                    className="rounded-3xl shadow-lg hover:scale-105 transition duration-300 object-cover"
                    />
                )}
                </div>
            </div>
        </section>
    );
}