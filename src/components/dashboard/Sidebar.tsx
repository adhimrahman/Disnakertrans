import { useEffect, useState } from "react";
import { BsHouseDoor, BsBook, BsFolder2Open } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { CgProfile } from "react-icons/cg";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  type MenuItem = {
    title: string;
    icon: React.ReactNode;
    to: string;
    spacing?: boolean;
  };

  const Menus: MenuItem[] = [
    { title: "Dashboard", icon: <BsHouseDoor />, to: "/dashboard/disnaker/", spacing: true },
    { title: "Content Pages", icon: <BsBook />, to: "/dashboard/disnaker/contents", spacing: true },
    { title: "Aduan", icon: <GrContact />, to: "/dashboard/disnaker/aduan", spacing: true },
    { title: "Laporan Lembaga", icon: <BsFolder2Open />, to: "/dashboard/disnaker/LaporanLembaga", spacing: true },
    { title: "Profile", icon: <CgProfile />, to: `/dashboard/disnaker/profile/${process.env.NEXT_PUBLIC_PROFILE_ID}`, spacing: true },
  ];
  const handleLogout = async () => {
    try {
      // Logout dari Firebase Auth
      await signOut(auth);
      
      // Set localStorage item untuk menandakan logout berhasil
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      
      // Tampilkan pesan berhasil logout
      alert("Anda berhasil logout");
      
      // Arahkan ke halaman beranda setelah logout
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Terjadi kesalahan saat logout");
    }
  };

  return (
    <div className="flex">
      {/* Mobile Menu Button - Fixed position */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="bg-blue-600 text-white p-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`bg-[#1c398e] min-h-screen p-5 pt-8 w-64 flex-col justify-between fixed top-0 left-0 z-20 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } lg:flex`}>
        <div>
          <div className="flex flex-row items-center">
            <Image src="/images/logo_disnaker_2.png" alt="Logo Disnaker" width={38} height={38} />
            <div className="flex flex-col ml-3">
              <h4 className="text-white text-[15px] font-bold">Disnakertrans Gowa</h4>
            </div>
          </div>
          {/* Menu Utama */}
          <ul className="pt-2">
            {Menus.map((menu, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  router.push(menu.to);
                }}
                className={`text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-md duration-200 
                  ${menu.spacing ? "mt-6 lg:mt-9" : "mt-2"} 
                  ${pathname === menu.to || selectedIndex === index 
                    ? "bg-white bg-opacity-10 font-medium" 
                    : "text-white hover:bg-white hover:bg-opacity-20 hover:text-blue-500"}`}
              >
                <span className={`text-2xl block float-left ${
                  pathname === menu.to || selectedIndex === index ? "text-blue-500" : ""
                }`}>
                  {menu.icon}
                </span>
                <span className={`text-base font-medium flex-1 duration-200 ${
                  pathname === menu.to || selectedIndex === index ? "text-blue-500" : ""
                }`}>
                  {menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Logout */}
        <div className="mt-auto pt-5">
          <li
            onClick={handleLogout}
            className="bg-red-600 text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-md duration-200 hover:bg-white hover:bg-opacity-20 hover:text-blue-500"
          >
            <span className="text-2xl block float-left">
              <IoLogOutOutline />
            </span>
            <span className="text-base font-medium flex-1 duration-200">
              Logout
            </span>
          </li>
        </div>
      </div>
    </div>
  );
}
