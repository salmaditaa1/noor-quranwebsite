import { Hammer, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function ComingSoon({ title = "Fitur Segera Hadir" }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="w-20 h-20 bg-noor-gold/10 rounded-full flex items-center justify-center mb-6 shadow-noor-sm border border-noor-gold/20">
        <Hammer className="w-10 h-10 text-noor-gold" />
      </div>
      <h2 className="text-2xl font-extrabold text-noor-dark mb-2">{title}</h2>
      <p className="text-sm text-noor-textSecondary max-w-sm mb-8">
        Kami sedang membangun fitur ini untuk memberikan pengalaman beribadah yang lebih baik. Nantikan pembaruannya!
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="px-6 py-2.5 bg-white border border-noor-divider rounded-xl font-bold text-sm text-noor-dark hover:bg-noor-gold hover:text-white transition-colors flex items-center gap-2 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>
    </div>
  );
}

export default ComingSoon;
