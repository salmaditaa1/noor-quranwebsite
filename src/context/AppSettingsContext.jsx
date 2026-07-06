import { createContext, useContext, useState, useEffect } from "react";
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
