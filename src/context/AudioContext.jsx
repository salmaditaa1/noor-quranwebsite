import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import toast from "react-hot-toast";

const AudioContext = createContext();

export const RECITERS = [
  { id: "05", name: "Misyari Rasyid Al-Afasy", desc: "Suara jernih dan merdu" },
  { id: "01", name: "Abdullah Al-Juhany", desc: "Imam Masjidil Haram" },
  { id: "02", name: "Abdul Muhsin Al-Qasim", desc: "Imam Masjid Nabawi" },
  { id: "03", name: "Abdurrahman As-Sudais", desc: "Suara khas & penuh wibawa" },
  { id: "04", name: "Ibrahim Al-Dossari", desc: "Lantunan lambat dan khusyuk" }
];

export function AudioProvider({ children }) {
  const [activeReciter, setActiveReciter] = useState(() => {
    return localStorage.getItem("noor-reciter") || "05"; // Default Al-Afasy
  });
  
  const [activeSurah, setActiveSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [seekPosition, setSeekPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const howlRef = useRef(null);
  const progressTimerRef = useRef(null);

  // Sync reciter preference
  useEffect(() => {
    localStorage.setItem("noor-reciter", activeReciter);
  }, [activeReciter]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      stopTimer();
    };
  }, []);

  const startTimer = () => {
    stopTimer();
    progressTimerRef.current = setInterval(() => {
      if (howlRef.current && isPlaying) {
        setSeekPosition(howlRef.current.seek() || 0);
      }
    }, 250);
  };

  const stopTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const playSurahAudio = (surah, targetReciterId = activeReciter) => {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }

    setLoading(true);
    setIsPlaying(false);
    setActiveSurah(surah);
    setSeekPosition(0);

    const audioUrl = surah.audioFull[targetReciterId];

    if (!audioUrl) {
      toast.error("Audio untuk qari ini tidak tersedia");
      setLoading(false);
      return;
    }

    const sound = new Howl({
      src: [audioUrl],
      html5: true, // For streaming support (prevents loading whole file first)
      format: ["mp3"],
      rate: playbackRate,
      onload: () => {
        setDuration(sound.duration());
        setLoading(false);
        sound.play();
        setIsPlaying(true);
        startTimer();
        const reciterName = RECITERS.find(r => r.id === targetReciterId)?.name;
        toast.success(`Memutar Surah ${surah.namaLatin} - ${reciterName}`);
      },
      onplay: () => {
        setIsPlaying(true);
        startTimer();
      },
      onpause: () => {
        setIsPlaying(false);
        stopTimer();
      },
      onstop: () => {
        setIsPlaying(false);
        setSeekPosition(0);
        stopTimer();
      },
      onend: () => {
        setIsPlaying(false);
        setSeekPosition(0);
        stopTimer();
        toast.success(`Selesai mendengarkan Surah ${surah.namaLatin}`);
      },
      onloaderror: (id, err) => {
        console.error("Howler load error:", err);
        toast.error("Gagal memuat audio Surah");
        setLoading(false);
      },
      onplayerror: (id, err) => {
        console.error("Howler play error:", err);
        toast.error("Gagal memutar audio Surah");
        setLoading(false);
      }
    });

    howlRef.current = sound;
  };

  const togglePlay = () => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  };

  const stopAudio = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    setActiveSurah(null);
    setIsPlaying(false);
    setSeekPosition(0);
    setDuration(0);
    stopTimer();
  };

  const seek = (newPosition) => {
    if (howlRef.current) {
      howlRef.current.seek(newPosition);
      setSeekPosition(newPosition);
    }
  };

  const changeReciter = (reciterId) => {
    setActiveReciter(reciterId);
    if (activeSurah) {
      playSurahAudio(activeSurah, reciterId);
    } else {
      const reciterName = RECITERS.find(r => r.id === reciterId)?.name;
      toast.success(`Reciter diubah ke: ${reciterName}`);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (howlRef.current) {
      howlRef.current.rate(rate);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        activeReciter,
        changeReciter,
        activeSurah,
        isPlaying,
        loading,
        duration,
        seekPosition,
        playbackRate,
        playSurahAudio,
        togglePlay,
        stopAudio,
        seek,
        changePlaybackRate
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
