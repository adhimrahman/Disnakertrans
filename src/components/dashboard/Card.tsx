
import React, { ReactNode } from 'react';

type CardProps = {
  className?: string; // untuk control size
  title: string;
  body: string;
  icon: React.ReactNode;
  onClick?: () => void;
  titleClassName?: string;
  bodyClassName?: string;
  iconWrapperClassName?: string;
};


export default function Card({className = '', title, body, icon, onClick, 
  titleClassName = "",
  bodyClassName = "",
  iconWrapperClassName = ""
}: CardProps) {
  

  return (
    <div
      className={`cursor-pointer bg-white rounded-xl shadow-2xl overflow-hidden ${className}`}
    >
      <div className="flex flex-col justify-center items-center text-center gap-3 p-4" onClick={onClick}>
        <div className="text-8xl mb-8 text-blue-500 mt-10">{icon}</div> {/* ✅ Tampilkan icon */}
        <h2 className="text-lg font-base mb-4 text-black">{title}</h2>
        <p className="text-sm text-gray-700 max-w-xs px-4">{body}</p>
      </div>
    </div>
  );
}
