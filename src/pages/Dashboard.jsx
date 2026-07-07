import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Compass,
  Sparkles,
  Bookmark,
  Heart,
  BarChart3,
  User,
  ArrowRight,
  BookMarked,
  Activity,
  ChevronRight,
  History,
  MapPin,
  Bell
} from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { useActivity } from "../context/ActivityContext";
import Header from "../components/Layout/Header";
import PrayerPanel from "../components/PrayerTimes/PrayerPanel";
import TasbihPanel from "../components/Tasbih/TasbihPanel";
import ReflectionPanel from "../components/widgets/ReflectionPanel";
import WorshipProgress from "../components/widgets/WorshipProgress";

const INSPIRATIONAL_VERSES = [
  { ref: "QS. Ar-Ra'd: 28", arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُw ٱلْقُلُوبُ", translation: "Ingatlah, hanya dengan mengingati Allah hati menjadi tenteram." },
  { ref: "QS. Al-Baqarah: 186", arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", translation: "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat." },
  { ref: "QS. Al-Insyirah: 6", arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Sesungguhnya beserta kesulitan itu ada kemudahan." },
  { ref: "QS. Al-Baqarah: 152", arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", translation: "Maka ingatlah kamu kepada-Ku niscaya Aku ingat (pula) kepadamu." },
  { ref: "QS. Taha: 14", arabic: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي", translation: "Dan dirikanlah shalat untuk mengingat Aku." }
];

const POPULAR_SURAHS = [
  { nomor: 18, nama: "Al-Kahfi", arti: "Goa", ayat: 110 },
  { nomor: 36, nama: "Yasin", arti: "Ya Sin", ayat: 83 },
  { nomor: 55, nama: "Ar-Rahman", arti: "Yang Maha Pemurah", ayat: 78 },
  { nomor: 56, nama: "Al-Waqi'ah", arti: "Hari Kiamat", ayat: 96 },
  { nomor: 67, nama: "Al-Mulk", arti: "Kerajaan", ayat: 30 }
];

const QUICK_LINKS = [
  { path: "/qibla", label: "Arah Kiblat", icon: MapPin, bg: "bg-[#2C0F12]/5 hover:bg-[#2C0F12]/10" },
  { path: "/azan-settings", label: "Azan & Alarm", icon: Bell, bg: "bg-[#B58A44]/10 hover:bg-[#B58A44]/15" },
  { path: "/prayer", label: "Kalender Hijriah", icon: Clock, bg: "bg-green-600/5 hover:bg-green-600/10" },
  { path: "/dua", label: "Doa Harian", icon: Sparkles, bg: "bg-purple-600/5 hover:bg-purple-600/10" },
  { path: "/bookmark", label: "Bookmark", icon: Bookmark, bg: "bg-orange-600/5 hover:bg-orange-600/10" },
  { path: "/progress", label: "Progress", icon: BarChart3, bg: "bg-blue-600/5 hover:bg-blue-600/10" }
];

function Dashboard() {
  const { lastRead } = useAppSettings();
  const { activities: allActivities } = useActivity();
  const [verse, setVerse] = useState(INSPIRATIONAL_VERSES[0]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Select stable daily verse based on LocalStorage date
    const todayStr = new Date().toISOString().split("T")[0];
    let savedVerse = JSON.parse(localStorage.getItem("noor-daily-verse"));
    
    if (!savedVerse || savedVerse.date !== todayStr) {
      const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
      savedVerse = { date: todayStr, index: randomIndex };
      localStorage.setItem("noor-daily-verse", JSON.stringify(savedVerse));
    }
    
    setVerse(INSPIRATIONAL_VERSES[savedVerse.index]);

    // Load recent activities
    const loadActivities = () => {
      const recent = [];
      
      // 1. Check last read
      if (lastRead) {
        recent.push({
          type: "quran",
          title: `Terakhir Dibaca`,
          description: `QS. ${lastRead.namaSurah} ayat ${lastRead.nomorAyat}`,
          timestamp: lastRead.timestamp
        });
      }

      // 2. Load from ActivityContext
      allActivities.forEach(act => recent.push(act));

      // Sort by timestamp desc and limit to top 4
      recent.sort((a, b) => b.timestamp - a.timestamp);
      
      // Remove exact duplicates (sometimes lastRead overlaps with recent quran activity)
      const uniqueRecent = recent.filter((act, index, self) =>
        index === self.findIndex((t) => (
          t.title === act.title && t.description === act.description
        ))
      );
      
      setActivities(uniqueRecent.slice(0, 4));
    };

    loadActivities();
  }, [lastRead, allActivities]);

  return (
    <div className="space-y-6">
      
      {/* Time & Calendar Header */}
      <Header />

      {/* Row 1: Verse of the Day + Last Read */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Verse + Launcher Panel */}
        <div className="md:col-span-2 bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-5 border border-noor-gold/25 shadow-noor-heavy flex flex-col justify-between relative overflow-hidden">
          {/* Subtle star motif overlay */}
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 opacity-[0.05] text-noor-gold pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,0 60,35 95,35 65,55 75,90 50,70 25,90 35,55 5,35 40,35" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-noor-gold mb-3">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Ayat Harian</span>
            </div>
            
            <p className="font-arabic text-right text-2xl md:text-3xl leading-relaxed text-[#F6EFE4] mb-3">
              {verse.arabic}
            </p>
            <p className="text-xs md:text-sm font-medium text-[#E8D8BF] italic">
              "{verse.translation}"
            </p>
            <span className="text-[9px] font-bold text-noor-gold tracking-widest mt-2 uppercase text-right block">
              {verse.ref}
            </span>
          </div>

          {/* Quick Access Grid Launcher */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <h4 className="text-[10px] font-bold tracking-wider text-[#E8D8BF]/60 uppercase mb-3">Menu Utama</h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <RouterLink
                    key={link.path}
                    to={link.path}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center transition-all bg-white/5 hover:bg-white/10 border border-white/5`}
                  >
                    <Icon className="w-4.5 h-4.5 text-noor-gold mb-1" />
                    <span className="text-[9px] font-semibold tracking-wide text-[#F6EFE4] whitespace-nowrap">{link.label}</span>
                  </RouterLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Reading (Last Read) Card */}
        <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-noor-divider/60">
            <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base">
              <BookMarked className="w-5 h-5 text-noor-gold" />
              Terakhir Dibaca
            </h3>
          </div>

          {lastRead ? (
            <div className="my-4 flex-1 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-noor-gold uppercase tracking-wider">Surah & Ayat</span>
              <h4 className="text-lg font-extrabold text-noor-dark mt-0.5">
                {lastRead.namaSurah}
              </h4>
              <p className="text-xs text-[#7A5845] font-semibold mt-1">
                Ayat Ke-{lastRead.nomorAyat}
              </p>
              <p className="text-[9px] text-[#7A5845]/40 mt-3 font-mono">
                Dibaca pada: {new Date(lastRead.timestamp).toLocaleDateString("id-ID")}
              </p>
            </div>
          ) : (
            <div className="my-4 flex-1 flex flex-col justify-center text-center py-6">
              <p className="text-xs text-[#7A5845]/60 italic font-semibold">
                Belum ada riwayat bacaan.
              </p>
              <p className="text-[10px] text-[#7A5845]/50 mt-1 max-w-xs mx-auto">
                Buka Al-Qur'an dan klik tanda buku pada ayat untuk menandai bacaan terakhir Anda.
              </p>
            </div>
          )}

          <RouterLink
            to={lastRead ? `/surat/${lastRead.surahNomor}` : "/quran"}
            className="w-full py-2.5 bg-[#2C0F12] hover:bg-[#6B1E23] text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm mt-auto"
          >
            <span>{lastRead ? "Lanjutkan Membaca" : "Buka Al-Qur'an"}</span>
            <ArrowRight className="w-4 h-4" />
          </RouterLink>
        </div>

      </div>

      {/* Row 2: 3-Column Core Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <PrayerPanel />
        </div>
        <div className="h-[430px] md:h-auto overflow-y-auto scrollbar-thin">
          <TasbihPanel />
        </div>
        <div>
          <WorshipProgress />
        </div>
      </div>

      {/* Row 3: Reflection Mode + Timeline and Popular Surahs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reflection Mode panel */}
        <div className="md:col-span-2">
          <ReflectionPanel />
        </div>

        {/* Recent Activities & Popular Surahs Container */}
        <div className="space-y-6">
          
          {/* Recent Activity Timeline */}
          <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-5">
            <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm border-b border-noor-divider pb-3 mb-4">
              <Activity className="w-4.5 h-4.5 text-noor-gold" />
              Aktivitas Terakhir
            </h3>

            {activities.length === 0 ? (
              <p className="text-xs text-[#7A5845]/50 italic text-center py-6">Belum ada aktivitas terdeteksi.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-noor-divider/70">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-3 items-start relative pl-6">
                    {/* Bullet marker */}
                    <div className="absolute left-[5px] top-1.5 w-2 h-2 rounded-full bg-noor-gold border border-white"></div>
                    <div>
                      <h4 className="text-xs font-bold text-noor-dark">{act.title}</h4>
                      <p className="text-[11px] text-noor-textSecondary mt-0.5">{act.description}</p>
                      <span className="text-[9px] text-noor-textSecondary/40 font-mono mt-1 block">
                        {new Date(act.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Surahs shelf */}
          <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-5">
            <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm border-b border-noor-divider pb-3 mb-4">
              <Sparkles className="w-4.5 h-4.5 text-noor-gold" />
              Surah Populer
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
              {POPULAR_SURAHS.map((surah) => (
                <RouterLink
                  key={surah.nomor}
                  to={`/surat/${surah.nomor}`}
                  className="w-full bg-white hover:bg-noor-gold/10 border border-noor-divider/50 hover:border-noor-gold p-3 rounded-xl flex items-center justify-between transition-all duration-200 group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-noor-dark group-hover:text-noor-light transition-colors">
                      {surah.nama}
                    </h4>
                    <p className="text-[10px] text-noor-textSecondary italic mt-0.5">{surah.arti} • {surah.ayat} ayat</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-noor-gold/60 group-hover:text-noor-light transition-colors" />
                </RouterLink>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;