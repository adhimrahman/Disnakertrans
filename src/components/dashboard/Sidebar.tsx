import { useEffect, useState } from "react";
import { BsHouseDoor, BsBook, BsFillPeopleFill, BsFolder2Open } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    { title: "Accounts", icon: <BsFillPeopleFill />, to: "/dashboard/disnaker/accounts", spacing: true },
    { title: "LPK", icon: <BsFolder2Open />, to: "/dashboard/disnaker/lpk", spacing: true },
  ];

  const handleLogout = () => {
    // Simulasi logout, Anda bisa menggantinya dengan logika autentikasi nyata seperti Firebase atau Supabase
    alert("Anda berhasil logout");

    // Arahkan ke halaman beranda setelah logout
    router.push("/");
  };

  return (
    <div className="flex">
      <div className="bg-[#1c398e] min-h-screen p-5 pt-8 w-64 flex flex-col justify-between top-0 left-0 fixed">
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
                  ${menu.spacing ? "mt-9" : "mt-2"} 
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
        <div>
          <li
            onClick={handleLogout} // Menambahkan fungsi logout pada tombol ini
            className="text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 mt-9 rounded-md duration-200 hover:bg-white hover:bg-opacity-20 hover:text-blue-500"
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
