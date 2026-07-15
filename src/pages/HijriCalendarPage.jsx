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

  // Function to convert Gregorian date to Hijri parts using Intl
  const getHijriParts = (date) => {
    try {
      const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      const parts = formatter.formatToParts(date);
      const day = parseInt(parts.find(p => p.type === 'day').value, 10);
      const month = parseInt(parts.find(p => p.type === 'month').value, 10);
      const year = parseInt(parts.find(p => p.type === 'year').value, 10);
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Invalid numeric Hijri date parts");
      }
      
      return { day, month, year };
    } catch (e) {
      // Fallback rough approximation if not supported or fails
      const epoch = 1948439.5;
      const j = Math.floor((date.getTime() / 86400000) + 2440587.5) - epoch;
      const y = Math.floor((30 * j + 10646) / 10631);
      const m = Math.min(12, Math.ceil((j - (29 + y) - Math.floor((y * 327) / 900)) / 29.5) + 1);
      const d = (j - Math.floor((29.5001 * (m - 1)) + 0.99)) - Math.floor((y * 10631) / 30);
      return { day: Math.max(1, d), month: Math.max(1, m), year: y };
    }
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
