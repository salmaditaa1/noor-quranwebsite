import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Bookmark, BookOpen, Trash2, ArrowRight, Play, ExternalLink } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { useAudio } from "../context/AudioContext";
import toast from "react-hot-toast";

function Favorit() {
  const { favorites, toggleFavoriteSurah, bookmarkedVerses, toggleBookmarkVerse } = useAppSettings();
  const { playSurahAudio, togglePlay, activeSurah, isPlaying } = useAudio();
  const [activeTab, setActiveTab] = useState("surah"); // surah, ayat

  const ayatBookmarks = bookmarkedVerses.filter(item => item.surahNomor !== "dua");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-8 border border-noor-gold/20 shadow-noor-heavy relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-[0.05] text-noor-gold pointer-events-none">
          <Heart className="w-full h-full fill-current" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans flex items-center gap-3">
          <Heart className="w-8 h-8 text-noor-gold fill-current" />
          Koleksi Favorit & Bookmark
        </h2>
        <p className="text-[#E8D8BF]/70 text-xs md:text-sm mt-1 max-w-xl font-medium">
          Simpan dan kelola halaman bacaan penting Anda di sini. Akses cepat surah-surah favorit Anda serta ayat-ayat tadabbur pilihan kapan saja.
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex bg-noor-card p-1 rounded-xl border border-noor-divider w-full max-w-md mx-auto mb-8 shadow-noor-sm text-center">
        <button
          onClick={() => setActiveTab("surah")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === "surah"
              ? "bg-noor-light text-white shadow-sm"
              : "text-noor-textSecondary hover:text-noor-dark"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Surah Favorit ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ayat")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === "ayat"
              ? "bg-noor-light text-white shadow-sm"
              : "text-noor-textSecondary hover:text-noor-dark"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Ayat Bookmark ({ayatBookmarks.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: SURAH */}
      {activeTab === "surah" && (
        <div>
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-noor-card border border-noor-divider rounded-noor shadow-noor-warm col-span-full text-center px-4">
              <div className="w-20 h-20 bg-noor-gold/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-noor-gold" />
              </div>
              <h3 className="text-xl font-bold text-noor-dark mb-2">Belum Ada Surah Favorit</h3>
              <p className="text-[#7A5845]/70 text-sm max-w-sm mb-6 leading-relaxed">
                Tandai surah yang sering Anda baca atau dengarkan dengan menekan ikon hati pada katalog surah.
              </p>
              <Link to="/quran" className="px-6 py-2.5 bg-noor-gold text-white font-bold rounded-xl hover:bg-[#967135] transition-all shadow-md flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Buka Katalog Al-Qur'an
              </Link>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {favorites.map((surah) => {
                const isCurrentSurah = activeSurah?.nomor === surah.nomor;
                const playingThis = isCurrentSurah && isPlaying;

                return (
                  <motion.div
                    key={surah.nomor}
                    variants={itemVariants}
                    className="bg-noor-card border border-noor-divider hover:border-noor-gold rounded-noor p-5 flex items-center justify-between hover:shadow-noor-warm transition-all duration-300 group"
                  >
                    <div>
                      <span className="text-xs font-bold text-noor-gold">SURAH {surah.nomor}</span>
                      <h3 className="text-lg font-bold text-noor-dark group-hover:text-noor-light mt-0.5 transition-colors">
                        {surah.namaLatin} <span className="font-arabic font-normal ml-1.5">{surah.nama}</span>
                      </h3>
                      <p className="text-xs text-noor-textSecondary mt-0.5 italic">{surah.arti}</p>
                      <p className="text-[10px] text-noor-textSecondary/50 font-bold uppercase mt-1">
                        {surah.jumlahAyat} ayat • {surah.tempatTurun}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (isCurrentSurah) {
                            togglePlay();
                          } else {
                            playSurahAudio(surah);
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 ${
                          playingThis
                            ? "bg-noor-gold text-[#F6EFE4] border-noor-gold shadow-sm"
                            : "bg-white text-noor-light border-noor-divider hover:border-noor-gold"
                        }`}
                      >
                        <Play className={`w-4 h-4 ${playingThis ? "hidden" : "fill-current"}`} />
                        {playingThis && <span className="text-xs font-bold font-sans">Pause</span>}
                      </button>

                      <Link
                        to={`/surat/${surah.nomor}`}
                        className="p-2.5 bg-noor-light hover:bg-[#2C0F12] text-[#F6EFE4] rounded-xl border border-noor-gold/10 flex items-center justify-center transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => toggleFavoriteSurah(surah)}
                        className="p-2.5 bg-white border border-noor-divider/80 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-105"
                        title="Hapus dari Favorit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}

      {/* TAB CONTENT: AYAT */}
      {activeTab === "ayat" && (
        <div>
          {ayatBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-noor-card border border-noor-divider rounded-noor shadow-noor-warm col-span-full text-center px-4">
              <div className="w-20 h-20 bg-noor-gold/10 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-10 h-10 text-noor-gold" />
              </div>
              <h3 className="text-xl font-bold text-noor-dark mb-2">Belum Ada Ayat Ditandai</h3>
              <p className="text-[#7A5845]/70 text-sm max-w-sm mb-6 leading-relaxed">
                Tandai ayat terakhir yang Anda baca atau ayat yang ingin dihafal dengan menekan ikon pita pada halaman baca surah.
              </p>
              <Link to="/quran" className="px-6 py-2.5 bg-noor-gold text-white font-bold rounded-xl hover:bg-[#967135] transition-all shadow-md flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Mulai Membaca
              </Link>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {ayatBookmarks.map((item) => (
                <motion.div
                  key={`${item.surahNomor}-${item.nomorAyat}`}
                  variants={itemVariants}
                  className="bg-noor-card border border-noor-divider rounded-noor p-5 md:p-6 shadow-noor-sm hover:shadow-noor-warm transition-all"
                >
                  <div className="flex justify-between items-start mb-3 border-b border-noor-divider pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-noor-light">
                        QS. {item.surahName} : Ayat {item.nomorAyat}
                      </h4>
                    </div>

                    <div className="flex gap-2">
                      {/* Go to Surah and scroll to verse */}
                      <Link
                        to={`/surat/${item.surahNomor}`}
                        className="px-3 py-1.5 bg-[#2C0F12] hover:bg-[#6B1E23] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ke Surat</span>
                      </Link>

                      {/* Remove Bookmark */}
                      <button
                        onClick={() => toggleBookmarkVerse(item)}
                        className="p-1.5 bg-white border border-noor-divider/80 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <p className="arabic-text font-arabic leading-[2.4] text-right text-noor-dark text-2xl my-3">
                    {item.teksArab}
                  </p>
                  
                  {/* Latin Text */}
                  <p className="text-left text-xs text-noor-gold font-medium italic mt-2">
                    {item.teksLatin}
                  </p>

                  {/* Translation Text */}
                  <p className="text-left text-xs text-[#7A5845]/90 font-medium mt-1">
                    {item.teksIndonesia}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default Favorit;