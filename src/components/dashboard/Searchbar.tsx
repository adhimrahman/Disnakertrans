import { IoSearchOutline } from "react-icons/io5";
import Image from 'next/image'
export default function Searchbar() { 
  return (
    <nav className="flex items-center sticky top-0 z-20 bg-white p-4 shadow-lg">
      <div className="flex flex-row gap-4 justify-between w-full items-center">
        <IoSearchOutline className="text-gray-400 text-4xl"/>
        <input type="text" placeholder="Search..." className="rounded px-3 py-1 text-lg text-black w-full"/>
        <Image src="/images/logo_disnaker_2.png" alt="Logo Disnaker" width={50} height={50} />
      </div>
    </nav>
  );
}