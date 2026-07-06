import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Play, Pause, Heart, BookOpen, Volume2, Sparkles } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { useAudio } from "../context/AudioContext";
import Loader from "../components/Common/Loader";

function QuranIndex() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("semua"); // semua, makkiyah, madaniyah

  const { toggleFavoriteSurah, isSurahFavorite } = useAppSettings();
  const { playSurahAudio, togglePlay, activeSurah, isPlaying } = useAudio();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await axios.get("https://equran.id/api/v2/surat");
        if (res.data?.data) {
          setSurahs(res.data.data);
        }
      } catch (err) {
        console.error("Gagal memuat daftar surah:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      surah.arti.toLowerCase().includes(search.toLowerCase()) ||
      surah.nomor.toString() === search.trim();
    
    if (activeTab === "semua") return matchesSearch;
    if (activeTab === "makkiyah") return matchesSearch && surah.tempatTurun.toLowerCase() === "mekah";
    if (activeTab === "madaniyah") return matchesSearch && surah.tempatTurun.toLowerCase() === "madinah";
    return matchesSearch;
  });

  // Stagger animations container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  // Card items animations
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
  };

  if (loading) {
    return <Loader label="Memuat Al-Qur'an..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-8 border border-noor-gold/20 shadow-noor-heavy relative overflow-hidden">
        {/* Decorative gold vector */}
        <div className="absolute right-[-30px] top-[-30px] w-48 h-48 opacity-[0.08] text-noor-gold pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
          </svg>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-noor-gold animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-noor-gold">Katalog Al-Qur'an Digital</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans">
          Membaca & Mendengar Al-Qur'an
        </h2>
        <p className="text-[#E8D8BF]/70 text-xs md:text-sm mt-1 max-w-xl font-medium">
          Dapatkan kemudahan mentadabburi firman Allah SWT. Dilengkapi dengan audio berkualitas tinggi dari qari terkemuka dan terjemahan resmi bahasa Indonesia.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex bg-noor-card p-1 rounded-xl border border-noor-divider w-full md:w-auto shadow-noor-sm">
          {[
            { id: "semua", label: "Semua Surah" },
            { id: "makkiyah", label: "Makkiyah" },
            { id: "madaniyah", label: "Madaniyah" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-noor-light text-[#F6EFE4] shadow-sm"
                  : "text-noor-textSecondary hover:text-noor-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-[350px]">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-[#7A5845]/40" />
          <input
            type="text"
            placeholder="Cari surah (contoh: Al-Mulk)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-noor-card border border-noor-divider rounded-xl focus:outline-none focus:border-noor-gold font-medium text-sm text-noor-dark placeholder-[#7A5845]/40 shadow-noor-sm transition-all"
          />
        </div>
      </div>

      {/* Grid of Surah Cards */}
      {filteredSurahs.length === 0 ? (
        <div className="text-center py-16 bg-noor-card border border-noor-divider rounded-noor shadow-noor-warm">
          <p className="text-[#7A5845]/60 font-semibold italic text-sm">Surah tidak ditemukan</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredSurahs.map((surah) => {
            const isFav = isSurahFavorite(surah.nomor);
            const isCurrentSurah = activeSurah?.nomor === surah.nomor;
            const playingThis = isCurrentSurah && isPlaying;

            return (
              <motion.div
                key={surah.nomor}
                variants={itemVariants}
                className="bg-noor-card border border-noor-divider hover:border-noor-gold rounded-noor p-5 flex flex-col justify-between hover:shadow-noor-warm transition-all duration-300 group"
              >
                {/* Upper row: Number & Favorite Icon & Arabic text */}
                <div className="flex justify-between items-start mb-3">
                  {/* Number Badge with Star Octagram frame */}
                  <div className="relative w-10 h-10 flex items-center justify-center font-bold text-noor-light text-sm bg-noor-gold/10 rounded-xl border border-noor-gold/20">
                    {surah.nomor}
                  </div>

                  {/* Arabic name */}
                  <h3 className="text-2xl font-bold font-arabic text-noor-dark group-hover:text-noor-light transition-colors">
                    {surah.nama}
                  </h3>
                </div>

                {/* Surah details */}
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-noor-dark group-hover:text-noor-light transition-colors">
                    {surah.namaLatin}
                  </h4>
                  <p className="text-xs text-noor-textSecondary mt-0.5 font-medium italic">
                    {surah.arti}
                  </p>
                  <p className="text-[11px] font-bold text-noor-textSecondary/70 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                    <span>{surah.jumlahAyat} Ayat</span>
                    <span>•</span>
                    <span>{surah.tempatTurun}</span>
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-noor-divider/60 my-2"></div>

                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between mt-2 pt-1 gap-2">
                  <div className="flex gap-2">
                    {/* Read Button */}
                    <Link
                      to={`/surat/${surah.nomor}`}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#2C0F12] text-[#F6EFE4] rounded-xl text-xs font-bold hover:bg-[#6B1E23] transition-all hover:scale-105 shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Baca</span>
                    </Link>

                    {/* Quick Play Audio Button */}
                    <button
                      onClick={() => {
                        if (isCurrentSurah) {
                          togglePlay();
                        } else {
                          playSurahAudio(surah);
                        }
                      }}
                      className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-200 hover:scale-105 ${
                        playingThis
                          ? "bg-noor-gold text-[#F6EFE4] border-noor-gold shadow-sm"
                          : "bg-white text-noor-light border-noor-divider hover:border-noor-gold"
                      }`}
                      title={playingThis ? "Pause Audio" : "Putar Audio"}
                    >
                      {playingThis ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleFavoriteSurah(surah)}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isFav
                        ? "text-red-600 bg-red-50"
                        : "text-[#7A5845]/50 bg-white hover:text-red-500 border border-noor-divider hover:border-red-200"
                    }`}
                    title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

export default QuranIndex;
