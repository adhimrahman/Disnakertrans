import Image from "next/image";
import Gowa from "../../../public/pemkabGowaLogo.svg"

export default function Header() {
    return(
        <div className="navbar bg-[#3561A1] w-full h-20 px-9 flex flex-row items-center justify-between text-white">
            <div className="leftside logo w-1/4 h-full flex items-center">
                <Image src={Gowa} alt="Logo Pemerintahan Kab. Gowa" className="w-fit h-full py-1"></Image>
                <p className="pl-4 uppercase">dinas ketenagakerjaan <br /> dan transmigrasi gowa</p>
            </div>
            <ul className="rightside menus w-2/4 h-full pl-20 flex items-center justify-around capitalize">
                <li className="hover:opacity-70 hover:font-semibold hover:cursor-pointer">home</li>
                <li className="hover:opacity-70 hover:font-semibold hover:cursor-pointer">kegiatan</li>
                <li className="hover:opacity-70 hover:font-semibold hover:cursor-pointer">lowongan</li>
                <li className="hover:opacity-70 hover:font-semibold hover:cursor-pointer">contact us</li>
                <li className="bg-red-400 py-2 px-4 rounded-xl"><p>login</p></li>
            </ul>
        </div>
    )
}