import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Play, Pause, Heart, BookOpen, Volume2, Sparkles, Compass } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { useAudio } from "../context/AudioContext";
import Loader from "../components/Common/Loader";

// Static mapping of the 30 Juz starting locations
const JUZ_MAPPING = [
  { juz: 1, surahNomor: 1, surahNama: "Al-Fatihah", ayat: 1, description: "QS. Al-Fatihah 1 - QS. Al-Baqarah 141" },
  { juz: 2, surahNomor: 2, surahNama: "Al-Baqarah", ayat: 142, description: "QS. Al-Baqarah 142 - QS. Al-Baqarah 252" },
  { juz: 3, surahNomor: 2, surahNama: "Al-Baqarah", ayat: 253, description: "QS. Al-Baqarah 253 - QS. Ali 'Imran 92" },
  { juz: 4, surahNomor: 3, surahNama: "Ali 'Imran", ayat: 93, description: "QS. Ali 'Imran 93 - QS. An-Nisa 23" },
  { juz: 5, surahNomor: 4, surahNama: "An-Nisa", ayat: 24, description: "QS. An-Nisa 24 - QS. An-Nisa 147" },
  { juz: 6, surahNomor: 4, surahNama: "An-Nisa", ayat: 148, description: "QS. An-Nisa 148 - QS. Al-Ma'idah 81" },
  { juz: 7, surahNomor: 5, surahNama: "Al-Ma'idah", ayat: 82, description: "QS. Al-Ma'idah 82 - QS. Al-An'am 110" },
  { juz: 8, surahNomor: 6, surahNama: "Al-An'am", ayat: 111, description: "QS. Al-An'am 111 - QS. Al-A'raf 87" },
  { juz: 9, surahNomor: 7, surahNama: "Al-A'raf", ayat: 88, description: "QS. Al-A'raf 88 - QS. Al-Anfal 40" },
  { juz: 10, surahNomor: 8, surahNama: "Al-Anfal", ayat: 41, description: "QS. Al-Anfal 41 - QS. At-Tawbah 92" },
  { juz: 11, surahNomor: 9, surahNama: "At-Tawbah", ayat: 93, description: "QS. At-Tawbah 93 - QS. Hud 5" },
  { juz: 12, surahNomor: 11, surahNama: "Hud", ayat: 6, description: "QS. Hud 6 - QS. Yusuf 52" },
  { juz: 13, surahNomor: 12, surahNama: "Yusuf", ayat: 53, description: "QS. Yusuf 53 - QS. Ibrahim 52" },
  { juz: 14, surahNomor: 15, surahNama: "Al-Hijr", ayat: 1, description: "QS. Al-Hijr 1 - QS. An-Nahl 128" },
  { juz: 15, surahNomor: 17, surahNama: "Al-Isra'", ayat: 1, description: "QS. Al-Isra' 1 - QS. Al-Kahf 74" },
  { juz: 16, surahNomor: 18, surahNama: "Al-Kahf", ayat: 75, description: "QS. Al-Kahf 75 - QS. Ta Ha 135" },
  { juz: 17, surahNomor: 21, surahNama: "Al-Anbiya'", ayat: 1, description: "QS. Al-Anbiya' 1 - QS. Al-Hajj 78" },
  { juz: 18, surahNomor: 23, surahNama: "Al-Mu'minun", ayat: 1, description: "QS. Al-Mu'minun 1 - QS. Al-Furqan 20" },
  { juz: 19, surahNomor: 25, surahNama: "Al-Furqan", ayat: 21, description: "QS. Al-Furqan 21 - QS. An-Naml 55" },
  { juz: 20, surahNomor: 27, surahNama: "An-Naml", ayat: 56, description: "QS. An-Naml 56 - QS. Al-'Ankabut 45" },
  { juz: 21, surahNomor: 29, surahNama: "Al-'Ankabut", ayat: 46, description: "QS. Al-'Ankabut 46 - QS. Luqman 21" },
  { juz: 22, surahNomor: 33, surahNama: "Al-Ahzab", ayat: 31, description: "QS. Al-Ahzab 31 - QS. Yasin 27" },
  { juz: 23, surahNomor: 36, surahNama: "Yasin", ayat: 28, description: "QS. Yasin 28 - QS. Az-Zumar 31" },
  { juz: 24, surahNomor: 39, surahNama: "Az-Zumar", ayat: 32, description: "QS. Az-Zumar 32 - QS. Fushshilat 46" },
  { juz: 25, surahNomor: 41, surahNama: "Fushshilat", ayat: 47, description: "QS. Fushshilat 47 - QS. Al-Jatsiyah 37" },
  { juz: 26, surahNomor: 46, surahNama: "Al-Ahqaf", ayat: 1, description: "QS. Al-Ahqaf 1 - QS. Adz-Dzariyat 30" },
  { juz: 27, surahNomor: 51, surahNama: "Adz-Dzariyat", ayat: 31, description: "QS. Adz-Dzariyat 31 - QS. Al-Hadid 29" },
  { juz: 28, surahNomor: 58, surahNama: "Al-Mujadilah", ayat: 1, description: "QS. Al-Mujadilah 1 - QS. At-Tahrim 12" },
  { juz: 29, surahNomor: 67, surahNama: "Al-Mulk", ayat: 1, description: "QS. Al-Mulk 1 - QS. Al-Mursalat 50" },
  { juz: 30, surahNomor: 78, surahNama: "An-Naba'", ayat: 1, description: "QS. An-Naba' 1 - QS. An-Nas 6 (Juz 'Amma)" }
];

function QuranIndex() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("semua"); // semua, makkiyah, madaniyah, juz

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
        console.error("Gagal mengambil data katalog surah:", err);
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

  const filteredJuz = JUZ_MAPPING.filter((j) => {
    return (
      j.juz.toString() === search.trim() ||
      j.surahNama.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
  };

  if (loading) {
    return <Loader label="Memuat Al-Qur'an..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Catalog Banner */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-8 border border-noor-gold/25 shadow-noor-heavy relative overflow-hidden">
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
          Dapatkan kemudahan membaca per Surah atau per Juz. Nikmati murottal audio jernih dan terjemahan resmi bahasa Indonesia.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex bg-noor-card p-1 rounded-xl border border-noor-divider w-full md:w-auto shadow-noor-sm overflow-x-auto scrollbar-none">
          {[
            { id: "semua", label: "Semua Surah" },
            { id: "makkiyah", label: "Makkiyah" },
            { id: "madaniyah", label: "Madaniyah" },
            { id: "juz", label: "Pembagian Juz" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch(""); // Clear search when switching tabs
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
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
            placeholder={
              activeTab === "juz"
                ? "Cari nomor juz atau surah (contoh: 30)..."
                : "Cari surah (contoh: Yasin)..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-noor-card border border-noor-divider rounded-xl focus:outline-none focus:border-noor-gold font-medium text-sm text-noor-dark placeholder-[#7A5845]/40 shadow-noor-sm transition-all"
          />
        </div>
      </div>

      {/* CONDITIONAL RENDER: JUZ DIVISION vs SURAH LIST */}
      {activeTab === "juz" ? (
        filteredJuz.length === 0 ? (
          <div className="text-center py-16 bg-noor-card border border-noor-divider rounded-noor shadow-noor-warm">
            <p className="text-[#7A5845]/60 font-semibold italic text-sm">Juz tidak ditemukan</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredJuz.map((j) => (
              <motion.div
                key={j.juz}
                variants={itemVariants}
                className="bg-noor-card border border-noor-divider hover:border-noor-gold rounded-noor p-5 flex flex-col justify-between hover:shadow-noor-warm transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="relative w-10 h-10 flex items-center justify-center font-bold text-noor-light text-sm bg-noor-gold/10 rounded-xl border border-noor-gold/20">
                      {j.juz}
                    </div>
                    <span className="text-[10px] bg-noor-gold/15 text-noor-light px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      JUZ
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-noor-dark group-hover:text-noor-light mt-2 transition-colors">
                    Juz Ke-{j.juz}
                  </h3>
                  <p className="text-xs text-[#7A5845] mt-1 font-semibold">
                    Mulai Dari: <span className="text-noor-light">QS. {j.surahNama} ayat {j.ayat}</span>
                  </p>
                  <p className="text-[10px] text-[#7A5845]/50 mt-1.5 font-medium leading-relaxed">
                    Rentang: {j.description}
                  </p>
                </div>

                <div className="border-t border-noor-divider/60 my-3 pt-3">
                  <Link
                    to={`/surat/${j.surahNomor}`}
                    className="w-full py-2 bg-[#2C0F12] hover:bg-[#6B1E23] text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Mulai Membaca Juz</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      ) : (
        /* SURAH RENDER */
        filteredSurahs.length === 0 ? (
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
                  <div className="flex justify-between items-start mb-3">
                    <div className="relative w-10 h-10 flex items-center justify-center font-bold text-noor-light text-sm bg-noor-gold/10 rounded-xl border border-noor-gold/20">
                      {surah.nomor}
                    </div>

                    <h3 className="text-2xl font-bold font-arabic text-noor-dark group-hover:text-noor-light transition-colors">
                      {surah.nama}
                    </h3>
                  </div>

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

                  <div className="border-t border-noor-divider/60 my-2"></div>

                  <div className="flex items-center justify-between mt-2 pt-1 gap-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/surat/${surah.nomor}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#2C0F12] text-[#F6EFE4] rounded-xl text-xs font-bold hover:bg-[#6B1E23] transition-all hover:scale-105 shadow-sm"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Baca</span>
                      </Link>

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
        )
      )}
    </div>
  );
}

export default QuranIndex;
