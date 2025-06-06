import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

type CustomButtonProps = {
	text?: string; className?: string;
	width?: string; height?: string;
	px?: number; py?: number;
	variant?: "red" | "blue"; disabled?: boolean;
	href?: string; children?: React.ReactNode;
	onClick?: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
	text, width = 'w-auto', height = 'h-auto', px = 4, py = 2,
	className = '', variant = 'red', disabled = false, href, children, onClick,
}) => {
	const colorClasses = variant === "blue" ? "bg-blue-500 hover:bg-blue-700" : "bg-red-500 hover:bg-red-700";
	const paddingClass = clsx({ [`px-${px}`]: px !== undefined, [`py-${py}`]: py !== undefined });

	const baseClass = clsx(
		"text-white rounded-xl shadow-lg font-semibold transition capitalize text-center hover:cursor-pointer inline-flex items-center gap-1",
		paddingClass, width, height, colorClasses, className
	);

	const content = children ?? text;

	if (href) return <Link href={href} className={baseClass}> {content} </Link>

	return <button className={baseClass} disabled={disabled} onClick={onClick}> {content} </button>
};

export default CustomButton;