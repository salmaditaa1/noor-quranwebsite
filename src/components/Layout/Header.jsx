import { useState, useEffect } from "react";
import { Compass, Calendar } from "lucide-react";

// Robust conversion from Gregorian to Hijri Date
function getHijriDate(date = new Date()) {
  const gDay = date.getDate();
  const gMonth = date.getMonth(); // 0-indexed
  const gYear = date.getFullYear();

  let jd;
  let m = gMonth + 1;
  let y = gYear;

  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + gDay + b - 1524.5;

  const epoch = 1948439.5;
  const l = jd - epoch + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lRest = l - 10631 * n + 354;
  const j = Math.floor((10985 - lRest) / 5316) * Math.floor((50 * lRest + 228553) / 17719) + Math.floor(lRest / 5670) * Math.floor((43 * lRest + 15238) / 15303);
  const lRest2 = lRest - Math.floor((30 - j) / 15) * Math.floor((17719 * j + 176589) / 50) - Math.floor(j / 30) * Math.floor((15303 * j + 24484) / 43) + 950;
  
  let hMonth = Math.floor((30 * lRest2 + 20970) / 1061);
  let hDay = lRest2 - Math.floor((1061 * hMonth + 20970) / 30) + 1;
  let hYear = 30 * n + j - 30;

  if (hMonth > 12) {
    hMonth -= 12;
    hYear += 1;
  }

  const MONTHS = [
    "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
    "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
    "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
  ];

  return `${hDay} ${MONTHS[hMonth - 1]} ${hYear} H`;
}

function Header() {
  const [greeting, setGreeting] = useState("Assalamualaikum");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Calculate time-based greeting
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      setGreeting("Assalamualaikum, Selamat Lail (Malam)");
    } else if (hour >= 5 && hour < 11) {
      setGreeting("Assalamualaikum, Shabahul Khair (Pagi)");
    } else if (hour >= 11 && hour < 15) {
      setGreeting("Assalamualaikum, Selamat Nahar (Siang)");
    } else if (hour >= 15 && hour < 18) {
      setGreeting("Assalamualaikum, Masa'ul Khair (Sore)");
    } else {
      setGreeting("Assalamualaikum, Lailah Sa'idah (Malam)");
    }

    return () => clearInterval(timer);
  }, []);

  const formatDateGregorian = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatClock = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };

  return (
    <header className="glass-panel shadow-noor-warm rounded-noor p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-noor-gold/15 overflow-hidden relative">
      {/* Background vector highlight */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-bl from-noor-gold/5 to-transparent pointer-events-none rounded-bl-full"></div>
      
      <div>
        <h2 className="text-lg md:text-xl font-bold text-noor-dark font-sans tracking-wide">
          {greeting}
        </h2>
        <p className="text-xs md:text-sm text-noor-textSecondary mt-0.5 font-medium flex items-center gap-2">
          <span>{formatClock(currentTime)} WIB</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 inline text-noor-gold" />
            {formatDateGregorian(currentTime)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Hijri Calendar Badge */}
        <div className="flex flex-col items-end px-4 py-2 bg-gradient-to-br from-noor-light to-noor-dark text-[#F6EFE4] rounded-xl border border-noor-gold/20 shadow-sm">
          <span className="text-[10px] text-[#E8D8BF]/60 font-semibold tracking-widest uppercase">Kalender Hijriah</span>
          <span className="text-sm font-bold tracking-wide font-sans text-noor-gold">{getHijriDate(currentTime)}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
