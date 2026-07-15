import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
];

const DAYS_OF_WEEK = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];

function HijriCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getHijriParts = (date) => {
    try {
      const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      const parts = formatter.formatToParts(date);
      const day = parseInt(parts.find(p => p.type === 'day')?.value, 10);
      const month = parseInt(parts.find(p => p.type === 'month')?.value, 10);
      const year = parseInt(parts.find(p => p.type === 'year')?.value, 10);

      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        return { day, month, year };
      }
    } catch (e) {
      // Ignore and use fallback below
    }

    const jd = Math.floor((date.getTime() - Date.UTC(1940, 1, 1)) / 86400000) + 2449709;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j1 = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor((l2 - 1) / 5670) * Math.floor((43 * l2) / 15238);
    const month = Math.floor((30 * l2 + 15) / 10646);
    const day = Math.floor((30 * l2 + 15) / 10646) === 0 ? 1 : Math.floor((l2 - j1) / 29.5) + 1;
    const year = 30 * n + j1;

    return {
      day: Math.max(1, Math.min(30, day)),
      month: Math.max(1, Math.min(12, month)),
      year: Math.max(1, year)
    };
  };

  const generateMonthData = useMemo(() => {
    // Determine the Hijri month and year of the currently viewed date
    const targetParts = getHijriParts(currentDate);
    
    // Find the 1st day of this Hijri month by walking backwards from currentDate
    let firstDayGregorian = new Date(currentDate);
    firstDayGregorian.setHours(12, 0, 0, 0); // Avoid timezone shifts
    
    let parts = getHijriParts(firstDayGregorian);
    let guard = 0;
    while (parts.month === targetParts.month && parts.day > 1 && guard < 40) {
      firstDayGregorian.setDate(firstDayGregorian.getDate() - 1);
      parts = getHijriParts(firstDayGregorian);
      guard++;
    }
    // If we stepped out of the month, step forward once
    if (parts.month !== targetParts.month) {
      firstDayGregorian.setDate(firstDayGregorian.getDate() + 1);
    }

    // Now generate days until the month changes (max 30 days)
    const days = [];
    let currentGregorian = new Date(firstDayGregorian);
    
    for (let i = 0; i < 30; i++) {
      const p = getHijriParts(currentGregorian);
      if (p.month !== targetParts.month) break;
      
      days.push({
        hijriDay: p.day,
        gregorianDate: new Date(currentGregorian),
        isToday: currentGregorian.toDateString() === new Date().toDateString()
      });
      
      currentGregorian.setDate(currentGregorian.getDate() + 1);
    }

    const firstDayOfWeek = days[0].gregorianDate.getDay();

    return {
      hijriMonthName: HIJRI_MONTHS[targetParts.month - 1],
      hijriYear: targetParts.year,
      days,
      firstDayOfWeek
    };
  }, [currentDate]);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 29);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 29);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-xl bg-white border border-noor-divider shadow-sm hover:bg-noor-gold/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-noor-dark" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-noor-dark flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-noor-gold" />
              Kalender Hijriah
            </h2>
            <p className="text-sm text-noor-textSecondary font-medium">Panduan Waktu Islam</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-noor-divider rounded-2xl shadow-noor-warm overflow-hidden">
        
        {/* Calendar Toolbar */}
        <div className="p-6 bg-gradient-to-br from-noor-dark to-noor-light text-white flex items-center justify-between">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h3 className="text-2xl font-extrabold">{generateMonthData.hijriMonthName}</h3>
            <p className="text-[#E8D8BF] font-medium">{generateMonthData.hijriYear} H</p>
          </div>
          <button 
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DAYS_OF_WEEK.map((day, i) => (
              <div key={i} className="text-center text-xs font-bold text-noor-textSecondary uppercase tracking-wider">
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {/* Empty slots for start of month */}
            {Array.from({ length: generateMonthData.firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 md:p-4 rounded-xl border border-transparent"></div>
            ))}

            {/* Days */}
            {generateMonthData.days.map((day, i) => (
              <div 
                key={i} 
                className={`relative flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border transition-all ${
                  day.isToday 
                    ? "bg-noor-gold/10 border-noor-gold shadow-sm" 
                    : "border-noor-divider hover:border-noor-gold/50 hover:bg-noor-card"
                }`}
              >
                {day.isToday && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-noor-gold rounded-full animate-pulse"></span>
                )}
                <span className={`text-xl md:text-2xl font-bold ${day.isToday ? "text-noor-gold" : "text-noor-dark"}`}>
                  {day.hijriDay}
                </span>
                <span className="text-[9px] md:text-xs text-noor-textSecondary/60 font-medium mt-1">
                  {day.gregorianDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default HijriCalendarPage;
