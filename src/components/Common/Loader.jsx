import { motion } from "framer-motion";

function Loader({ label = "Memuat..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
      <div className="relative flex items-center justify-center">
        {/* Pulsing glow ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-noor-gold/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Spinning main ring */}
        <motion.div
          className="w-12 h-12 rounded-full border-t-2 border-r-2 border-noor-light"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Arabic letter */}
        <span className="absolute text-noor-gold font-arabic text-lg font-bold">ن</span>
      </div>
      <p className="mt-4 text-xs font-bold text-noor-textSecondary uppercase tracking-widest animate-pulse">
        {label}
      </p>
    </div>
  );
}

export default Loader;
