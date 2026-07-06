import { useState, useEffect } from "react";
import { Bell, Volume2, VolumeX, ArrowLeft, Save, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PRAYERS = [
  { key: "Fajr", label: "Subuh" },
  { key: "Dhuhr", label: "Dzuhur" },
  { key: "Asr", label: "Ashar" },
  { key: "Maghrib", label: "Maghrib" },
  { key: "Isha", label: "Isya" }
];

const AZAN_SOUNDS = [
  { id: "makkah", label: "Azan Makkah" },
  { id: "madinah", label: "Azan Madinah" },
  { id: "al-aqsa", label: "Azan Al-Aqsa" },
  { id: "indonesia", label: "Azan Nusantara" },
  { id: "beep", label: "Beep Standar" },
];

function AzanSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("noor_azan_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use defaults
      }
    }
    return {
      globalMute: false,
      volume: 80,
      sound: "makkah",
      preAlarmMins: 10,
      prayers: {
        Fajr: true,
        Dhuhr: true,
        Asr: true,
        Maghrib: true,
        Isha: true,
      }
    };
  });

  const [previewing, setPreviewing] = useState(false);

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem("noor_azan_settings", JSON.stringify(settings));
  }, [settings]);

  const handleTogglePrayer = (key) => {
    setSettings(prev => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [key]: !prev.prayers[key]
      }
    }));
  };

  const playPreview = () => {
    setPreviewing(true);
    // Dummy audio implementation for now
    toast.success(`Memutar Pratinjau ${AZAN_SOUNDS.find(s => s.id === settings.sound).label}...`);
    setTimeout(() => {
      setPreviewing(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/prayer" className="p-2 rounded-xl bg-white border border-noor-divider shadow-sm hover:bg-noor-gold/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-noor-dark" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-noor-dark flex items-center gap-2">
            <Bell className="w-6 h-6 text-noor-gold" />
            Pengaturan Azan
          </h2>
          <p className="text-sm text-noor-textSecondary font-medium">Atur notifikasi dan suara alarm sholat</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Global Settings */}
        <div className="bg-white border border-noor-divider shadow-noor-sm rounded-xl p-5">
          <h3 className="font-bold text-noor-dark mb-4 border-b border-noor-divider pb-2">Pengaturan Umum</h3>
          
          {/* Sound Selection */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-noor-textSecondary mb-2">Suara Azan</label>
            <div className="flex gap-2">
              <select 
                className="flex-1 bg-noor-card border border-noor-divider rounded-lg px-3 py-2 text-sm font-semibold text-noor-dark focus:outline-none focus:border-noor-gold"
                value={settings.sound}
                onChange={(e) => setSettings({...settings, sound: e.target.value})}
              >
                {AZAN_SOUNDS.map(sound => (
                  <option key={sound.id} value={sound.id}>{sound.label}</option>
                ))}
              </select>
              <button 
                onClick={playPreview}
                disabled={previewing}
                className="px-4 py-2 bg-noor-gold/15 text-noor-dark rounded-lg font-bold text-sm hover:bg-noor-gold hover:text-white transition-colors disabled:opacity-50"
              >
                {previewing ? "Playing..." : "Test"}
              </button>
            </div>
          </div>

          {/* Volume */}
          <div className="mb-5">
             <label className="block text-sm font-bold text-noor-textSecondary mb-2 flex items-center justify-between">
               <span>Volume Notifikasi</span>
               <span>{settings.volume}%</span>
             </label>
             <input 
               type="range" 
               min="0" max="100" 
               value={settings.volume}
               onChange={(e) => setSettings({...settings, volume: parseInt(e.target.value)})}
               className="w-full accent-noor-gold h-1.5 bg-noor-divider rounded-lg appearance-none cursor-pointer"
             />
          </div>

          {/* Pre-alarm */}
          <div>
            <label className="block text-sm font-bold text-noor-textSecondary mb-2">Pengingat Sebelum Waktu Sholat</label>
            <select 
              className="w-full bg-noor-card border border-noor-divider rounded-lg px-3 py-2 text-sm font-semibold text-noor-dark focus:outline-none focus:border-noor-gold"
              value={settings.preAlarmMins}
              onChange={(e) => setSettings({...settings, preAlarmMins: parseInt(e.target.value)})}
            >
              <option value="0">Tepat Waktu (0 Menit)</option>
              <option value="5">5 Menit Sebelum</option>
              <option value="10">10 Menit Sebelum</option>
              <option value="15">15 Menit Sebelum</option>
              <option value="30">30 Menit Sebelum</option>
            </select>
          </div>
        </div>

        {/* Toggle Per Prayer */}
        <div className="bg-white border border-noor-divider shadow-noor-sm rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-noor-divider pb-2">
             <h3 className="font-bold text-noor-dark">Notifikasi Per Waktu Sholat</h3>
             <button 
               onClick={() => setSettings({...settings, globalMute: !settings.globalMute})}
               className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${settings.globalMute ? 'bg-red-100 text-red-600' : 'bg-noor-gold/15 text-noor-dark'}`}
             >
               {settings.globalMute ? <><VolumeX className="w-3 h-3" /> Bisukan Semua</> : <><Volume2 className="w-3 h-3" /> Bunyikan Semua</>}
             </button>
          </div>

          <div className="space-y-3">
            {PRAYERS.map(pr => (
              <div key={pr.key} className={`flex items-center justify-between p-3 rounded-lg border ${settings.prayers[pr.key] && !settings.globalMute ? 'bg-noor-gold/5 border-noor-gold/30' : 'bg-noor-card border-noor-divider/50 opacity-75'}`}>
                <span className="font-bold text-noor-dark">{pr.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.prayers[pr.key] && !settings.globalMute}
                    onChange={() => handleTogglePrayer(pr.key)}
                    disabled={settings.globalMute}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-noor-gold"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save/Info */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p>Pengaturan otomatis disimpan ke perangkat ini. Pastikan tab browser tetap terbuka untuk menerima notifikasi.</p>
        </div>

      </div>
    </div>
  );
}

export default AzanSettings;
