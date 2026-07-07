import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Mail, Lock, User } from "lucide-react";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(name, email, password)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-noor-card border border-noor-divider shadow-noor-heavy rounded-noor p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-noor-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-noor-dark/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-noor-gold/20 text-noor-gold rounded-2xl flex items-center justify-center mx-auto mb-4 border border-noor-gold/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-noor-dark">Buat Akun Baru</h2>
          <p className="text-sm text-noor-textSecondary mt-2">Daftar untuk menyimpan riwayat ibadah Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-noor-textSecondary mb-1.5 ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-noor-textSecondary/50" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-noor-divider rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-noor-gold focus:ring-1 focus:ring-noor-gold/50"
                placeholder="Nama Anda"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-noor-textSecondary mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-noor-textSecondary/50" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-noor-divider rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-noor-gold focus:ring-1 focus:ring-noor-gold/50"
                placeholder="email@anda.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-noor-textSecondary mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-noor-textSecondary/50" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-noor-divider rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-noor-gold focus:ring-1 focus:ring-noor-gold/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-noor-dark to-noor-light text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-noor-textSecondary mt-6 relative z-10">
          Sudah punya akun? <Link to="/login" className="text-noor-gold hover:underline font-bold">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
