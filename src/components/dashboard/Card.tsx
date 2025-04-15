type CardProps = {
  className?: string; // untuk control size
  title: string;
  body: string;
  icon: React.ReactNode;
};

export default function Card({ className = '', title, body, icon }: CardProps) {
  return (
    <div className={`cursor-pointer bg-white rounded-xl shadow-2xl overflow-hidden ${className}`}>
      <div className="flex flex-col items-center gap-2 mb-2 p-6">
        <div className="text-8xl text-blue-500">{icon}</div> {/* ✅ Tampilkan icon */}
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="text-sm text-gray-700">{body}</p>
      </div>
    </div>
  );
}
