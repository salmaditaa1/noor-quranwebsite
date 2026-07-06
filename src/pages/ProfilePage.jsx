import { useState, useEffect } from "react";
import { User, Settings, Palette, Type, Check, LogOut, Bell } from "lucide-react";
import toast from "react-hot-toast";

const THEMES = [
  { id: "cream", name: "Premium Cream", color: "bg-[#F6EFE4]" },
  { id: "mahogany", name: "Mahogany Dark", color: "bg-[#2C0F12]" },
  { id: "gold", name: "Dark Gold", color: "bg-[#B58A44]" }
];

const ARABIC_FONTS = [
  { id: "amiri", name: "Amiri (Kemenag)" },
  { id: "lpmq", name: "LPMQ Isep Misbah" },
  { id: "uthmani", name: "Uthmani Hafs" }
];

function ProfilePage() {
  const [preferences, setPreferences] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-preferences")) || {
      theme: "cream",
      arabicFont: "amiri",
      arabicFontSize: 28,
      translationFontSize: 14,
      notifications: true,
      dailyTarget: 10
    };
  });

  useEffect(() => {
    localStorage.setItem("noor-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success("Preferensi disimpan");
  };

  const handleLogout = () => {
    toast.success("Berhasil keluar dari akun");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      
      {/* Header Profile */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-8 border border-noor-gold/25 shadow-noor-heavy flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-5 pointer-events-none">
           <User className="w-full h-full text-noor-gold" />
        </div>
        
        <div className="w-24 h-24 rounded-full bg-[#F6EFE4] text-noor-dark flex items-center justify-center border-4 border-noor-gold/50 shadow-md relative z-10">
          <User className="w-12 h-12" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-[#F6EFE4] rounded-full"></div>
        </div>

        <div className="text-center md:text-left relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans mb-1">
            Hamba Allah
          </h2>
          <p className="text-[#E8D8BF]/80 text-sm font-medium mb-3">
            Bergabung sejak Ramadhan 1445 H
          </p>
          <span className="inline-block px-3 py-1 bg-noor-gold/20 border border-noor-gold/40 rounded-full text-xs font-bold text-noor-gold">
            Premium Member
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Tampilan & Tema */}
          <div className="bg-white border border-noor-divider rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-noor-dark flex items-center gap-2 mb-6 border-b border-noor-divider/50 pb-3">
              <Palette className="w-5 h-5 text-noor-gold" />
              Tampilan & Tema
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-noor-textSecondary mb-3">Tema Aplikasi</label>
              <div className="flex gap-3">
                {THEMES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => updatePreference("theme", t.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                      preferences.theme === t.id ? "bg-noor-gold/10 ring-1 ring-noor-gold" : "hover:bg-gray-50 opacity-70"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full shadow-inner border border-black/10 flex items-center justify-center ${t.color}`}>
                      {preferences.theme === t.id && <Check className={t.id === "cream" ? "text-noor-dark" : "text-white"} />}
                    </div>
                    <span className="text-[10px] font-bold text-noor-dark text-center">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pengaturan Membaca */}
          <div className="bg-white border border-noor-divider rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-noor-dark flex items-center gap-2 mb-6 border-b border-noor-divider/50 pb-3">
              <Type className="w-5 h-5 text-noor-gold" />
              Pengaturan Membaca Al-Qur'an
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-noor-textSecondary mb-2">Jenis Khat (Font) Arab</label>
                <select 
                  className="w-full bg-noor-card border border-noor-divider rounded-lg px-3 py-2.5 text-sm font-semibold text-noor-dark focus:outline-none focus:border-noor-gold"
                  value={preferences.arabicFont}
                  onChange={(e) => updatePreference("arabicFont", e.target.value)}
                >
                  {ARABIC_FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-noor-textSecondary mb-2 flex justify-between">
                  <span>Ukuran Font Arab</span>
                  <span className="text-noor-gold">{preferences.arabicFontSize}px</span>
                </label>
                <input 
                  type="range" min="18" max="48" step="2"
                  value={preferences.arabicFontSize}
                  onChange={(e) => updatePreference("arabicFontSize", parseInt(e.target.value))}
                  className="w-full accent-noor-gold h-1.5 bg-noor-divider rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <div className="p-6 border border-noor-divider rounded-xl bg-[#F6EFE4]/30 text-center">
                  <p className="text-noor-textSecondary text-xs mb-4">Pratinjau Teks Arab</p>
                  <p 
                    className="font-arabic text-noor-dark leading-loose"
                    style={{ fontSize: `${preferences.arabicFontSize}px` }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Sidebar Settings */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-noor-divider rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-noor-dark flex items-center gap-2 mb-4 border-b border-noor-divider/50 pb-3">
              <Settings className="w-5 h-5 text-noor-gold" />
              Lainnya
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-noor-dark">Notifikasi Harian</h4>
                  <p className="text-[10px] text-noor-textSecondary">Pengingat baca Qur'an</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.notifications}
                    onChange={(e) => updatePreference("notifications", e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-noor-gold"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-noor-dark">Target Harian</h4>
                  <p className="text-[10px] text-noor-textSecondary">Jumlah halaman/hari</p>
                </div>
                <select 
                  className="bg-noor-card border border-noor-divider rounded-md px-2 py-1 text-xs font-bold text-noor-dark focus:outline-none"
                  value={preferences.dailyTarget}
                  onChange={(e) => updatePreference("dailyTarget", parseInt(e.target.value))}
                >
                  <option value="5">5 Hal</option>
                  <option value="10">10 Hal</option>
                  <option value="20">20 Hal</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full mt-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Keluar Akun
            </button>
          </div>

          <div className="bg-noor-card border border-noor-divider/50 rounded-2xl p-5 text-center shadow-sm">
            <h4 className="text-xs font-bold text-noor-textSecondary uppercase tracking-wider mb-2">Bantuan & Info</h4>
            <p className="text-[10px] text-noor-textSecondary/70 mb-4">
              Punya pertanyaan atau masukan untuk aplikasi Noor? Kami siap mendengarkan.
            </p>
            <button className="w-full py-2 bg-noor-dark text-white rounded-lg text-xs font-bold shadow-md hover:bg-noor-gold transition-colors">
              Hubungi Dukungan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
