import React from 'react';

type CustomButtonProps = {
	text: string;
	width?: string;
	height?: string;
	className?: string;
	px?: number;
	py?: number;
	variant?: "red" | "blue";
};

const CustomButton: React.FC<CustomButtonProps> = (
	{ text, width = 'w-auto', height = 'h-auto', px = 'px-0', py = 'py-0', className = '', variant = 'red' }
) => {
	const colorClasses =
		variant === "blue"
			? "bg-blue-500 hover:bg-blue-700"
			: "bg-red-500 hover:bg-red-700";
	
	return (
		<button
			className={`
				text-white rounded-xl shadow-lg font-semibold
				transition hover:cursor-pointer capitalize 
				px-${px} py-${py}
				${width} ${height}
				${className}
				${colorClasses}
			`}
		>
			{text}	
		</button>
	);
};

export default CustomButton;