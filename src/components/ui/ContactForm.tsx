'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAduanSchema, createAduanFormData } from "@/validation/aduan-validation";
import { addAduan } from "@/firebase/utils/aduan-service";
import CustomButton from "@/components/ui/CustomButton";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<createAduanFormData>({
        resolver: zodResolver(createAduanSchema)
    });

    const onSubmit = async (data: createAduanFormData) => {
        setLoading(true);
        const result = await addAduan(data);
        setLoading(false);
        if (result) {
            toast.success("Pesan berhasil dikirim!");
            reset();
        } else {
            toast.error("Gagal mengirim pesan.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <div>
                <label className="text-gray-800 font-medium mb-2 block">Nama Depan</label>
                <input type="text" {...register("nama_depan")} placeholder="Nama Depan"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400"
                />
                {errors.nama_depan && <p className="text-red-500 text-sm mt-1">{errors.nama_depan.message}</p>}
            </div>

            <div>
                <label className="text-gray-800 font-medium mb-2 block">Nama Belakang</label>
                <input type="text" {...register("nama_belakang")} placeholder="Nama Belakang" 
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400"
                />
                {errors.nama_belakang && <p className="text-red-500 text-sm mt-1">{errors.nama_belakang.message}</p>}
            </div>

            <div>
                <label className="text-gray-800 font-medium mb-2 block">Email</label>
                <input type="email" {...register("email")} placeholder="user@example.com"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className="text-gray-800 font-medium mb-2 block">No Telp</label>
                <input type="text" inputMode="numeric" {...register("no_telp")} placeholder="08xxxxxxxx"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400"
                />
                {errors.no_telp && <p className="text-red-500 text-sm mt-1">{errors.no_telp.message}</p>}
            </div>

            <div className="md:col-span-2">
                <label className="text-gray-800 font-medium mb-2 block">Pesan Anda</label>
                <textarea {...register("pesan")} rows={5} placeholder="Tulis pesan Anda..."
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 placeholder:text-gray-400"
                />
                {errors.pesan && <p className="text-red-500 text-sm mt-1">{errors.pesan.message}</p>}
            </div>

            <div className="md:col-span-2">
                <CustomButton text={loading ? "Mengirim..." : "Kirim Pesan"} width="w-full flex justify-center" py={3} disabled={loading} />
            </div>
        </form>
    );
}