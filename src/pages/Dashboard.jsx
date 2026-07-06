import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Compass, Heart, ArrowRight, BookMarked, Sparkles } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import Header from "../components/Layout/Header";
import PrayerPanel from "../components/PrayerTimes/PrayerPanel";
import TasbihPanel from "../components/Tasbih/TasbihPanel";

const INSPIRATIONAL_VERSES = [
  {
    ref: "QS. Ar-Ra'd: 28",
    arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    translation: "Ingatlah, hanya dengan mengingati Allah hati menjadi tenteram."
  },
  {
    ref: "QS. Al-Baqarah: 186",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    translation: "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat."
  },
  {
    ref: "QS. Al-Insyirah: 6",
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Sesungguhnya beserta kesulitan itu ada kemudahan."
  },
  {
    ref: "QS. Al-Baqarah: 152",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "Maka ingatlah kamu kepada-Ku niscaya Aku ingat (pula) kepadamu."
  },
  {
    ref: "QS. Taha: 14",
    arabic: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
    translation: "Dan dirikanlah shalat untuk mengingat Aku."
  }
];

function Dashboard() {
  const { lastRead, favorites } = useAppSettings();
  const [verseOfTheDay, setVerseOfTheDay] = useState(INSPIRATIONAL_VERSES[0]);

  useEffect(() => {
    // Select verse based on day of month to keep it stable per day
    const day = new Date().getDate();
    const index = day % INSPIRATIONAL_VERSES.length;
    setVerseOfTheDay(INSPIRATIONAL_VERSES[index]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Time & Greetings Header */}
      <Header />

      {/* Grid: Welcome & Last Read */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Inspirational Verse panel */}
        <div className="md:col-span-2 bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 border border-noor-gold/25 shadow-noor-heavy flex flex-col justify-between relative overflow-hidden">
          {/* Subtle star octagram bg */}
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 opacity-[0.05] text-noor-gold pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,0 60,35 95,35 65,55 75,90 50,70 25,90 35,55 5,35 40,35" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-noor-gold mb-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Ayat Pilihan Hari Ini</span>
            </div>
            <p className="font-arabic text-right text-2xl md:text-3xl leading-relaxed text-[#F6EFE4] mb-3 select-all">
              {verseOfTheDay.arabic}
            </p>
            <p className="text-sm font-medium text-[#E8D8BF] italic select-text">
              "{verseOfTheDay.translation}"
            </p>
          </div>
          <span className="text-[10px] font-bold text-noor-gold tracking-widest mt-4 uppercase text-right block">
            {verseOfTheDay.ref}
          </span>
        </div>

        {/* Continue Reading (Last Read) Widget */}
        <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-noor-divider/60">
            <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base">
              <BookMarked className="w-5 h-5 text-noor-gold" />
              Terakhir Dibaca
            </h3>
          </div>

          {lastRead ? (
            <div className="my-4 flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-noor-gold uppercase tracking-wider">Surah & Ayat</span>
              <h4 className="text-xl font-extrabold text-noor-dark mt-0.5">
                {lastRead.namaSurah}
              </h4>
              <p className="text-xs text-[#7A5845] font-semibold mt-1">
                Ayat Ke-{lastRead.nomorAyat}
              </p>
              <p className="text-[9px] text-[#7A5845]/40 mt-2 font-mono">
                Dibaca pada: {new Date(lastRead.timestamp).toLocaleDateString("id-ID")}
              </p>
            </div>
          ) : (
            <div className="my-4 flex-1 flex flex-col justify-center">
              <p className="text-xs text-[#7A5845]/60 italic font-semibold">
                Belum ada riwayat bacaan.
              </p>
              <p className="text-[11px] text-[#7A5845]/50 mt-1">
                Mulailah membaca Al-Qur'an dan tandai ayat terakhir untuk melanjutkan.
              </p>
            </div>
          )}

          <Link
            to={lastRead ? `/surat/${lastRead.surahNomor}` : "/quran"}
            className="w-full py-2.5 bg-[#2C0F12] hover:bg-[#6B1E23] text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm mt-auto"
          >
            <span>{lastRead ? "Lanjutkan Membaca" : "Buka Al-Qur'an"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Grid: Prayer Times Widget & Tasbih Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Prayer Panel */}
        <div>
          <PrayerPanel />
        </div>

        {/* Tasbih Panel */}
        <div className="h-[430px] md:h-auto">
          <TasbihPanel />
        </div>

      </div>

      {/* Quick Shelf: Favorite Surahs */}
      {favorites.length > 0 && (
        <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6">
          <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base border-b border-noor-divider pb-3 mb-4">
            <Heart className="w-5 h-5 text-noor-gold fill-current" />
            Akses Cepat Surah Favorit
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favorites.slice(0, 4).map((surah) => (
              <Link
                key={surah.nomor}
                to={`/surat/${surah.nomor}`}
                className="bg-white hover:bg-noor-gold/10 border border-noor-divider hover:border-noor-gold p-4 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-sm"
              >
                <div>
                  <span className="text-[10px] text-noor-gold font-bold">QS. {surah.nomor}</span>
                  <h4 className="text-sm font-bold text-noor-dark mt-0.5">{surah.namaLatin}</h4>
                  <p className="text-[10px] text-noor-textSecondary/70 italic mt-0.5">{surah.arti}</p>
                </div>
                <span className="text-[10px] font-bold text-noor-light mt-4 flex items-center gap-1">
                  Baca <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ChevronRight = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default Dashboard;