import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  Share2,
  Copy,
  Play,
  Pause,
  Settings,
  Eye,
  EyeOff,
  Type
} from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { useAudio } from "../context/AudioContext";
import Loader from "../components/Common/Loader";
import toast from "react-hot-toast";

function DetailSurat() {
  const { nomor } = useParams();
  const navigate = useNavigate();
  
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Custom display settings
  const [showTranslation, setShowTranslation] = useState(true);
  const [showLatin, setShowLatin] = useState(true);
  const [textSize, setTextSize] = useState("lg"); // md, lg, xl, 2xl
  const [showSettings, setShowSettings] = useState(false);

  const { isVerseBookmarked, toggleBookmarkVerse, updateLastRead, lastRead } = useAppSettings();
  const { playSurahAudio, togglePlay, activeSurah, isPlaying } = useAudio();

  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://equran.id/api/v2/surat/${nomor}`);
        if (active && res.data?.data) {
          setDetail(res.data.data);
        }
      } catch (err) {
        console.error("Gagal memuat detail surah:", err);
        toast.error("Gagal memuat ayat-ayat surah");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetail();
    
    return () => {
      active = false;
    };
  }, [nomor]);

  if (loading) return <Loader label="Memuat Ayat..." />;
  if (!detail) return <p className="text-center py-10">Surah tidak ditemukan</p>;

  const surahNum = parseInt(nomor);
  const prevSurahNum = surahNum > 1 ? surahNum - 1 : null;
  const nextSurahNum = surahNum < 114 ? surahNum + 1 : null;

  const handleCopyVerse = (ayat) => {
    const textToCopy = `${ayat.teksArab}\n\n${ayat.teksLatin}\n\nArtinya: "${ayat.teksIndonesia}" (QS. ${detail.namaLatin}: ${ayat.nomorAyat})`;
    navigator.clipboard.writeText(textToCopy);
    toast.success(`Ayat ${ayat.nomorAyat} berhasil disalin ke clipboard`);
  };

  const handleShareVerse = (ayat) => {
    const shareData = {
      title: `QS. ${detail.namaLatin} Ayat ${ayat.nomorAyat}`,
      text: `QS. ${detail.namaLatin} [${detail.nomor}:${ayat.nomorAyat}] - ${ayat.teksArab}\n\n"${ayat.teksIndonesia}"`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(`${shareData.text}\nBuka di: ${shareData.url}`);
      toast.success("Link & ayat disalin untuk dibagikan!");
    }
  };

  const getArabicTextSizeClass = () => {
    switch (textSize) {
      case "md": return "text-2xl";
      case "lg": return "text-3xl md:text-4xl";
      case "xl": return "text-4xl md:text-5xl";
      case "2xl": return "text-5xl md:text-6xl";
      default: return "text-3xl md:text-4xl";
    }
  };

  const isCurrentSurahPlaying = activeSurah?.nomor === detail.nomor && isPlaying;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Navigation Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/quran"
          className="flex items-center gap-1.5 px-3 py-2 bg-noor-card border border-noor-divider hover:border-noor-gold text-noor-light hover:text-noor-dark text-xs font-bold rounded-xl transition-all shadow-noor-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>

        {/* Prev / Next Surah Links */}
        <div className="flex gap-2">
          {prevSurahNum && (
            <button
              onClick={() => navigate(`/surat/${prevSurahNum}`)}
              className="p-2 bg-noor-card border border-noor-divider hover:border-noor-gold text-noor-light hover:text-noor-dark rounded-xl transition-all shadow-noor-sm"
              title="Surah Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          
          <span className="px-4 py-2 bg-noor-gold/15 text-noor-light font-bold rounded-xl text-xs flex items-center border border-noor-gold/20 shadow-sm">
            QS. {detail.namaLatin}
          </span>

          {nextSurahNum && (
            <button
              onClick={() => navigate(`/surat/${nextSurahNum}`)}
              className="p-2 bg-noor-card border border-noor-divider hover:border-noor-gold text-noor-light hover:text-noor-dark rounded-xl transition-all shadow-noor-sm"
              title="Surah Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Surah Banner */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-6 border border-noor-gold/20 shadow-noor-heavy text-center relative overflow-hidden">
        {/* Calligraphic styling background */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-noor-gold via-transparent to-transparent pointer-events-none"></div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide font-sans">{detail.namaLatin}</h1>
        <p className="text-noor-gold font-bold italic text-sm md:text-base mt-1">"{detail.arti}"</p>
        
        <p className="text-xs md:text-sm text-[#E8D8BF]/60 mt-2 font-semibold">
          {detail.jumlahAyat} AYAT • {detail.tempatTurun.toUpperCase()}
        </p>

        <div className="flex justify-center gap-3 mt-6">
          {/* Play/Pause Surah Audio */}
          <button
            onClick={() => {
              if (activeSurah?.nomor === detail.nomor) {
                togglePlay();
              } else {
                playSurahAudio(detail);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-105 ${
              isCurrentSurahPlaying
                ? "bg-noor-gold text-white"
                : "bg-white text-noor-dark hover:bg-noor-gold hover:text-white"
            }`}
          >
            {isCurrentSurahPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Putar Audio Surah</span>
              </>
            )}
          </button>

          {/* Quick Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-center p-2.5 bg-[#F6EFE4]/10 hover:bg-[#F6EFE4]/20 border border-[#F6EFE4]/20 rounded-xl text-[#F6EFE4] transition-all"
            title="Pengaturan Tampilan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Deskripsi collapse/overlay */}
        <div className="mt-6 pt-4 border-t border-noor-gold/20 text-left">
          <p className="text-[10px] text-noor-gold uppercase font-bold tracking-wider mb-2">Tentang Surah</p>
          <div
            className="text-xs text-[#E8D8BF]/80 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: detail.deskripsi }}
          />
        </div>
      </div>

      {/* Inline Reading View Settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Font Size Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-noor-textSecondary flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-noor-gold" /> Ukuran Huruf Arab
            </span>
            <div className="flex bg-[#DABE9E]/30 rounded-xl p-0.5 border border-noor-divider text-center">
              {["md", "lg", "xl", "2xl"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setTextSize(sz)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    textSize === sz ? "bg-noor-light text-white shadow-sm" : "text-noor-textSecondary hover:text-noor-dark"
                  }`}
                >
                  {sz === "md" ? "Sedang" : sz === "lg" ? "Besar" : sz === "xl" ? "X-Besar" : "Super"}
                </button>
              ))}
            </div>
          </div>

          {/* Translation Toggles */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-noor-textSecondary flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-noor-gold" /> Terjemahan
            </span>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                showTranslation
                  ? "bg-noor-gold/10 text-noor-light border-noor-gold/30"
                  : "bg-white text-noor-textSecondary/50 border-noor-divider"
              }`}
            >
              {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showTranslation ? "Tampilkan Terjemahan" : "Sembunyikan"}</span>
            </button>
          </div>

          {/* Latin Transliteration Toggle */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-noor-textSecondary flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-noor-gold" /> Transliterasi Latin
            </span>
            <button
              onClick={() => setShowLatin(!showLatin)}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                showLatin
                  ? "bg-noor-gold/10 text-noor-light border-noor-gold/30"
                  : "bg-white text-noor-textSecondary/50 border-noor-divider"
              }`}
            >
              {showLatin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showLatin ? "Tampilkan Latin" : "Sembunyikan"}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Bismillah calligraphic card for surahs except Al-Fatihah (1) & At-Tawbah (9) */}
      {detail.nomor !== 1 && detail.nomor !== 9 && (
        <div className="text-center py-6 my-6 bg-noor-card border border-noor-divider rounded-noor shadow-noor-sm select-none">
          <p className="font-arabic text-3xl text-noor-dark tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-[10px] uppercase font-bold text-noor-gold tracking-widest mt-2">
            Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
          </p>
        </div>
      )}

      {/* Verses Container */}
      <div className="space-y-6 mt-6">
        {detail.ayat.map((ayat, index) => {
          const bookmarked = isVerseBookmarked(detail.nomor, ayat.nomorAyat);
          const isLastRead =
            lastRead?.surahNomor === detail.nomor && lastRead?.nomorAyat === ayat.nomorAyat;

          return (
            <motion.div
              key={ayat.nomorAyat}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              className={`bg-noor-card border rounded-noor p-5 md:p-6 transition-all duration-300 relative ${
                isLastRead
                  ? "border-noor-gold ring-1 ring-noor-gold/45 shadow-noor-warm"
                  : "border-noor-divider hover:border-noor-gold/50 shadow-noor-sm"
              }`}
            >
              {/* Left Side: Verse Numbering Panel + Actions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Verse controls bar */}
                <div className="flex md:flex-col items-center gap-2 w-full md:w-auto border-b md:border-b-0 border-noor-divider/40 pb-3 md:pb-0">
                  {/* Circle octagram verse marker */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-noor-light to-noor-dark text-[#F6EFE4] flex items-center justify-center font-bold text-xs shadow-md border border-noor-gold/20">
                    {ayat.nomorAyat}
                  </div>

                  <div className="flex md:flex-col gap-1.5 ml-auto md:ml-0 md:mt-4">
                    {/* Mark Last Read */}
                    <button
                      onClick={() => updateLastRead(detail.nomor, detail.namaLatin, ayat.nomorAyat)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        isLastRead
                          ? "bg-noor-gold text-white"
                          : "bg-white text-noor-textSecondary hover:bg-noor-gold/15 hover:text-noor-dark border border-noor-divider/80"
                      }`}
                      title={isLastRead ? "Terakhir dibaca di sini" : "Tandai Terakhir Dibaca"}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>

                    {/* Bookmark Verse */}
                    <button
                      onClick={() =>
                        toggleBookmarkVerse({
                          surahNomor: detail.nomor,
                          surahName: detail.namaLatin,
                          nomorAyat: ayat.nomorAyat,
                          teksArab: ayat.teksArab,
                          teksLatin: ayat.teksLatin,
                          teksIndonesia: ayat.teksIndonesia
                        })
                      }
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        bookmarked
                          ? "bg-noor-gold text-[#F6EFE4] border-noor-gold"
                          : "bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80"
                      }`}
                      title={bookmarked ? "Hapus Bookmark" : "Simpan Bookmark"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
                    </button>

                    {/* Copy Verse */}
                    <button
                      onClick={() => handleCopyVerse(ayat)}
                      className="p-2 rounded-xl bg-white text-noor-textSecondary hover:bg-noor-gold/15 hover:text-noor-dark border border-noor-divider/80 transition-all"
                      title="Salin Ayat"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Share Verse */}
                    <button
                      onClick={() => handleShareVerse(ayat)}
                      className="p-2 rounded-xl bg-white text-noor-textSecondary hover:bg-noor-gold/15 hover:text-noor-dark border border-noor-divider/80 transition-all"
                      title="Bagikan Ayat"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Text & Translations */}
                <div className="flex-1 text-right select-none md:pl-6 w-full">
                  {/* Arabic script */}
                  <p className={`arabic-text font-arabic leading-[2.4] text-noor-dark select-all ${getArabicTextSizeClass()}`}>
                    {ayat.teksArab}
                  </p>

                  {/* Transliteration */}
                  {showLatin && (
                    <p className="text-left text-xs md:text-sm text-noor-gold font-medium italic mt-4 select-text leading-relaxed">
                      {ayat.teksLatin}
                    </p>
                  )}

                  {/* Translation */}
                  {showTranslation && (
                    <p className="text-left text-sm text-[#7A5845]/90 font-medium mt-3 select-text leading-relaxed border-t border-noor-divider/20 pt-3">
                      {ayat.teksIndonesia}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Bottom Link */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-noor-divider">
        {prevSurahNum ? (
          <button
            onClick={() => navigate(`/surat/${prevSurahNum}`)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-noor-card border border-noor-divider hover:border-noor-gold text-noor-light hover:text-noor-dark text-xs font-bold rounded-xl transition-all shadow-noor-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Surah Seb.</span>
          </button>
        ) : (
          <div />
        )}

        <Link
          to="/quran"
          className="px-5 py-2.5 bg-gradient-to-tr from-noor-dark to-noor-light text-[#F6EFE4] font-bold rounded-xl text-xs hover:scale-105 shadow-md transition-all border border-noor-gold/20"
        >
          Katalog Surah
        </Link>

        {nextSurahNum ? (
          <button
            onClick={() => navigate(`/surat/${nextSurahNum}`)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-noor-card border border-noor-divider hover:border-noor-gold text-noor-light hover:text-noor-dark text-xs font-bold rounded-xl transition-all shadow-noor-sm"
          >
            <span>Surah Sel.</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default DetailSurat;