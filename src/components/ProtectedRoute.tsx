"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Modal from "react-modal";
import { handleLogout } from "@/lib/auth";

type ProtectedRouteProps = {
    children: React.ReactNode;
    expectedRole: "disnaker" | "lpk";
    checkLpkId?: boolean;
};

const ProtectedRoute = ({ children, expectedRole, checkLpkId = false }: ProtectedRouteProps) => {
    const router = useRouter();
    const params = useParams();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setIsAuthorized(false);
                setIsModalOpen(true);
                return;
            }

            const docRef = doc(db, "akun", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setIsAuthorized(false);
                setIsModalOpen(true);
                return;
            }

            const userData = docSnap.data();
            const role = userData.role;

            if (role !== expectedRole) {
                setIsAuthorized(false);
                setIsModalOpen(true);
                return;
            }

            if (checkLpkId) {
                const urlLpkId = params?.lpkId;
                const userLpkId = userData.lpkId;

                if (urlLpkId !== userLpkId) {
                    setIsAuthorized(false);
                    setIsModalOpen(true);
                    return;
                }
            }

            setIsAuthorized(true);
        });

        return () => unsubscribe();
    }, [expectedRole, checkLpkId, params]);

    const handleRedirect = () => {
        setIsModalOpen(false);
        router.push("/login");
    };

    const handleLogoutClick = async () => {
        await handleLogout();
        router.push("/login");
    }

    if (isAuthorized === null) {
        return <div className="text-white">Loading...</div>;
    }

    if (isAuthorized === false) {
        return (
        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Login Required" ariaHideApp={false}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="bg-white p-6 rounded-xl max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-black">Anda tidak memiliki akses ke halaman ini.</h2>
                <p className="text-gray-700 mb-4">
                    Untuk mengakses halaman ini, Anda harus Re-Login / Logout terlebih dahulu.
                </p>
                <div className="flex justify-between pr-3">
                    <button onClick={handleRedirect} className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4 cursor-pointer">
                        Kembali
                    </button>
                    <button onClick={handleLogoutClick} className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4 cursor-pointer">
                        Logout
                    </button>
                </div>
            </div>
        </Modal>
        );
    }
    return <>{children}</>;
};

export default ProtectedRoute;