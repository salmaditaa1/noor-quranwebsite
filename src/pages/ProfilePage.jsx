import { useState, useEffect } from "react";
import { User, Settings, RefreshCw, Type, Check, LogOut, Bell, Edit3, Save, X, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

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

  const { user, updateProfile, logout } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    city: user?.city || "" 
  });

  useEffect(() => {
    localStorage.setItem("noor-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success("Preferensi disimpan");
  };

  const handleGoogleSync = () => {
    setIsSyncing(true);
    const toastId = toast.loading("Menghubungkan dengan akun Google...");
    setTimeout(() => {
      updateProfile({
        name: user?.name || "",
        email: user?.email || "",
        isGuest: false,
        city: user?.city || "",
        photo: user?.photo || null
      });
      setIsSyncing(false);
      toast.success("Akun berhasil disinkronisasi dengan Google!", { id: toastId });
    }, 1500);
  };

  const handleDisconnectSync = () => {
    if (window.confirm("Apakah Anda yakin ingin memutuskan sinkronisasi? Data Anda akan tetap disimpan secara lokal.")) {
      updateProfile({
        name: "",
        email: "",
        isGuest: true,
        city: user?.city || "",
        photo: null
      });
      toast.success("Koneksi Google diputuskan.");
    }
  };

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Ukuran foto maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-8 border border-noor-gold/25 shadow-noor-heavy flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-5 pointer-events-none">
           <User className="w-full h-full text-noor-gold" />
        </div>
        
        <div className="w-24 h-24 rounded-full bg-[#F6EFE4] text-noor-dark flex items-center justify-center border-4 border-noor-gold/50 shadow-md relative z-10 overflow-hidden group">
          {user?.photo ? (
            <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12" />
          )}
          
          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-6 h-6 text-white mb-1" />
            <span className="text-[9px] text-white font-bold">Ubah Foto</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="text-center md:text-left relative z-10 flex-1">
          {isEditingProfile ? (
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-noor-dark">
              <input 
                type="text" 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-3 py-1.5 rounded-lg mb-2 text-sm bg-white border border-noor-gold/30 outline-none" 
                placeholder="Nama Lengkap" 
              />
              <input 
                type="email" 
                value={editForm.email} 
                onChange={e => setEditForm({...editForm, email: e.target.value})}
                className="w-full px-3 py-1.5 rounded-lg mb-2 text-sm bg-white border border-noor-gold/30 outline-none" 
                placeholder="Email" 
              />
              <input 
                type="text" 
                value={editForm.city} 
                onChange={e => setEditForm({...editForm, city: e.target.value})}
                className="w-full px-3 py-1.5 rounded-lg mb-3 text-sm bg-white border border-noor-gold/30 outline-none" 
                placeholder="Kota Domisili" 
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsEditingProfile(false)} className="px-3 py-1.5 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg text-xs font-bold transition-colors">Batal</button>
                <button onClick={handleSaveProfile} className="px-3 py-1.5 bg-noor-gold hover:bg-[#967135] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"><Save className="w-3 h-3" /> Simpan</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="w-full">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans mb-1">
                    {user?.name || "Belum Login"}
                  </h2>
                  <p className="text-[#E8D8BF]/80 text-sm font-medium mb-1">
                    {user?.email ? `${user.email} • ${user.city || ""}` : "Masuk untuk menyimpan Bookmark & Progress"}
                  </p>
                  <p className="text-[#E8D8BF]/60 text-xs font-medium mb-3">
                    {user?.email ? `Bergabung sejak ${new Date(user?.id || Date.now()).toLocaleDateString("id-ID")}` : "Profil lokal hanya untuk pengalaman cepat tanpa login."}
                  </p>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-noor-gold/20 hover:bg-noor-gold/40 border border-noor-gold/50 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profil
                </button>
              </div>
              <span className="inline-block px-3 py-1 bg-noor-gold/20 border border-noor-gold/40 rounded-full text-xs font-bold text-noor-gold">
                Premium Member
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Form */}
        <div className="md:col-span-2 space-y-6">
          


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
          {/* Google Sync Card */}
          <div className="bg-white border border-noor-divider rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-noor-dark flex items-center gap-2 mb-4 border-b border-noor-divider/50 pb-3">
              <RefreshCw className="w-5 h-5 text-noor-gold" />
              Sinkronisasi Akun
            </h3>
            {user?.isGuest ? (
              <div className="text-center py-2">
                <p className="text-xs text-noor-textSecondary leading-relaxed mb-4">
                  Anda saat ini menggunakan profil lokal. Hubungkan akun Anda untuk mencadangkan bookmark, catatan, dan kemajuan ibadah ke Google Cloud.
                </p>
                <button
                  onClick={handleGoogleSync}
                  disabled={isSyncing}
                  className="w-full py-2.5 bg-white border border-noor-divider text-noor-dark font-bold text-xs rounded-xl hover:bg-noor-gold/10 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.1A13.25 13.25 0 0 0 12.24 0C5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.19-1.925H12.24z"/>
                  </svg>
                  <span>Hubungkan dengan Google</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl p-3 mb-4 text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Tersinkronisasi dengan Google</span>
                </div>
                <p className="text-[10px] text-noor-textSecondary mb-4">
                  Akun: <strong>{user?.email}</strong>
                </p>
                <button
                  onClick={handleDisconnectSync}
                  className="w-full py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
                >
                  Putus Sinkronisasi
                </button>
              </div>
            )}
          </div>

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
            <a 
              href="https://wa.me/6282289354012"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-noor-dark text-white rounded-lg text-xs font-bold shadow-md hover:bg-noor-gold transition-colors inline-block mt-4"
            >
              Hubungi Dukungan
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
