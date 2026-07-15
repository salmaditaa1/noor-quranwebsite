import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Howl } from "howler";
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
  Type,
  AlignLeft,
  X,
  Volume2,
  Heart
} from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { useAudio } from "../context/AudioContext";
import { useActivity } from "../context/ActivityContext";
import Loader from "../components/Common/Loader";
import toast from "react-hot-toast";

function DetailSurat() {
  const { nomor } = useParams();
  const navigate = useNavigate();
  
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom display settings
  const [showTranslation, setShowTranslation] = useState(true);
  const [showLatin, setShowLatin] = useState(true);
  const [textSize, setTextSize] = useState("lg"); // md, lg, xl, 2xl
  const [arabicFont, setArabicFont] = useState("custom"); // amiri, custom
  const [showSettings, setShowSettings] = useState(false);

  // Tafsir state
  const [tafsirData, setTafsirData] = useState(null);
  const [activeTafsirVerse, setActiveTafsirVerse] = useState(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [showTafsirDrawer, setShowTafsirDrawer] = useState(false);

  // Verse-by-verse audio state
  const [playingVerse, setPlayingVerse] = useState(null); // nomorAyat currently playing
  const verseHowlRef = useRef(null);

  const { 
    isSurahFavorite, 
    toggleFavoriteSurah, 
    toggleBookmarkVerse, 
    isVerseBookmarked, 
    updateLastRead,
    lastRead,
    appPreferences
  } = useAppSettings();
  const { playSurahAudio, togglePlay, activeSurah, isPlaying, activeReciter } = useAudio();
  const { addActivity } = useActivity();

  // Framer Motion scroll progress (updates style directly without causing re-renders)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Load Surah details
  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://equran.id/api/v2/surat/${nomor}`);
        if (active && res.data?.data) {
          setDetail(res.data.data);
          
          // Auto save reading progress as Last Read of verse 1 initially
          localStorage.setItem("noor-last-read", JSON.stringify({
            surahNomor: res.data.data.nomor,
            namaSurah: res.data.data.namaLatin,
            nomorAyat: 1,
            jumlahAyat: res.data.data.jumlahAyat,
            timestamp: Date.now()
          }));
          
          addActivity({
            type: "quran",
            title: "Membaca Surah",
            description: `Membuka QS. ${res.data.data.namaLatin}`
          });
        }
      } catch (err) {
        console.error("Gagal memuat ayat:", err);
        setError("Gagal memuat surah. Silakan periksa koneksi internet Anda.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetail();
    
    // Clean up verse audio on change
    return () => {
      active = false;
      stopVerseAudio();
    };
  }, [nomor, addActivity]);

  const isInitialLoading = loading && !detail;
  const isDetailTransitioning = loading && detail;

  if (isInitialLoading) return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8 relative space-y-6">
      {/* Sticky Header Skeleton */}
      <div className="bg-noor-card p-4 md:p-6 rounded-2xl border border-noor-divider shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <div className="w-24 h-8 bg-noor-divider/40 rounded-lg animate-pulse"></div>
          <div className="w-1/3 h-8 bg-noor-divider/40 rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-noor-divider/40 rounded-lg animate-pulse"></div>
        </div>
      </div>
      {/* Verses Skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-noor-card p-5 md:p-6 rounded-2xl border border-noor-divider space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12 h-12 bg-noor-divider/40 rounded-full animate-pulse"></div>
            <div className="w-24 h-8 bg-noor-divider/40 rounded-xl animate-pulse"></div>
          </div>
          <div className="w-full h-12 bg-noor-divider/40 rounded-full animate-pulse"></div>
          <div className="w-3/4 h-12 bg-noor-divider/40 rounded-full animate-pulse self-end ml-auto"></div>
          <div className="border-t border-noor-divider/60 pt-4 mt-6">
            <div className="w-full h-4 bg-noor-divider/40 rounded-full animate-pulse mb-2"></div>
            <div className="w-5/6 h-4 bg-noor-divider/40 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <p className="text-red-500 font-bold mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-noor-gold text-white rounded-xl">Coba Lagi</button>
    </div>
  );
  if (!detail) return <p className="text-center py-10">Surah tidak ditemukan</p>;

  const surahNum = parseInt(nomor);
  const prevSurahNum = surahNum > 1 ? surahNum - 1 : null;
  const nextSurahNum = surahNum < 114 ? surahNum + 1 : null;

  // Verse playback controller
  function playVerseAudio(ayat) {
    stopVerseAudio();

    const audioUrl = ayat.audio[activeReciter];
    if (!audioUrl) {
      toast.error("Audio ayat tidak tersedia untuk qari ini");
      return;
    }

    setPlayingVerse(ayat.nomorAyat);
    
    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      format: ["mp3"],
      onplay: () => {
        // Auto-save progress to this verse when played!
        localStorage.setItem("noor-last-read", JSON.stringify({
          surahNomor: detail.nomor,
          namaSurah: detail.namaLatin,
          nomorAyat: ayat.nomorAyat,
          timestamp: Date.now()
        }));
      },
      onend: () => {
        setPlayingVerse(null);
      },
      onloaderror: () => {
        toast.error("Gagal memuat audio ayat");
        setPlayingVerse(null);
      },
      onplayerror: () => {
        toast.error("Gagal memutar audio ayat");
        setPlayingVerse(null);
      }
    });

    sound.play();
    verseHowlRef.current = sound;
  }

  function stopVerseAudio() {
    if (verseHowlRef.current) {
      verseHowlRef.current.stop();
      verseHowlRef.current.unload();
      verseHowlRef.current = null;
    }
    setPlayingVerse(null);
  }

  // Load Tafsir data
  const handleOpenTafsir = async (verseNum) => {
    setActiveTafsirVerse(verseNum);
    setShowTafsirDrawer(true);
    
    if (tafsirData && tafsirData.nomor === detail.nomor) return;

    setLoadingTafsir(true);
    try {
      const res = await axios.get(`https://equran.id/api/v2/tafsir/${detail.nomor}`);
      if (res.data?.data) {
        setTafsirData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data Tafsir");
    } finally {
      setLoadingTafsir(false);
    }
  };

  const handleCopyVerse = (ayat) => {
    const textToCopy = `${ayat.teksArab}\n\n${ayat.teksLatin}\n\nArtinya: "${ayat.teksIndonesia}" (QS. ${detail.namaLatin}: ${ayat.nomorAyat})`;
    navigator.clipboard.writeText(textToCopy);
    toast.success(`Ayat ${ayat.nomorAyat} berhasil disalin`);
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
      toast.success("Link & ayat disalin!");
    }
  };

  const getArabicTextClass = () => {
    const prefFont = appPreferences?.arabicFont || arabicFont;
    const font = prefFont === "amiri" ? "font-serif" : "font-arabic";
    let sizeClass = "";
    switch (textSize) {
      case "md": sizeClass = "text-2xl"; break;
      case "lg": sizeClass = "text-3xl md:text-4xl"; break;
      case "xl": sizeClass = "text-4xl md:text-5xl"; break;
      case "2xl": sizeClass = "text-5xl md:text-6xl"; break;
      default: sizeClass = "text-3xl md:text-4xl"; break;
    }
    return `${font} ${sizeClass}`;
  };

  const getTafsirContent = () => {
    if (!tafsirData || !activeTafsirVerse) return "";
    const item = tafsirData.tafsir.find(t => t.ayat === activeTafsirVerse);
    return item ? item.teks : "Tafsir tidak ditemukan untuk ayat ini.";
  };

  const isCurrentSurahPlaying = activeSurah?.nomor === detail.nomor && isPlaying;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8 relative">
      {isDetailTransitioning && (
        <div className="absolute inset-0 z-50 bg-noor-dark/10 flex items-center justify-center rounded-2xl">
          <div className="bg-white/95 border border-noor-divider rounded-2xl p-5 shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-noor-gold border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-bold text-noor-dark">Memuat surah berikutnya...</span>
          </div>
        </div>
      )}
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-noor-divider z-50 md:ml-[285px]">
        <motion.div 
          className="h-full bg-noor-gold origin-left"
          style={{ scaleX }}
        />
      </div>
      
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
        <div className="islamic-corner-ornament islamic-corner-tl"></div>
        <div className="islamic-corner-ornament islamic-corner-tr"></div>
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-noor-gold via-transparent to-transparent pointer-events-none"></div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide font-sans">{detail.namaLatin}</h1>
        <p className="text-noor-gold font-bold italic text-sm md:text-base mt-1">"{detail.arti}"</p>
        
        <p className="text-xs md:text-sm text-[#E8D8BF]/60 mt-2 font-semibold">
          {detail.jumlahAyat} AYAT • {detail.tempatTurun.toUpperCase()}
        </p>

        <div className="flex justify-center gap-3 mt-6">
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
            {isCurrentSurahPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isCurrentSurahPlaying ? "Pause Audio" : "Putar Audio Surah"}</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-center p-2.5 bg-[#F6EFE4]/10 hover:bg-[#F6EFE4]/20 border border-[#F6EFE4]/20 rounded-xl text-[#F6EFE4] transition-all"
            title="Pengaturan Tampilan"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => toggleFavoriteSurah(detail)}
            className={`flex items-center justify-center p-2.5 border rounded-xl transition-all ${
              isSurahFavorite(detail.nomor)
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : "bg-[#F6EFE4]/10 hover:bg-[#F6EFE4]/20 border-[#F6EFE4]/20 text-[#F6EFE4]"
            }`}
            title="Favorit"
          >
            <Heart className={`w-4 h-4 ${isSurahFavorite(detail.nomor) ? "fill-current text-red-400" : ""}`} />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-noor-gold/20 text-left">
          <p className="text-[10px] text-noor-gold uppercase font-bold tracking-wider mb-2">Tentang Surah</p>
          <div
            className="text-xs text-[#E8D8BF]/80 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: detail.deskripsi }}
          />
        </div>
      </div>

      {/* Settings Panel Drawer */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Text Size */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-noor-textSecondary flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-noor-gold" /> Ukuran Huruf Arab
            </span>
            <div className="flex bg-[#DABE9E]/30 rounded-xl p-0.5 border border-noor-divider text-center">
              {["md", "lg", "xl", "2xl"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setTextSize(sz)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    textSize === sz ? "bg-noor-light text-white shadow-sm" : "text-noor-textSecondary hover:text-noor-dark"
                  }`}
                >
                  {sz === "md" ? "Sedang" : sz === "lg" ? "Besar" : sz === "xl" ? "X-Besar" : "Super"}
                </button>
              ))}
            </div>
          </div>

          {/* Font Type */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-noor-textSecondary flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-noor-gold" /> Jenis Font Arab
            </span>
            <div className="flex bg-[#DABE9E]/30 rounded-xl p-0.5 border border-noor-divider text-center">
              {[
                { id: "custom", label: "TintaArabic" },
                { id: "amiri", label: "Amiri" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setArabicFont(f.id)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    arabicFont === f.id ? "bg-noor-light text-white shadow-sm" : "text-noor-textSecondary hover:text-noor-dark"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-noor-textSecondary">Terjemahan</span>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`py-1.5 px-3 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                  showTranslation ? "bg-noor-gold/15 text-noor-light border-noor-gold/25" : "bg-white text-noor-textSecondary/40 border-noor-divider"
                }`}
              >
                {showTranslation ? "Tampil" : "Sembunyi"}
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-noor-textSecondary">Latin</span>
              <button
                onClick={() => setShowLatin(!showLatin)}
                className={`py-1.5 px-3 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                  showLatin ? "bg-noor-gold/15 text-noor-light border-noor-gold/25" : "bg-white text-noor-textSecondary/40 border-noor-divider"
                }`}
              >
                {showLatin ? "Tampil" : "Sembunyi"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bismillah Separator */}
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
          const isLastRead = lastRead?.surahNomor === detail.nomor && lastRead?.nomorAyat === ayat.nomorAyat;
          const isPlayingThisVerse = playingVerse === ayat.nomorAyat;

          return (
            <div key={ayat.nomorAyat}>
              <motion.div
                id={`ayat-${ayat.nomorAyat}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                className={`bg-noor-card border rounded-noor p-5 md:p-6 transition-all duration-300 relative ${
                  isPlayingThisVerse
                    ? "border-noor-gold ring-2 ring-noor-gold/40 bg-noor-gold/5 shadow-noor-lg scale-[1.01]"
                    : isLastRead
                    ? "border-noor-gold ring-1 ring-noor-gold/30 shadow-noor-warm"
                    : "border-noor-divider hover:border-noor-gold/50 shadow-noor-sm"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Verse Number & Action Buttons */}
                  <div className="flex md:flex-col items-center gap-2 w-full md:w-auto border-b md:border-b-0 border-noor-divider/40 pb-3 md:pb-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-noor-light to-noor-dark text-[#F6EFE4] flex items-center justify-center font-bold text-xs shadow-md border border-noor-gold/20">
                      {ayat.nomorAyat}
                    </div>

                    <div className="flex md:flex-col gap-1.5 ml-auto md:ml-0 md:mt-4">
                      {/* Play Specific Verse */}
                      <button
                        onClick={() => isPlayingThisVerse ? stopVerseAudio() : playVerseAudio(ayat)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          isPlayingThisVerse
                            ? "bg-noor-gold text-white"
                            : "bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80"
                        }`}
                        title={isPlayingThisVerse ? "Pause Ayat" : "Putar Ayat"}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
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
                            ? "bg-noor-gold text-[#F6EFE4]"
                            : "bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80"
                        }`}
                        title="Bookmark Ayat"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
                      </button>

                      {/* Open Tafsir */}
                      <button
                        onClick={() => handleOpenTafsir(ayat.nomorAyat)}
                        className="p-2 rounded-xl bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80 transition-all text-xs font-bold"
                        title="Tafsir Ayat"
                      >
                        Tafsir
                      </button>

                      {/* Mark as Last Read */}
                      <button
                        onClick={() => updateLastRead(detail.nomor, detail.namaLatin, ayat.nomorAyat, detail.jumlahAyat)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          isLastRead
                            ? "bg-noor-gold text-white"
                            : "bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80"
                        }`}
                        title="Tandai Terakhir Dibaca"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy/Share */}
                      <button
                        onClick={() => handleCopyVerse(ayat)}
                        className="p-2 rounded-xl bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80 transition-all"
                        title="Salin"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleShareVerse(ayat)}
                        className="p-2 rounded-xl bg-white text-noor-textSecondary hover:bg-noor-gold/15 border border-noor-divider/80 transition-all"
                        title="Bagikan"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Script & Translation details */}
                  <div className="flex-1 text-right pl-0 md:pl-6 w-full">
                    <p 
                      className={`leading-[2.4] text-noor-dark select-all ${getArabicTextClass()}`}
                      style={{ 
                        fontSize: appPreferences?.arabicFontSize ? `${appPreferences.arabicFontSize}px` : undefined,
                        fontFamily: appPreferences?.arabicFont === "amiri" ? "'Amiri', serif" : undefined
                      }}
                    >
                      {ayat?.teksArab || ""}
                    </p>

                    {showLatin && (
                      <p className="text-left text-xs md:text-sm text-noor-gold font-medium italic mt-4 select-text leading-relaxed">
                        {ayat.teksLatin}
                      </p>
                    )}

                    {showTranslation && (
                      <p className="text-left text-sm text-[#7A5845]/90 font-medium mt-3 select-text leading-relaxed border-t border-noor-divider/20 pt-3">
                        {ayat.teksIndonesia}
                      </p>
                    )}
                  </div>

                </div>
              </motion.div>
              {index < detail.ayat.length - 1 && (
                <div className="islamic-divider-gold my-5">
                  <div className="islamic-divider-gold-star"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TAFSIR DRAWER MODAL OVERLAY */}
      <AnimatePresence>
        {showTafsirDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-noor-dark/40 backdrop-blur-sm">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setShowTafsirDrawer(false)}></div>
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-[#F6EFE4] w-full max-w-md h-screen relative z-10 shadow-noor-heavy border-l border-noor-gold/30 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-noor-divider flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-bold text-noor-dark text-base">Tafsir Kemenag RI</h3>
                  <p className="text-xs text-noor-textSecondary">
                    QS. {detail.namaLatin} : Ayat {activeTafsirVerse}
                  </p>
                </div>
                <button
                  onClick={() => setShowTafsirDrawer(false)}
                  className="p-2 hover:bg-noor-gold/15 rounded-xl text-noor-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">
                {loadingTafsir ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-noor-gold mb-2"></div>
                    <p className="text-xs text-noor-textSecondary font-semibold">Mengunduh tafsir...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Verse context */}
                    {detail.ayat.find(a => a.nomorAyat === activeTafsirVerse) && (
                      <div className="p-3 bg-white border border-noor-divider/60 rounded-xl mb-4 text-right">
                        <p className="font-arabic text-xl leading-relaxed text-noor-dark">
                          {detail.ayat.find(a => a.nomorAyat === activeTafsirVerse).teksArab}
                        </p>
                      </div>
                    )}

                    <h4 className="text-xs font-bold text-noor-gold uppercase tracking-wider">Ulasan Tafsir</h4>
                    <p className="text-sm font-medium text-[#7A5845] leading-relaxed whitespace-pre-line text-justify">
                      {getTafsirContent()}
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-noor-divider bg-[#DABE9E]/20 flex-shrink-0">
                <button
                  onClick={() => setShowTafsirDrawer(false)}
                  className="w-full py-2.5 bg-noor-light hover:bg-noor-dark text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Tutup Tafsir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Bottom Links */}
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