import { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Clock, ChevronRight } from "lucide-react";
import { useAppSettings } from "../../context/AppSettingsContext";
import toast from "react-hot-toast";

const FALLBACK_JADWAL = {
  imsak: "04:31",
  subuh: "04:41",
  dzuhur: "11:58",
  ashar: "15:20",
  maghrib: "17:51",
  isya: "19:05"
};

const PRAYERS = [
  { key: "subuh", label: "Subuh" },
  { key: "dzuhur", label: "Dzuhur" },
  { key: "ashar", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya", label: "Isya" }
];

function PrayerPanel() {
  const { prayerCity, setPrayerCity } = useAppSettings();
  const [jadwal, setJadwal] = useState(FALLBACK_JADWAL);
  const [loading, setLoading] = useState(true);
  
  // City search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Countdown states
  const [nextPrayer, setNextPrayer] = useState({ name: "-", timeLeft: "-" });

  // Fetch Prayer Times
  useEffect(() => {
    let active = true;
    const fetchPrayerTimes = async () => {
      setLoading(true);
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
          setJadwal({
            imsak: apiJadwal.imsak,
            subuh: apiJadwal.subuh,
            dzuhur: apiJadwal.dzuhur,
            ashar: apiJadwal.ashar,
            maghrib: apiJadwal.maghrib,
            isya: apiJadwal.isya
          });
        }
      } catch (error) {
        console.error("Gagal mengambil jadwal sholat:", error);
        // Fallback to static times if offline or API is down
        if (active) {
          setJadwal(FALLBACK_JADWAL);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPrayerTimes();
    return () => {
      active = false;
    };
  }, [prayerCity]);

  // Handle countdown calculations
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const curHour = now.getHours();
      const curMin = now.getMinutes();
      const curSec = now.getSeconds();
      const curTimeSec = curHour * 3600 + curMin * 60 + curSec;

      let nextName = "";
      let nextTimeStr = "";
      let diffSeconds = 0;

      // Map schedule to seconds from midnight
      const times = [
        { name: "Subuh", time: jadwal.subuh },
        { name: "Dzuhur", time: jadwal.dzuhur },
        { name: "Ashar", time: jadwal.ashar },
        { name: "Maghrib", time: jadwal.maghrib },
        { name: "Isya", time: jadwal.isya }
      ];

      // Convert "HH:MM" to seconds
      const getSeconds = (str) => {
        if (!str) return 0;
        const [h, m] = str.split(":").map(Number);
        return h * 3600 + m * 60;
      };

      // Find next prayer today
      let found = false;
      for (const pr of times) {
        const prSec = getSeconds(pr.time);
        if (prSec > curTimeSec) {
          nextName = pr.name;
          nextTimeStr = pr.time;
          diffSeconds = prSec - curTimeSec;
          found = true;
          break;
        }
      }

      // If no prayer left today, next prayer is Subuh tomorrow
      if (!found) {
        nextName = "Subuh";
        nextTimeStr = jadwal.subuh;
        const subuhSec = getSeconds(jadwal.subuh);
        const dayRemainingSec = 24 * 3600 - curTimeSec;
        diffSeconds = dayRemainingSec + subuhSec;
      }

      // Format diffSeconds into "HHh MMm SSs"
      const h = Math.floor(diffSeconds / 3600);
      const min = Math.floor((diffSeconds % 3600) / 60);
      const s = diffSeconds % 60;

      const timeLeftFormatted = `${String(h).padStart(2, "0")}j ${String(min).padStart(2, "0")}m ${String(s).padStart(2, "0")}d`;

      setNextPrayer({
        name: nextName,
        timeLeft: timeLeftFormatted,
        timeStr: nextTimeStr
      });
    };

    calculateCountdown(); // Initial trigger
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [jadwal]);

  // Handle City Search
  const handleCitySearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${query}`);
      if (res.data?.status && res.data?.data) {
        setSearchResults(res.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const selectCity = (city) => {
    setPrayerCity({ id: city.id, nama: city.lokasi });
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`Lokasi diubah ke: ${city.lokasi}`);
  };

  return (
    <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Background Islamic Star Motif */}
      <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 opacity-[0.03] text-noor-light pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,0 60,35 95,35 65,55 75,90 50,70 25,90 35,55 5,35 40,35" />
        </svg>
      </div>

      {/* Title & Location Button */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-noor-divider">
        <h3 className="font-bold text-noor-dark flex items-center gap-2">
          <Clock className="w-5 h-5 text-noor-gold" />
          Jadwal Sholat
        </h3>
        
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-noor-gold/10 hover:bg-noor-gold/20 text-noor-light hover:text-noor-dark rounded-xl text-xs font-semibold transition-all duration-200"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{prayerCity.nama}</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-noor-gold"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Countdown Widget */}
          <div className="bg-gradient-to-br from-noor-light to-noor-dark text-[#F6EFE4] p-4 rounded-xl border border-noor-gold/20 shadow-inner text-center relative">
            <p className="text-[10px] uppercase tracking-wider text-noor-gold font-bold">
              Sholat Berikutnya
            </p>
            <h4 className="text-2xl font-extrabold tracking-wide mt-1">
              {nextPrayer.name} <span className="text-noor-gold text-lg">({nextPrayer.timeStr})</span>
            </h4>
            <p className="text-xl font-mono mt-1 font-bold text-[#F6EFE4]">
              {nextPrayer.timeLeft}
            </p>
          </div>

          {/* List of Prayer Times */}
          <div className="grid grid-cols-5 gap-1.5 pt-2 text-center">
            {PRAYERS.map((pr) => {
              const isActivePrayer = nextPrayer.name.toLowerCase() === pr.key;
              return (
                <div
                  key={pr.key}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActivePrayer
                      ? "bg-noor-gold/20 border border-noor-gold/40 scale-105"
                      : "bg-[#F6EFE4] border border-noor-divider/50 hover:bg-white"
                  }`}
                >
                  <p className={`text-[10px] font-bold ${isActivePrayer ? "text-noor-light" : "text-noor-textSecondary"}`}>
                    {pr.label}
                  </p>
                  <p className={`text-sm font-extrabold mt-1 ${isActivePrayer ? "text-noor-dark" : "text-noor-dark/80"}`}>
                    {jadwal[pr.key] || "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CITY SEARCH MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-noor-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F6EFE4] rounded-noor shadow-noor-heavy border border-noor-gold/30 max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-noor-dark mb-4 flex items-center gap-2 border-b border-noor-divider pb-2">
              <MapPin className="w-5 h-5 text-noor-gold" />
              Pilih Lokasi Sholat
            </h3>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-5 h-5 absolute left-3 top-3 text-noor-textSecondary/50" />
              <input
                type="text"
                placeholder="Cari nama kota/kabupaten... (min. 3 huruf)"
                value={searchQuery}
                onChange={handleCitySearch}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-noor-divider rounded-xl focus:outline-none focus:border-noor-gold text-sm transition-colors text-noor-dark placeholder-[#7A5845]/40 font-medium"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 scrollbar-thin">
              {searching ? (
                <div className="text-center py-6 text-sm text-[#7A5845]/60 font-medium">Mencari lokasi...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-4 py-3 bg-white hover:bg-noor-gold/10 rounded-xl text-sm font-semibold text-noor-dark flex items-center justify-between group transition-all duration-200 border border-noor-divider/30"
                  >
                    <span>{city.lokasi}</span>
                    <ChevronRight className="w-4 h-4 text-noor-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : searchQuery.trim().length >= 3 ? (
                <div className="text-center py-6 text-sm text-[#7A5845]/60">Kota tidak ditemukan</div>
              ) : (
                <div className="text-center py-6 text-xs text-[#7A5845]/50 italic">
                  Ketik minimal 3 huruf untuk mulai mencari
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowSearchModal(false)}
              className="mt-6 w-full py-2.5 bg-noor-gold/10 hover:bg-noor-gold text-noor-light hover:text-[#F6EFE4] rounded-xl text-sm font-bold transition-all duration-300"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrayerPanel;
