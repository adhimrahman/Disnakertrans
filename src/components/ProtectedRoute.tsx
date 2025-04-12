"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "@/firebase/config"; 
import Modal from "react-modal"; // Install React-modal

// npm install react-modal
// npm install --save-dev @types/react-modal

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Tambahkan state modal

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Jika user ada, setAuthenticated ke true
        setShowModal(false); // Jika ada user, tutup modal
      } else {
        setIsAuthenticated(false); // Jika user tidak ada, show modal
        setIsModalOpen(true); // Buka modal
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLoginRedirect = () => {
    setIsModalOpen(false); // Menutup modal saat redirect
    router.push("/login"); // Mengarahkan user ke halaman login
  };

  return (
    <>
      {isAuthenticated ? (
        <>{children}</> // Jika user terautentikasi, tampilkan konten
      ) : (
        // Jika tidak terautentikasi, tampilkan modal
        <div>
          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)} // Menutup modal jika di luar modal diklik
            contentLabel="Login Required"
            ariaHideApp={false} // Menonaktifkan penghapusan elemen di server-side
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-xl max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-black">Anda perlu login terlebih dahulu</h2>
              <p className="text-gray-700 mb-4">
                Untuk mengakses halaman ini, Anda harus masuk terlebih dahulu.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4 cursor-pointer"
              >
                Ke Halaman Login
              </button>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
