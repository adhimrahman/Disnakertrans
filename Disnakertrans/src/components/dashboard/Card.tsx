type CardProps = {
  className?: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  onClick?: () => void;
  titleClassName?: string;
  bodyClassName?: string;
  iconWrapperClassName?: string;
};

export default function Card({
  className = '',
  title,
  body,
  icon,
  onClick,
  titleClassName = '',
  bodyClassName = '',
  iconWrapperClassName = '',
}: CardProps) {
  return (
    <div
      className={`
        w-full sm:w-80 h-auto min-h-[300px] sm:h-[450px] cursor-pointer bg-white rounded-xl shadow-2xl overflow-hidden 
        transform transition-transform duration-300 hover:scale-105 align-middle justify-center
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex flex-col justify-center items-center text-center p-4 sm:p-8 h-full">
        <div className={`text-6xl sm:text-8xl mb-4 sm:mb-8 text-blue-500 mt-6 sm:mt-10 ${iconWrapperClassName}`}>
          {icon}
        </div>
        <h2 className={`text-lg font-base mb-3 sm:mb-4 text-black ${titleClassName}`}>{title}</h2>
        <p className={`text-sm text-gray-700 max-w-xs px-2 sm:px-4 ${bodyClassName}`}>{body}</p>
      </div>
    </div>
  );
}
