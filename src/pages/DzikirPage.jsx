import { useState } from "react";
import { List, CheckCircle, RotateCcw } from "lucide-react";
import dzikirData from "../data/dzikir.json";
import TasbihPanel from "../components/Tasbih/TasbihPanel";
import { useActivity } from "../context/ActivityContext";

function DzikirPage() {
  const [activeTab, setActiveTab] = useState("dzikir"); // "dzikir" | "tasbih"
  const [activeCategory, setActiveCategory] = useState("Pagi");
  const [counters, setCounters] = useState({});

  const categories = [...new Set(dzikirData.map(d => d.category))];
  const currentDzikir = dzikirData.filter(d => d.category === activeCategory);
  const { addActivity } = useActivity();

  const incrementCounter = (id, max) => {
    setCounters(prev => {
      const current = prev[id] || 0;
      if (current < max) {
        const nextCount = current + 1;
        if (nextCount === max) {
          const item = dzikirData.find(d => d.id === id);
          addActivity({
            type: "dzikir",
            title: "Dzikir Selesai",
            description: `Menyelesaikan ${item.title}`
          });
        }
        return { ...prev, [id]: nextCount };
      }
      return prev;
    });
  };

  const resetCounter = (id) => {
    setCounters(prev => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      
      {/* Header & Tab Selector */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-6 border border-noor-gold/25 shadow-noor-heavy relative overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans mb-2">
          Dzikir & Tasbih
        </h2>
        <p className="text-[#E8D8BF]/70 text-xs md:text-sm max-w-xl font-medium mb-6">
          "Ingatlah, hanya dengan mengingat Allah-lah hati menjadi tenteram." (QS. Ar-Ra'd: 28)
        </p>

        <div className="flex bg-black/20 p-1.5 rounded-xl max-w-sm">
          <button
            onClick={() => setActiveTab("dzikir")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === "dzikir" ? "bg-noor-gold text-white shadow-sm" : "text-[#E8D8BF] hover:bg-white/10"
            }`}
          >
            Bacaan Dzikir
          </button>
          <button
            onClick={() => setActiveTab("tasbih")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === "tasbih" ? "bg-noor-gold text-white shadow-sm" : "text-[#E8D8BF] hover:bg-white/10"
            }`}
          >
            Tasbih Digital
          </button>
        </div>
      </div>

      {activeTab === "dzikir" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Categories */}
          <div className="md:col-span-1 space-y-2 flex overflow-x-auto md:block pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
                  activeCategory === cat
                    ? "bg-noor-gold text-white border-noor-gold shadow-md"
                    : "bg-white text-noor-textSecondary border-noor-divider/50 hover:border-noor-gold/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dzikir List */}
          <div className="md:col-span-3 space-y-4">
            {currentDzikir.map((item) => {
              const currentCount = counters[item.id] || 0;
              const isDone = currentCount >= item.count;

              return (
                <div 
                  key={item.id} 
                  className={`bg-white border p-5 md:p-6 rounded-2xl shadow-sm transition-all duration-300 ${
                    isDone ? "border-green-400 bg-green-50/30 ring-1 ring-green-400/20" : "border-noor-divider hover:border-noor-gold/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-noor-dark text-lg flex items-center gap-2">
                      {item.title}
                      {isDone && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </h3>
                    <span className="text-[10px] bg-noor-gold/15 text-noor-dark px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                      {item.count}x
                    </span>
                  </div>

                  <p className="font-arabic text-right text-2xl md:text-3xl leading-relaxed text-noor-dark mb-4 drop-shadow-sm">
                    {item.arabic}
                  </p>
                  
                  <div className="space-y-2 mb-5 bg-noor-card/50 p-4 rounded-xl border border-noor-divider/30">
                    <p className="text-sm text-noor-gold italic leading-relaxed">
                      "{item.transliteration}"
                    </p>
                    <p className="text-sm text-noor-textSecondary leading-relaxed font-medium">
                      {item.translation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-noor-divider/50 pt-4">
                    <p className="text-xs text-noor-textSecondary/70 font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      Ref: {item.reference}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => resetCounter(item.id)}
                        className="p-2 text-noor-textSecondary/50 hover:text-noor-dark hover:bg-noor-divider/50 rounded-full transition-colors"
                        title="Reset"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => incrementCounter(item.id, item.count)}
                        disabled={isDone}
                        className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          isDone 
                            ? "bg-green-100 text-green-600 cursor-not-allowed" 
                            : "bg-noor-gold text-white hover:bg-noor-dark hover:-translate-y-0.5 shadow-md"
                        }`}
                      >
                        {isDone ? "Selesai" : "Baca"}
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] ${isDone ? "bg-green-200" : "bg-white/20"}`}>
                          {currentCount}/{item.count}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto h-[600px] border border-noor-divider rounded-3xl overflow-hidden shadow-noor-sm">
          <TasbihPanel />
        </div>
      )}

    </div>
  );
}

export default DzikirPage;
