"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "@/firebase/config"; 
import Modal from "react-modal";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
		if (user) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
			setIsModalOpen(true);
		}
		});

		return () => unsubscribe();
	}, []);

	const handleLoginRedirect = () => {
		setIsModalOpen(false);
		router.push("/login");
	};

	return (
		<>
		{isAuthenticated ? (
			<>{children}</>
		) : (
			<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Login Required" ariaHideApp={false}
				className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
			>
				<div className="bg-white p-6 rounded-xl max-w-lg mx-auto">
					<h2 className="text-2xl font-semibold mb-4 text-black">Anda perlu login terlebih dahulu</h2>
					<p className="text-gray-700 mb-4">
						Untuk mengakses halaman ini, Anda harus masuk terlebih dahulu.
					</p>
					<button onClick={handleLoginRedirect} className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4 cursor-pointer">
						Ke Halaman Login
					</button>
				</div>
			</Modal>
		)}
		</>
	);
};

export default ProtectedRoute;