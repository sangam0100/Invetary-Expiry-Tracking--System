export default function Card({ title, value, color, icon }) {
  return (
    <div className={`p-6 rounded-xl text-white shadow-xl dark:shadow-2xl dark:shadow-gray-900/50 dark:border dark:border-white/20 ${color} transform hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-90 tracking-wide">{title}</h3>
          <p className="text-3xl lg:text-2xl font-black mt-2 leading-tight">{value}</p>
        </div>
        <div className="text-4xl drop-shadow-2xl">{icon}</div>
      </div>
      {/* Shine effect show karta hain */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-8 translate-x-8 blur-xl opacity-75"></div>
    </div>
  );
}
