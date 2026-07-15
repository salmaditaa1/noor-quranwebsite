import { useState, useMemo } from "react";
import { BarChart3, TrendingUp, Target, Award, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useActivity } from "../context/ActivityContext";

function ProgressPage() {
  const [period, setPeriod] = useState("Minggu Ini");

  const { activities } = useActivity();

  // Calculate dynamic stats from activity logs
  const stats = useMemo(() => {
    let quranPages = 0;
    let dhikrCount = 0;
    let prayersCount = 0;

    activities.forEach(a => {
      if (a.type === "quran" || a.type === "quran_target") quranPages++;
      if (a.type === "dzikir" || a.type === "tasbih" || a.type === "dzikir_target") dhikrCount++;
      if (a.type === "prayer") prayersCount++;
    });

    // Calculate streak (consecutive days of any activity)
    let currentStreak = 0;
    if (activities.length > 0) {
      const dates = new Set(activities.map(a => new Date(a.timestamp).toDateString()));
      let checkDate = new Date();
      
      if (dates.has(checkDate.toDateString())) {
        currentStreak++;
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (dates.has(checkDate.toDateString())) {
            currentStreak++;
          } else {
            break;
          }
        }
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (dates.has(yesterday.toDateString())) {
          currentStreak++;
          checkDate = yesterday;
          while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (dates.has(checkDate.toDateString())) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }
    }

    // Compute today's prayer checklist percentage
    const todayStr = new Date().toDateString();
    const todayPrayers = activities.filter(
      a => a.type === "prayer" && new Date(a.timestamp).toDateString() === todayStr
    ).length;
    const prayersOnTimePercent = todayPrayers > 0 ? `${Math.min(100, Math.round((todayPrayers / 5) * 100))}%` : "0%";

    return {
      streak: currentStreak || 1, // Default to 1 if first activity
      quranPages,
      dhikrCount,
      prayersOnTime: prayersOnTimePercent
    };
  }, [activities]);

  // Aggregate by day of week
  const chartData = useMemo(() => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    // Default to last 7 days including today
    activities.forEach(a => {
      const d = new Date(a.timestamp);
      counts[d.getDay()]++;
    });

    const maxCount = Math.max(...counts, 1);
    
    return [
      { day: "Sen", percent: (counts[1] / maxCount) * 100 },
      { day: "Sel", percent: (counts[2] / maxCount) * 100 },
      { day: "Rab", percent: (counts[3] / maxCount) * 100 },
      { day: "Kam", percent: (counts[4] / maxCount) * 100 },
      { day: "Jum", percent: (counts[5] / maxCount) * 100 },
      { day: "Sab", percent: (counts[6] / maxCount) * 100 },
      { day: "Min", percent: (counts[0] / maxCount) * 100 },
    ];
  }, [activities]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-8 border border-noor-gold/25 shadow-noor-heavy relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 opacity-10 pointer-events-none">
           <BarChart3 className="w-full h-full text-noor-gold" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-noor-gold" />
          Analisis Progress
        </h2>
        <p className="text-[#E8D8BF]/80 text-xs md:text-sm max-w-xl font-medium mb-6">
          "Barangsiapa yang hari ini lebih baik dari hari kemarin, maka ia adalah orang yang beruntung."
        </p>

        <div className="flex bg-black/20 p-1.5 rounded-xl max-w-xs">
          {["Minggu Ini", "Bulan Ini"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                period === p ? "bg-noor-gold text-white shadow-sm" : "text-[#E8D8BF] hover:bg-white/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-noor-divider/60 rounded-2xl p-5 text-center shadow-sm hover:border-noor-gold/40 transition-colors">
          <div className="w-10 h-10 mx-auto bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-extrabold text-noor-dark">{stats.streak} Hari</h4>
          <p className="text-[10px] text-noor-textSecondary font-bold uppercase tracking-wider mt-1">Streak Ibadah</p>
        </div>
        <div className="bg-white border border-noor-divider/60 rounded-2xl p-5 text-center shadow-sm hover:border-noor-gold/40 transition-colors">
          <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-extrabold text-noor-dark">{stats.quranPages}</h4>
          <p className="text-[10px] text-noor-textSecondary font-bold uppercase tracking-wider mt-1">Halaman Qur'an</p>
        </div>
        <div className="bg-white border border-noor-divider/60 rounded-2xl p-5 text-center shadow-sm hover:border-noor-gold/40 transition-colors">
          <div className="w-10 h-10 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-extrabold text-noor-dark">{stats.dhikrCount}</h4>
          <p className="text-[10px] text-noor-textSecondary font-bold uppercase tracking-wider mt-1">Total Dzikir</p>
        </div>
        <div className="bg-white border border-noor-divider/60 rounded-2xl p-5 text-center shadow-sm hover:border-noor-gold/40 transition-colors">
          <div className="w-10 h-10 mx-auto bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-2xl font-extrabold text-noor-dark">{stats.prayersOnTime}</h4>
          <p className="text-[10px] text-noor-textSecondary font-bold uppercase tracking-wider mt-1">Sholat Tepat Waktu</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white border border-noor-divider rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-extrabold text-noor-dark flex items-center gap-2">
            <Calendar className="w-5 h-5 text-noor-gold" />
            Aktivitas {period}
          </h3>
        </div>
        
        <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div className="w-full relative h-full flex items-end">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 ease-out ${d.percent === 100 ? 'bg-noor-gold' : 'bg-noor-gold/30 group-hover:bg-noor-gold/50'}`}
                  style={{ height: `${d.percent}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-noor-dark text-white text-[10px] font-bold px-2 py-1 rounded shadow-md transition-opacity pointer-events-none z-10">
                    {Math.round(d.percent)}%
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-noor-textSecondary mt-3">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges / Achievements */}
      <div className="bg-white border border-noor-divider rounded-2xl p-6 shadow-sm">
        <h3 className="font-extrabold text-noor-dark flex items-center gap-2 mb-4 border-b border-noor-divider/50 pb-3">
          <Award className="w-5 h-5 text-noor-gold" />
          Pencapaian (Badges)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="border border-noor-gold/30 bg-noor-gold/5 p-4 rounded-xl text-center">
             <div className="w-12 h-12 mx-auto bg-gradient-to-br from-noor-gold to-yellow-600 text-white rounded-full flex items-center justify-center mb-2 shadow-md">
               <Award className="w-6 h-6" />
             </div>
             <h5 className="font-bold text-xs text-noor-dark">7 Hari Berturut</h5>
             <p className="text-[10px] text-noor-textSecondary mt-1">Konsisten membaca</p>
           </div>
           
           <div className="border border-noor-gold/30 bg-noor-gold/5 p-4 rounded-xl text-center opacity-50 grayscale">
             <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-300 to-gray-500 text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
               <Award className="w-6 h-6" />
             </div>
             <h5 className="font-bold text-xs text-noor-dark">Khatam 1 Juz</h5>
             <p className="text-[10px] text-noor-textSecondary mt-1">Belum tercapai</p>
           </div>

           <div className="border border-noor-gold/30 bg-noor-gold/5 p-4 rounded-xl text-center opacity-50 grayscale">
             <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-300 to-gray-500 text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
               <Award className="w-6 h-6" />
             </div>
             <h5 className="font-bold text-xs text-noor-dark">Pejuang Subuh</h5>
             <p className="text-[10px] text-noor-textSecondary mt-1">Belum tercapai</p>
           </div>
        </div>
      </div>

    </div>
  );
}

// Icon helper since lucide-react doesn't have BookOpenIcon
function BookOpenIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

export default ProgressPage;
