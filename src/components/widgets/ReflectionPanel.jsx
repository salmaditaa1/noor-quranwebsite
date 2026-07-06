import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, BookOpen, MessageSquare, Compass, Copy } from "lucide-react";
import toast from "react-hot-toast";

const FEELINGS = [
  { id: "grateful", label: "Bersyukur", emoji: "😊", color: "bg-green-500/10 text-green-700 border-green-500/25" },
  { id: "sad", label: "Sedih", emoji: "😔", color: "bg-blue-500/10 text-blue-700 border-blue-500/25" },
  { id: "anxious", label: "Cemas/Gelisah", emoji: "😰", color: "bg-orange-500/10 text-orange-700 border-orange-500/25" },
  { id: "motivation", label: "Butuh Motivasi", emoji: "💪", color: "bg-red-500/10 text-red-700 border-red-500/25" },
  { id: "peace", label: "Butuh Ketenangan", emoji: "🤲", color: "bg-purple-500/10 text-purple-700 border-purple-500/25" },
];

const RECOMMENDATIONS = {
  grateful: {
    verse: {
      ref: "QS. Ibrahim: 7",
      arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ",
      translation: "Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.",
      link: "/surat/14"
    },
    dua: {
      title: "Doa Syukur Nikmat",
      arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ",
      translation: "Ya Tuhanku, berilah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku."
    },
    dzikir: {
      phrase: "Alhamdulillah (ٱلْحَمْدُ لِلَّٰهِ)",
      count: "33x"
    }
  },
  sad: {
    verse: {
      ref: "QS. At-Tawbah: 40",
      arabic: "لَا تَحْزَنْ إِنَّ ٱللَّهَ مَعَنَا ۖ",
      translation: "Janganlah kamu bersedih, sesungguhnya Allah beserta kita.",
      link: "/surat/9"
    },
    dua: {
      title: "Doa Menghilangkan Kesedihan",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      translation: "Ya Allah, aku berlindung kepada-Mu dari rasa cemas dan kesedihan."
    },
    dzikir: {
      phrase: "La hawla wala quwwata illa billah (لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ)",
      count: "33x"
    }
  },
  anxious: {
    verse: {
      ref: "QS. Ar-Ra'd: 28",
      arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
      translation: "Ingatlah, hanya dengan mengingati Allah-lah hati menjadi tenteram.",
      link: "/surat/13"
    },
    dua: {
      title: "Doa Ketenangan Jiwa",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ نَفْسًا بِكَ مُطْمَئِنَّةً",
      translation: "Ya Allah, aku memohon kepada-Mu jiwa yang merasa tenang dengan-Mu."
    },
    dzikir: {
      phrase: "Astagfirullahal'adzim (أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ)",
      count: "33x"
    }
  },
  motivation: {
    verse: {
      ref: "QS. Al-Insyirah: 6",
      arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
      translation: "Sesungguhnya sesudah kesulitan itu ada kemudahan.",
      link: "/surat/94"
    },
    dua: {
      title: "Doa Kelapangan Dada",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      translation: "Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah untukku urusanku."
    },
    dzikir: {
      phrase: "La ilaha illallah (لَا إِلَٰهَ إِلَّا ٱللَّٰهُ)",
      count: "100x"
    }
  },
  peace: {
    verse: {
      ref: "QS. Al-Baqarah: 286",
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ",
      translation: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
      link: "/surat/2"
    },
    dua: {
      title: "Doa Memohon Perlindungan & Ketenangan",
      arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
      translation: "Wahai Yang Maha Hidup, Wahai Yang Berdiri Sendiri, dengan rahmat-Mu aku memohon pertolongan."
    },
    dzikir: {
      phrase: "Subhanallah wabihamdihi (سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ)",
      count: "33x"
    }
  }
};

function ReflectionPanel() {
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  const handleSelectFeeling = (feelingId) => {
    setSelectedFeeling(feelingId);

    // Save history to LocalStorage
    const history = JSON.parse(localStorage.getItem("noor-reflection-history")) || [];
    const entry = {
      feeling: feelingId,
      label: FEELINGS.find(f => f.id === feelingId).label,
      timestamp: Date.now()
    };
    history.push(entry);
    localStorage.setItem("noor-reflection-history", JSON.stringify(history));

    toast.success(`Terima kasih telah berbagi. Semoga Allah melapangkan hati Anda.`);
  };

  const rec = selectedFeeling ? RECOMMENDATIONS[selectedFeeling] : null;

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Teks berhasil disalin");
  };

  return (
    <div className="bg-noor-card border border-noor-divider shadow-noor-warm rounded-noor p-5 flex flex-col justify-between relative overflow-hidden h-full">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-noor-divider mb-4">
        <h3 className="font-bold text-noor-dark flex items-center gap-2 text-sm md:text-base">
          <Heart className="w-5 h-5 text-noor-gold" />
          Refleksi Hati
        </h3>
        <span className="text-[10px] bg-noor-gold/15 text-noor-light border border-noor-gold/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Fitur Tenang
        </span>
      </div>

      {/* Greeting and Question */}
      <div className="mb-4">
        <p className="text-xs text-noor-textSecondary font-bold uppercase tracking-wider">Apa kabarmu hari ini?</p>
        <p className="text-sm font-semibold text-noor-dark mt-0.5">Bagaimana kondisi perasaan hati Anda saat ini?</p>
      </div>

      {/* Feel Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-5">
        {FEELINGS.map((feel) => (
          <button
            key={feel.id}
            onClick={() => handleSelectFeeling(feel.id)}
            className={`p-3 rounded-xl border text-center transition-all duration-300 hover:scale-[1.03] ${
              selectedFeeling === feel.id
                ? "bg-noor-light text-white border-noor-light shadow-md"
                : `bg-white hover:bg-noor-gold/5 ${feel.color}`
            }`}
          >
            <span className="text-2xl block mb-1">{feel.emoji}</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">{feel.label}</span>
          </button>
        ))}
      </div>

      {/* Recommendations Display */}
      <AnimatePresence mode="wait">
        {rec && (
          <motion.div
            key={selectedFeeling}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white/40 border border-noor-divider/60 rounded-xl p-4 space-y-4"
          >
            {/* Verse recommendation */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-noor-gold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Ayat Penenang Hati
              </span>
              <div className="p-3 bg-noor-card/50 rounded-lg border border-noor-divider/30 text-right">
                <p className="font-arabic text-xl text-noor-dark leading-relaxed mb-1.5">{rec.verse.arabic}</p>
                <p className="text-left text-xs font-semibold text-noor-textSecondary italic">"{rec.verse.translation}"</p>
                <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-noor-divider/25">
                  <span className="text-[9px] font-bold text-noor-gold font-sans">{rec.verse.ref}</span>
                  <Link
                    to={rec.verse.link}
                    className="text-[9px] bg-noor-light hover:bg-[#2C0F12] text-[#F6EFE4] px-2 py-1 rounded font-bold transition-colors"
                  >
                    Buka Surat
                  </Link>
                </div>
              </div>
            </div>

            {/* Dua recommendation */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-noor-gold uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> {rec.dua.title}
              </span>
              <div className="p-3 bg-noor-card/50 rounded-lg border border-noor-divider/30">
                <p className="font-arabic text-right text-lg text-noor-dark leading-relaxed mb-1.5">{rec.dua.arabic}</p>
                <p className="text-left text-[11px] font-medium text-[#7A5845]/90">"{rec.dua.translation}"</p>
                <button
                  onClick={() => copyText(`${rec.dua.arabic}\n\n"${rec.dua.translation}"`)}
                  className="flex items-center gap-1 text-[9px] font-bold text-noor-light hover:text-noor-dark mt-2.5"
                >
                  <Copy className="w-3 h-3" /> Salin Doa
                </button>
              </div>
            </div>

            {/* Dhikr recommendation */}
            <div className="flex items-center justify-between p-3 bg-noor-gold/10 border border-noor-gold/25 rounded-lg text-xs font-bold text-noor-dark">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-noor-gold" />
                Dzikir Relevan: {rec.dzikir.phrase}
              </span>
              <span className="bg-noor-light text-white px-2 py-0.5 rounded text-[10px]">{rec.dzikir.count}</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default ReflectionPanel;
