import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import toast from "react-hot-toast";
import { useActivity } from "../../context/ActivityContext";

const DHIKR_PHRASES = [
  { arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "Subhanallah", meaning: "Maha Suci Allah" },
  { arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah", meaning: "Segala Puji Bagi Allah" },
  { arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah Maha Besar" },
  { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", transliteration: "Lailaha illallah", meaning: "Tiada Tuhan Selain Allah" },
  { arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", transliteration: "Astagfirullah", meaning: "Aku memohon ampun kepada Allah" },
  { arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ", transliteration: "Sholawat Nabi", meaning: "Ya Allah, limpahkan sholawat kepada Nabi Muhammad" }
];

function TasbihPanel() {
  const [selectedDhikrIndex, setSelectedDhikrIndex] = useState(0);
  const [counts, setCounts] = useState(() => {
    return JSON.parse(localStorage.getItem("noor-tasbih-counts")) || {};
  });
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { addActivity } = useActivity();

  const controls = useAnimation();
  const currentDhikr = DHIKR_PHRASES[selectedDhikrIndex];
  const currentCount = counts[currentDhikr.transliteration] || 0;

  // Sync counts
  useEffect(() => {
    localStorage.setItem("noor-tasbih-counts", JSON.stringify(counts));
  }, [counts]);

  // Audio click synthesizer
  const playClickSound = (isFinish = false) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (isFinish) {
        // Play a higher pitch double bell ring
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.setValueAtTime(1046, audioCtx.currentTime + 0.15); // C6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        // Play a warm woodblock click
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      }
    } catch (e) {
      console.warn("Web Audio API not supported or user gesture required", e);
    }
  };

  // Perform Haptic
  const triggerHaptic = (isFinish = false) => {
    if (!("vibrate" in navigator)) return;
    if (isFinish) {
      navigator.vibrate([150, 100, 150]);
    } else {
      navigator.vibrate(40);
    }
  };

  // Handle Increments
  const incrementCount = async () => {
    // Play button click animation
    controls.start({
      scale: [1, 0.92, 1.05, 1],
      transition: { duration: 0.2, ease: "easeInOut" }
    });

    const newCount = currentCount + 1;
    const isGoalReached = target > 0 && newCount === target;

    setCounts((prev) => ({
      ...prev,
      [currentDhikr.transliteration]: newCount
    }));

    if (isGoalReached) {
      playClickSound(true);
      triggerHaptic(true);
      toast.success(`Alhamdulillah, target ${target}x ${currentDhikr.transliteration} tercapai!`);
      
      addActivity({
        type: "tasbih",
        title: "Tasbih Selesai",
        description: `${target}x ${currentDhikr.transliteration}`
      });
    } else {
      playClickSound(false);
      triggerHaptic(false);
    }
  };

  // Reset current dhikr counter
  const resetCount = () => {
    if (window.confirm(`Reset hitungan untuk ${currentDhikr.transliteration}?`)) {
      setCounts((prev) => ({
        ...prev,
        [currentDhikr.transliteration]: 0
      }));
      toast.success("Hitungan di-reset");
    }
  };

  const getPercentage = () => {
    if (target === 0) return 0;
    return Math.min((currentCount / target) * 100, 100);
  };

  return (
    <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-6 flex flex-col items-center justify-between text-center relative overflow-hidden h-full">
      {/* Settings Bar */}
      <div className="w-full flex items-center justify-between border-b border-noor-divider pb-3 mb-4">
        {/* Goal Toggles */}
        <div className="flex bg-[#DABE9E]/30 rounded-xl p-0.5 border border-noor-divider">
          {[33, 99, 0].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                target === t
                  ? "bg-noor-light text-[#F6EFE4] shadow-sm"
                  : "text-[#7A5845]/70 hover:text-noor-dark"
              }`}
            >
              {t === 0 ? "Bebas" : `${t}x`}
            </button>
          ))}
        </div>

        {/* Audio Switches */}
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border border-noor-divider/60 transition-all duration-200 ${
              soundEnabled
                ? "bg-noor-gold/15 text-noor-light border-noor-gold/30"
                : "bg-white text-noor-textSecondary/40"
            }`}
            title="Suara"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Phrase Selection Dropdown */}
      <div className="w-full mb-4">
        <select
          value={selectedDhikrIndex}
          onChange={(e) => setSelectedDhikrIndex(Number(e.target.value))}
          className="w-full px-4 py-2.5 bg-white border border-noor-divider rounded-xl text-sm font-bold text-noor-dark focus:outline-none focus:border-noor-gold transition-colors shadow-sm"
        >
          {DHIKR_PHRASES.map((d, i) => (
            <option key={d.transliteration} value={i}>
              {d.transliteration} ({d.arabic})
            </option>
          ))}
        </select>
      </div>

      {/* Dhikr Displays */}
      <div className="flex-1 flex flex-col justify-center my-4 select-none">
        <h4 className="text-3xl font-extrabold text-noor-light font-arabic leading-relaxed">
          {currentDhikr.arabic}
        </h4>
        <p className="text-lg font-bold text-noor-dark mt-2 tracking-wide">
          {currentDhikr.transliteration}
        </p>
        <p className="text-xs text-noor-textSecondary italic mt-1 max-w-xs">
          "{currentDhikr.meaning}"
        </p>
      </div>

      {/* Main Clicking Bead */}
      <div className="relative my-6 flex items-center justify-center">
        {/* Ring progress border */}
        <svg className="w-48 h-48 absolute -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="82"
            className="stroke-[#E8D8BF]/40"
            strokeWidth="8"
            fill="transparent"
          />
          {target > 0 && (
            <motion.circle
              cx="96"
              cy="96"
              r="82"
              className="stroke-noor-gold"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 82}
              animate={{ strokeDashoffset: 2 * Math.PI * 82 * (1 - getPercentage() / 100) }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          )}
        </svg>

        {/* Squishy tapping circle */}
        <motion.button
          onClick={incrementCount}
          animate={controls}
          className="w-36 h-36 rounded-full bg-gradient-to-tr from-noor-dark to-noor-light text-[#F6EFE4] flex flex-col items-center justify-center shadow-noor-heavy border border-noor-gold/30 relative overflow-hidden group cursor-pointer focus:outline-none"
        >
          {/* subtle radial shine */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]"></div>
          
          <span className="text-4xl font-extrabold tracking-tight font-mono">{currentCount}</span>
          {target > 0 && (
            <span className="text-[10px] text-[#E8D8BF]/50 mt-1 uppercase tracking-widest font-semibold">
              Target: {target}
            </span>
          )}
        </motion.button>
      </div>

      {/* Action Bar */}
      <div className="w-full flex items-center justify-center mt-2 border-t border-noor-divider/50 pt-4">
        <button
          onClick={resetCount}
          className="flex items-center gap-1.5 px-4 py-2 hover:bg-red-500/10 text-red-700 hover:text-red-800 rounded-xl text-xs font-bold transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Hitungan</span>
        </button>
      </div>
    </div>
  );
}

export default TasbihPanel;
