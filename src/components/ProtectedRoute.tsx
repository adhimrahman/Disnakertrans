"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Modal from "react-modal";

type ProtectedRouteProps = {
	children: React.ReactNode;
	expectedRole: "disnaker" | "lpk";
};

const ProtectedRoute = ({ children, expectedRole }: ProtectedRouteProps) => {
	const router = useRouter();
	// const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const docRef = doc(db, "akun", user.uid);
				const docSnap = await getDoc(docRef);

				if (!docSnap.exists()) {
					setIsAuthorized(false);
					setIsModalOpen(true);
					return;
				}

				const role = docSnap.data().role;

				if (role === expectedRole) {
					setIsAuthorized(true);
				} else {
					setIsAuthorized(false);
					setIsModalOpen(true);
				}
			} else {
				setIsAuthorized(false);
				setIsModalOpen(true);
			}
		});

		return () => unsubscribe();
	}, [expectedRole]);

	const handleRedirect = () => {
		setIsModalOpen(false);
		router.push("/login");
	};

	if (isAuthorized === null) {
		return <div className="text-white">Loading...</div>;
	}

	if (isAuthorized) {
		return <>{children}</>;
	}

	return (
		<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Login Required" ariaHideApp={false}
			className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
		>
			<div className="bg-white p-6 rounded-xl max-w-lg mx-auto">
				<h2 className="text-2xl font-semibold mb-4 text-black">Anda perlu login terlebih dahulu</h2>
				<p className="text-gray-700 mb-4">
					Untuk mengakses halaman ini, Anda harus masuk terlebih dahulu.
				</p>
				<button onClick={handleRedirect} className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4 cursor-pointer">
					Ke Halaman Login
				</button>
			</div>
		</Modal>
	);
};

export default ProtectedRoute;