import { useState, useEffect } from "react";
import { CheckSquare, Square, Award, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useActivity } from "../../context/ActivityContext";

const INITIAL_TASKS = [
  { id: "subuh", label: "Sholat Subuh", category: "prayer" },
  { id: "dzuhur", label: "Sholat Dzuhur", category: "prayer" },
  { id: "ashar", label: "Sholat Ashar", category: "prayer" },
  { id: "maghrib", label: "Sholat Maghrib", category: "prayer" },
  { id: "isya", label: "Sholat Isya", category: "prayer" },
  { id: "quran", label: "Membaca Al-Qur'an", category: "quran" },
  { id: "dzikir", label: "Dzikir Harian", category: "dzikir" }
];

function WorshipProgress() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const { addActivity } = useActivity();
  
  // Date tracking to reset state on a new day
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  useEffect(() => {
    const storedDate = localStorage.getItem("noor-worship-date");
    const todayKey = getTodayKey();

    if (storedDate !== todayKey) {
      // It's a new day! Reset active checks, save history of yesterday if needed
      localStorage.setItem("noor-worship-date", todayKey);
      localStorage.setItem("noor-worship-tasks", JSON.stringify([]));
      setCompletedTasks([]);
    } else {
      const storedTasks = JSON.parse(localStorage.getItem("noor-worship-tasks")) || [];
      setCompletedTasks(storedTasks);
    }
  }, []);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      let updated;
      const isCurrentlyCompleted = prev.includes(taskId);
      
      if (isCurrentlyCompleted) {
        updated = prev.filter(id => id !== taskId);
        toast.error(`Mengosongkan kembali checklist Anda`);
      } else {
        updated = [...prev, taskId];
        toast.success(`Alhamdulillah, tugas ibadah selesai! ✨`);
        
        // Log activity dynamically
        const taskObj = INITIAL_TASKS.find(t => t.id === taskId);
        if (taskObj) {
          if (taskObj.category === "prayer") {
            addActivity({
              type: "prayer",
              title: "Sholat Fardhu",
              description: `Menunaikan ${taskObj.label}`
            });
          } else if (taskObj.category === "quran") {
            addActivity({
              type: "quran_target",
              title: "Target Tilawah Harian",
              description: "Menyelesaikan target membaca Al-Qur'an harian"
            });
          } else if (taskObj.category === "dzikir") {
            addActivity({
              type: "dzikir_target",
              title: "Target Dzikir Harian",
              description: "Menyelesaikan target membaca dzikir harian"
            });
          }
        }

        // Dynamic feedback if all prayers are completed
        const prayersCount = updated.filter(id => id.startsWith("subuh") || id.startsWith("dzuhur") || id.startsWith("ashar") || id.startsWith("maghrib") || id.startsWith("isya")).length;
        if (prayersCount === 5 && !prev.includes(taskId) && taskId !== "quran" && taskId !== "dzikir") {
          toast.success("Maa Shaa Allah! Semua sholat 5 waktu telah tuntas hari ini! 🤲");
        }
      }

      localStorage.setItem("noor-worship-tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const calculatePercentage = () => {
    if (INITIAL_TASKS.length === 0) return 0;
    return Math.round((completedTasks.length / INITIAL_TASKS.length) * 100);
  };

  const resetAll = () => {
    if (window.confirm("Reset seluruh progress ibadah hari ini?")) {
      setCompletedTasks([]);
      localStorage.setItem("noor-worship-tasks", JSON.stringify([]));
      toast.success("Progress harian di-reset");
    }
  };

  const percentage = calculatePercentage();

  return (
    <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-5 flex flex-col justify-between relative overflow-hidden h-full">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-noor-divider mb-4">
        <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base">
          <Award className="w-5 h-5 text-noor-gold" />
          Progress Ibadah Harian
        </h3>
        <button
          onClick={resetAll}
          className="text-noor-textSecondary hover:text-red-700 transition-colors p-1"
          title="Reset Harian"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Core */}
      <div className="flex items-center gap-6 mb-5 select-none">
        {/* Progress Circle Ring */}
        <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              className="stroke-[#E8D8BF]/40"
              strokeWidth="5.5"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              className="stroke-noor-gold transition-all duration-500 ease-out"
              strokeWidth="5.5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - percentage / 100)}
            />
          </svg>
          <span className="absolute text-sm font-extrabold text-noor-dark font-mono">{percentage}%</span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-noor-gold uppercase tracking-wider">Aktivitas Hari Ini</h4>
          <p className="text-sm font-bold text-noor-dark mt-0.5">
            {completedTasks.length} dari {INITIAL_TASKS.length} Target Selesai
          </p>
          <p className="text-[11px] text-noor-textSecondary/70 mt-1 italic">
            "Amalan yang paling dicintai Allah adalah yang berkelanjutan meskipun sedikit." (HR. Bukhari)
          </p>
        </div>
      </div>

      {/* Checklist list */}
      <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin pr-1 flex-1">
        {INITIAL_TASKS.map((task) => {
          const done = completedTasks.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full text-left px-3 py-2 bg-white border rounded-xl flex items-center justify-between transition-all duration-200 group ${
                done
                  ? "border-noor-gold/30 bg-noor-gold/5 text-noor-dark"
                  : "border-noor-divider/50 text-[#7A5845] hover:border-noor-gold/35"
              }`}
            >
              <span className={`text-xs font-bold ${done ? "line-through opacity-60" : ""}`}>
                {task.label}
              </span>
              
              <span className="text-noor-gold group-hover:scale-105 transition-transform flex-shrink-0 ml-3">
                {done ? (
                  <CheckSquare className="w-4 h-4 fill-current text-noor-light" />
                ) : (
                  <Square className="w-4 h-4 text-noor-gold/75" />
                )}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default WorshipProgress;
