import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, MapPin, Calendar, Bell, Sparkles, ChevronRight } from "lucide-react";
import useGeolocation from "../hooks/useGeolocation";
import Loader from "../components/Common/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Static estimation of key Islamic holidays in 2026-2027
const ISLAMIC_EVENTS = [
  { name: "Tahun Baru Islam (1 Muharram 1448 H)", dateStr: "2026-06-16", label: "Awal Tahun Hijriah" },
  { name: "Maulid Nabi Muhammad SAW (12 Rabi'ul Awal 1448 H)", dateStr: "2026-08-25", label: "Kelahiran Rasulullah" },
  { name: "Isra Mi'raj Nabi Muhammad (27 Rajab 1448 H)", dateStr: "2027-02-05", label: "Perjalanan Malam Nabi" },
  { name: "Awal Ramadhan (1 Ramadhan 1448 H)", dateStr: "2027-02-08", label: "Mulai Puasa Wajib" },
  { name: "Hari Raya Idul Fitri (1 Syawal 1448 H)", dateStr: "2027-03-10", label: "Kemenangan / Lebaran" },
  { name: "Hari Raya Idul Adha (10 Dzulhijjah 1448 H)", dateStr: "2027-05-17", label: "Hari Raya Kurban" }
];

const PRAYER_LIST = [
  { key: "Imsak", label: "Imsak" },
  { key: "Fajr", label: "Subuh" },
  { key: "Dhuhr", label: "Dzuhur" },
  { key: "Asr", label: "Ashar" },
  { key: "Maghrib", label: "Maghrib" },
  { key: "Isha", label: "Isya" }
];

function PrayerPage() {
  const { coordinates, loading: geoLoading } = useGeolocation();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Loading location...");

  const [nextPrayer, setNextPrayer] = useState({ name: "-", timeLeft: "-", timeStr: "-" });

  useEffect(() => {
    if (geoLoading || !coordinates) return;

    let active = true;
    const fetchPrayerTimes = async () => {
      setLoading(true);
      const timestamp = Math.floor(Date.now() / 1000);
      try {
        // Query Aladhan API using coordinates
        const res = await axios.get(
          `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&method=2`
        );
        if (active && res.data?.data) {
          const data = res.data.data;
          setPrayerTimes(data.timings);
          
          const hijri = data.date.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.ar} (${hijri.month.en}) ${hijri.year} H`);

          // Reverse geocode to get a readable city name (using a free open geocode API or static)
          try {
            const geoRes = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.latitude}&lon=${coordinates.longitude}`
            );
            if (geoRes.data?.address) {
              const addr = geoRes.data.address;
              const cityName = addr.city || addr.town || addr.municipality || addr.state || "Lokasi Anda";
              setCity(cityName.toUpperCase());
            } else {
              setCity("LOKASI AKTIF");
            }
          } catch (e) {
            setCity("LOKASI AKTIF");
          }
        }
      } catch (err) {
        console.error("Gagal memuat jadwal sholat Aladhan:", err);
        toast.error("Gagal memuat jadwal sholat terbaru online");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPrayerTimes();
    return () => {
      active = false;
    };
  }, [coordinates, geoLoading]);

  // Countdown clock to next prayer
  useEffect(() => {
    if (!prayerTimes) return;

    const calculateCountdown = () => {
      const now = new Date();
      const curHour = now.getHours();
      const curMin = now.getMinutes();
      const curSec = now.getSeconds();
      const curTimeSec = curHour * 3600 + curMin * 60 + curSec;

      let nextName = "";
      let nextTimeStr = "";
      let diffSeconds = 0;

      const times = [
        { name: "Subuh", time: prayerTimes.Fajr },
        { name: "Dzuhur", time: prayerTimes.Dhuhr },
        { name: "Ashar", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isya", time: prayerTimes.Isha }
      ];

      const getSeconds = (str) => {
        if (!str) return 0;
        const [h, m] = str.split(":").map(Number);
        return h * 3600 + m * 60;
      };

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

      if (!found) {
        nextName = "Subuh";
        nextTimeStr = prayerTimes.Fajr;
        const subuhSec = getSeconds(prayerTimes.Fajr);
        const dayRemainingSec = 24 * 3600 - curTimeSec;
        diffSeconds = dayRemainingSec + subuhSec;
      }

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

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  const getDaysUntil = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    
    if (eventDate < today) {
      // If event passed this year, compute for next year
      eventDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <Loader label="Sinkronisasi Jadwal Sholat..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-6 border border-noor-gold/25 shadow-noor-heavy relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 opacity-[0.05] text-noor-gold pointer-events-none">
          <Clock className="w-full h-full" />
        </div>
        <div className="flex items-center gap-1.5 text-noor-gold mb-2">
          <MapPin className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">{city} (SINKRONISASI GPS)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans">
          Jadwal Sholat & Penanggalan Hijriah
        </h2>
        <p className="text-[#E8D8BF]/70 text-xs md:text-sm mt-1 max-w-xl font-medium">
          Dapatkan waktu ibadah presisi berdasarkan titik koordinat GPS riil Anda. Dilengkapi dengan hitung mundur sholat berikutnya dan kalender hari besar Islam.
        </p>
      </div>

      {/* Main Grid: Countdown + Active Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Countdown console */}
        <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6 flex flex-col justify-between text-center">
          <div>
            <span className="text-[10px] text-noor-gold font-bold uppercase tracking-widest">Sholat Selanjutnya</span>
            <h3 className="text-3xl font-extrabold text-noor-dark mt-2 tracking-wide">
              {nextPrayer.name}
            </h3>
            <span className="text-sm font-bold text-noor-textSecondary mt-0.5 block">({nextPrayer.timeStr} WIB)</span>
            
            {/* Visual clock divider */}
            <div className="w-full border-t border-noor-divider/50 my-6"></div>

            <div className="text-3xl font-mono font-extrabold tracking-wider text-noor-light">
              {nextPrayer.timeLeft}
            </div>
            <p className="text-[10px] text-noor-textSecondary/60 mt-2 font-medium">tersisa untuk menunaikan ibadah</p>
          </div>

          <Link
            to="/azan-settings"
            className="w-full py-2.5 bg-noor-gold/15 hover:bg-noor-gold text-noor-light hover:text-[#F6EFE4] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-6 border border-noor-gold/20"
          >
            <Bell className="w-4 h-4" />
            <span>Pengaturan Azan & Alarm</span>
          </Link>

          <Link
            to="/qibla"
            className="w-full py-2.5 bg-white hover:bg-noor-gold/10 text-noor-dark rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2 border border-noor-divider/50 shadow-sm"
          >
            <MapPin className="w-4 h-4 text-noor-gold" />
            <span>Kompas Kiblat</span>
          </Link>
        </div>

        {/* Prayer timetable */}
        <div className="md:col-span-2 bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6">
          <div className="flex items-center justify-between pb-3 border-b border-noor-divider mb-4">
            <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base">
              <Clock className="w-5 h-5 text-noor-gold" />
              Waktu Sholat Hari Ini
            </h3>
            <span className="text-[10px] font-bold text-noor-textSecondary flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-noor-gold" /> {hijriDate}
            </span>
          </div>

          <div className="space-y-2.5">
            {PRAYER_LIST.map((pr) => {
              const active = nextPrayer.name.toLowerCase() === pr.key.toLowerCase() || (pr.key === "Fajr" && nextPrayer.name === "Subuh");
              return (
                <div
                  key={pr.key}
                  className={`px-4 py-3 rounded-xl flex items-center justify-between border transition-all duration-300 ${
                    active
                      ? "bg-noor-gold/25 border-noor-gold ring-1 ring-noor-gold/30 scale-[1.01] shadow-noor-sm"
                      : "bg-white/60 border-noor-divider/40 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-noor-light animate-ping" : "bg-noor-divider"}`}></div>
                    <span className={`text-xs font-bold ${active ? "text-noor-dark text-sm" : "text-[#7A5845]"}`}>
                      {pr.label}
                    </span>
                  </div>
                  <span className={`text-sm font-extrabold ${active ? "text-noor-dark text-base" : "text-noor-dark/80"}`}>
                    {prayerTimes[pr.key] || "-"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 2: Upcoming Islamic Events */}
      <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6">
        <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base border-b border-noor-divider pb-3 mb-4">
          <Sparkles className="w-5 h-5 text-noor-gold" />
          Hari Besar Islam Selanjutnya (Kalender Masehi)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ISLAMIC_EVENTS.map((event, idx) => {
            const daysLeft = getDaysUntil(event.dateStr);
            return (
              <div
                key={idx}
                className="bg-white border border-noor-divider/50 hover:border-noor-gold p-4 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-sm"
              >
                <div>
                  <span className="text-[9px] bg-noor-gold/15 text-noor-light px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {event.label}
                  </span>
                  <h4 className="text-xs font-extrabold text-noor-dark mt-2.5 leading-relaxed">
                    {event.name}
                  </h4>
                  <p className="text-[10px] text-noor-textSecondary/50 font-bold mt-1">
                    Tanggal: {new Date(event.dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="border-t border-noor-divider/30 mt-4 pt-2.5 flex items-center justify-between text-xs">
                  <span className="text-noor-textSecondary font-semibold">Tersisa:</span>
                  <span className="font-bold text-noor-light">{daysLeft} Hari lagi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default PrayerPage;
