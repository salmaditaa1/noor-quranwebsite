import { useState, useEffect } from "react";
import { Compass, Calendar } from "lucide-react";

// Robust conversion from Gregorian to Hijri Date using native Intl API
function getHijriDate(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formatted = formatter.format(date);
    // Ensure " H" is appended if not present
    return formatted.includes(" H") ? formatted : `${formatted} H`;
  } catch (error) {
    // Fallback if browser doesn't support u-ca-islamic
    return "1 Muharram 1448 H";
  }
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
