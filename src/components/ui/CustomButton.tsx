import React from 'react';

type CustomButtonProps = {
	text: string;
	width?: string;
	height?: string;
	className?: string;
	px?: number;
	py?: number;
};

const CustomButton: React.FC<CustomButtonProps> = (
	{ text, width = 'w-auto', height = 'h-auto', px = 'px-0', py = 'py-0', className = '' }
) => {
	return (
		<button
			className={`bg-red-500 text-white rounded-xl shadow-lg
			hover:bg-red-700 transition hover:cursor-pointer capitalize 
			px-${px} py-${py} ${width} ${height} ${className}`}
		>
			{text}	
		</button>
	);
};

export default CustomButton;