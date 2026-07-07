import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppSettingsContext = createContext();

export function AppSettingsProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-favorites")) || [];
  });

  const [bookmarkedVerses, setBookmarkedVerses] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-bookmarks")) || [];
  });

  const [lastRead, setLastRead] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-last-read")) || null;
  });

  const [prayerCity, setPrayerCity] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-prayer-city")) || { id: "1301", nama: "JAKARTA" };
  });

  const [appPreferences, setAppPreferences] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-preferences")) || {
      theme: "cream",
      arabicFont: "amiri",
      arabicFontSize: 28,
      translationFontSize: 14,
      notifications: true,
      dailyTarget: 10
    };
  });

  // Listen to preference changes across tabs or from ProfilePage
  useEffect(() => {
    const handleStorage = () => {
      const prefs = JSON.parse(localStorage.getItem("noor-preferences"));
      if (prefs) setAppPreferences(prefs);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("themeChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("themeChange", handleStorage);
    };
  }, []);

  const [todayPrayerTimes, setTodayPrayerTimes] = useState(null);

  // Fetch Prayer Times
  useEffect(() => {
    let active = true;
    const fetchPrayerTimes = async () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");

      try {
        const response = await axios.get(
          `https://api.myquran.com/v2/sholat/jadwal/${prayerCity.id}/${y}/${m}/${d}`
        );
        if (active && response.data?.status && response.data?.data?.jadwal) {
          const apiJadwal = response.data.data.jadwal;
          setTodayPrayerTimes({
            Fajr: apiJadwal.subuh,
            Dhuhr: apiJadwal.dzuhur,
            Asr: apiJadwal.ashar,
            Maghrib: apiJadwal.maghrib,
            Isha: apiJadwal.isya
          });
        }
      } catch (error) {
        console.error("Gagal mengambil jadwal sholat global:", error);
      }
    };
    fetchPrayerTimes();
    return () => { active = false; };
  }, [prayerCity]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("noor-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("noor-bookmarks", JSON.stringify(bookmarkedVerses));
  }, [bookmarkedVerses]);

  useEffect(() => {
    localStorage.setItem("noor-last-read", JSON.stringify(lastRead));
  }, [lastRead]);

  useEffect(() => {
    localStorage.setItem("noor-prayer-city", JSON.stringify(prayerCity));
  }, [prayerCity]);

  // Actions
  const toggleFavoriteSurah = (surah) => {
    setFavorites((prev) => {
      const isExist = prev.find((item) => item.nomor === surah.nomor);
      if (isExist) {
        toast.success(`Mengeluarkan Surah ${surah.namaLatin} dari Favorit`);
        return prev.filter((item) => item.nomor !== surah.nomor);
      } else {
        toast.success(`Surah ${surah.namaLatin} ditambahkan ke Favorit ⭐`);
        return [...prev, surah];
      }
    });
  };

  const isSurahFavorite = (nomor) => {
    return favorites.some((item) => item.nomor === nomor);
  };

  const toggleBookmarkVerse = (verseData) => {
    setBookmarkedVerses((prev) => {
      const isExist = prev.find(
        (item) => item.surahNomor === verseData.surahNomor && item.nomorAyat === verseData.nomorAyat
      );
      if (isExist) {
        toast.success(`Bookmark ayat ${verseData.nomorAyat} dihapus`);
        return prev.filter(
          (item) => !(item.surahNomor === verseData.surahNomor && item.nomorAyat === verseData.nomorAyat)
        );
      } else {
        toast.success(`Ayat ${verseData.nomorAyat} ditambahkan ke Bookmark 📖`);
        return [...prev, verseData];
      }
    });
  };

  const isVerseBookmarked = (surahNomor, nomorAyat) => {
    return bookmarkedVerses.some(
      (item) => item.surahNomor === surahNomor && item.nomorAyat === nomorAyat
    );
  };

  const updateLastRead = (surahNomor, namaSurah, nomorAyat) => {
    const data = { surahNomor, namaSurah, nomorAyat, timestamp: Date.now() };
    setLastRead(data);
    toast.success(`Terakhir Dibaca: Surah ${namaSurah} ayat ${nomorAyat}`);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        favorites,
        toggleFavoriteSurah,
        isSurahFavorite,
        bookmarkedVerses,
        toggleBookmarkVerse,
        isVerseBookmarked,
        lastRead,
        updateLastRead,
        prayerCity,
        setPrayerCity,
        todayPrayerTimes,
        appPreferences,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
}
