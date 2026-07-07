import { useState } from "react";
import { Search, Heart, Share2, Sparkles, BookMarked, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import duaData from "../data/dua.json";
import { useAppSettings } from "../context/AppSettingsContext";

function DailyDuaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { toggleBookmarkVerse, isVerseBookmarked } = useAppSettings();

  const categories = ["Semua", ...new Set(duaData.map(d => d.category))];

  const filteredDuas = duaData.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "Semua" || d.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleShare = (dua) => {
    if (navigator.share) {
      navigator.share({
        title: dua.title,
        text: `*${dua.title}*\n\n${dua.arabic}\n\n_${dua.transliteration}_\n\nArtinya: "${dua.translation}"\n\n[${dua.reference}]`,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`*${dua.title}*\n\n${dua.arabic}\n\n_${dua.transliteration}_\n\nArtinya: "${dua.translation}"\n\n[${dua.reference}]`);
      toast.success("Doa disalin ke clipboard!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-6 border border-noor-gold/25 shadow-noor-heavy relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 opacity-10 pointer-events-none">
           <Sparkles className="w-full h-full text-noor-gold" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-noor-gold" />
          Kumpulan Doa Harian
        </h2>
        <p className="text-[#E8D8BF]/80 text-xs md:text-sm max-w-xl font-medium mb-6">
          "Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu." (QS. Ghafir: 60)
        </p>

        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F6EFE4]/50" />
          <input 
            type="text"
            placeholder="Cari doa (misal: tidur, selamat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-noor-gold/30 rounded-xl text-sm font-medium text-[#F6EFE4] placeholder-[#F6EFE4]/40 focus:outline-none focus:border-noor-gold focus:ring-1 focus:ring-noor-gold transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-noor-divider/60 rounded-xl p-4 shadow-sm sticky top-6">
             <h3 className="text-xs font-bold text-noor-textSecondary uppercase tracking-wider mb-3 px-2">Kategori Doa</h3>
             <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-2 lg:pb-0 scrollbar-hide">
               {categories.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`flex-shrink-0 text-left px-3.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                     activeCategory === cat
                       ? "bg-noor-gold text-white shadow-md"
                       : "text-noor-dark hover:bg-noor-divider/30"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Duas List */}
        <div className="lg:col-span-3 space-y-5">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-noor-divider/50">
               <p className="text-noor-textSecondary font-medium">Doa tidak ditemukan.</p>
            </div>
          ) : (
            filteredDuas.map(dua => (
              <div key={dua.id} className="bg-white border border-noor-divider rounded-2xl shadow-sm hover:border-noor-gold/40 transition-all p-5 md:p-6 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-noor-gold bg-noor-gold/10 px-2 py-1 rounded-md uppercase tracking-wider mb-1.5 inline-block">
                      {dua.category}
                    </span>
                    <h3 className="font-extrabold text-noor-dark text-lg">{dua.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleBookmarkVerse({ surahNomor: "dua", nomorAyat: dua.id, text: dua.title })}
                      className={`p-2 border rounded-lg transition-colors ${isVerseBookmarked("dua", dua.id) ? "bg-noor-gold/10 border-noor-gold text-noor-gold" : "bg-noor-card border-noor-divider/50 text-noor-textSecondary hover:text-noor-gold"}`} 
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isVerseBookmarked("dua", dua.id) ? "fill-current" : ""}`} />
                    </button>
                    <button 
                      onClick={() => handleShare(dua)}
                      className="p-2 bg-noor-card border border-noor-divider/50 rounded-lg text-noor-textSecondary hover:text-noor-gold transition-colors" 
                      title="Bagikan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 mb-5">
                  <p className="font-arabic text-right text-2xl md:text-3xl leading-[2.2] text-noor-dark drop-shadow-sm px-2">
                    {dua.arabic}
                  </p>
                </div>

                <div className="bg-noor-card/30 p-4 rounded-xl border border-noor-divider/40 space-y-2">
                  <p className="text-sm text-noor-gold italic font-medium leading-relaxed">
                    "{dua.transliteration}"
                  </p>
                  <p className="text-sm text-noor-textSecondary leading-relaxed">
                    {dua.translation}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-noor-divider/30 text-right">
                  <span className="inline-block text-[11px] font-bold text-noor-textSecondary/70 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    Sumber: {dua.reference}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}

export default DailyDuaPage;
