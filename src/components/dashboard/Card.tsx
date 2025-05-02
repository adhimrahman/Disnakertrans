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
        h-[450px] cursor-pointer bg-white rounded-xl shadow-2xl overflow-hidden 
        transform transition-transform duration-300 hover:scale-105
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex flex-col justify-center items-center text-center p-8 h-full">
        <div className={`text-8xl mb-8 text-blue-500 mt-10 ${iconWrapperClassName}`}>
          {icon}
        </div>
        <h2 className={`text-lg font-base mb-4 text-black ${titleClassName}`}>{title}</h2>
        <p className={`text-sm text-gray-700 max-w-xs px-4 ${bodyClassName}`}>{body}</p>
      </div>
    </div>
  );
}
