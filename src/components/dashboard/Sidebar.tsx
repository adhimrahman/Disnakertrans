import { useState } from "react";
import { BsHouseDoor, BsBook, BsFillPeopleFill, BsFolder2Open } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  type MenuItem = {
    title: string;
    icon: React.ReactNode;
    to: string;
    spacing?: boolean;
  };

  const Menus: MenuItem[] = [
    { title: "Dashboard", icon: <BsHouseDoor />, to: "/dashboard/disnaker", spacing: true },
    { title: "Content Pages", icon: <BsBook />, to: "/dashboard/disnaker/contents", spacing: true},
    { title: "Accounts", icon: <BsFillPeopleFill />, to: "/dashboard/disnaker/accounts", spacing: true },
    { title: "LPK", icon: <BsFolder2Open />, to: "/dashboard/disnaker/lpk", spacing: true },
  ];

  return (
    <div className="flex">
      <div className="bg-blue-500 min-h-screen p-5 pt-8 w-72 flex flex-col justify-between top-0 left-0 fixed">
        <div>
          <div className="flex flex-row items-center">
            <Image src="/images/logo_disnaker_2.png" alt="Logo Disnaker" width={60} height={60} />
            <div className="flex flex-col ml-6">
              <h3 className="text-white text-2xl font-bold">Disnaker</h3>
              <h3 className="text-white text-2xl font-bold">GOWA</h3>
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
                className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-md duration-200 ${
                  pathname === menu.to || selectedIndex === index
                    ? "bg-white bg-opacity-30 text-black"
                    : "hover:bg-white hover:bg-opacity-20 hover:text-black"
                } ${menu.spacing ? "mt-9" : "mt-2"}`}
              >
                <span className="text-2xl block float-left">{menu.icon}</span>
                <span className="text-base font-medium flex-1 duration-200">
                  {menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Logout */}
        <div>
          <li
            onClick={() => {
              setSelectedIndex(Menus.length);
              console.log("Logout Successful");
            }}
            className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 mt-9 rounded-md duration-200 ${
              selectedIndex === Menus.length
                ? "bg-white bg-opacity-30 text-black"
                : "hover:bg-white hover:bg-opacity-20 hover:text-black"
            }`}
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
};