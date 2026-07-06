import { useState, useEffect } from "react";
import { Bookmark, BookOpen, Sparkles, PenTool, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function BookmarkPage() {
  const [activeTab, setActiveTab] = useState("ayat"); // "ayat" | "doa" | "catatan"

  const [ayatBookmarks, setAyatBookmarks] = useState([]);
  const [doaBookmarks, setDoaBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Load data from localStorage (dummy initial for demonstration if empty)
    const savedAyat = JSON.parse(localStorage.getItem("noor_ayat_bookmarks")) || [
      { id: 1, surah: "Al-Fatihah", number: 1, verse: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", date: "2026-06-12" }
    ];
    const savedDoa = JSON.parse(localStorage.getItem("noor_doa_bookmarks")) || [];
    const savedNotes = JSON.parse(localStorage.getItem("noor_notes")) || [];

    setAyatBookmarks(savedAyat);
    setDoaBookmarks(savedDoa);
    setNotes(savedNotes);
  }, []);

  const saveNotes = (updated) => {
    setNotes(updated);
    localStorage.setItem("noor_notes", JSON.stringify(updated));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
    };
    
    saveNotes([note, ...notes]);
    setNewNote("");
    toast.success("Catatan ditambahkan");
  };

  const handleDeleteNote = (id) => {
    saveNotes(notes.filter(n => n.id !== id));
    toast.success("Catatan dihapus");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-6 md:p-8 mb-6 border border-noor-gold/25 shadow-noor-heavy relative overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide font-sans mb-2 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-noor-gold" />
          Bookmark & Catatan
        </h2>
        <p className="text-[#E8D8BF]/70 text-xs md:text-sm max-w-xl font-medium mb-6">
          Simpan ayat, doa pilihan, dan tuliskan refleksi spiritual Anda sebagai pengingat harian.
        </p>

        {/* Tabs */}
        <div className="flex bg-black/20 p-1.5 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab("ayat")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "ayat" ? "bg-noor-gold text-white shadow-sm" : "text-[#E8D8BF] hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Ayat
          </button>
          <button
            onClick={() => setActiveTab("doa")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "doa" ? "bg-noor-gold text-white shadow-sm" : "text-[#E8D8BF] hover:bg-white/10"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Doa
          </button>
          <button
            onClick={() => setActiveTab("catatan")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === "catatan" ? "bg-noor-gold text-white shadow-sm" : "text-[#E8D8BF] hover:bg-white/10"
            }`}
          >
            <PenTool className="w-4 h-4" /> Catatan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-noor-divider shadow-sm min-h-[400px] p-6">
        
        {/* Tab: Ayat */}
        {activeTab === "ayat" && (
          <div>
            {ayatBookmarks.length === 0 ? (
              <p className="text-center text-noor-textSecondary py-10 font-medium">Belum ada ayat yang disimpan.</p>
            ) : (
              <div className="space-y-4">
                {ayatBookmarks.map((bm) => (
                  <div key={bm.id} className="border border-noor-divider/60 rounded-xl p-5 hover:border-noor-gold/40 transition-colors relative group">
                    <Link to={`/surat/${bm.number}`} className="absolute inset-0 z-0"></Link>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <span className="text-sm font-bold text-noor-gold bg-noor-gold/10 px-3 py-1 rounded-full">
                        {bm.surah} • Ayat {bm.verse}
                      </span>
                      <span className="text-xs text-noor-textSecondary font-medium">Ditambahkan: {bm.date}</span>
                    </div>
                    <p className="font-arabic text-2xl text-right text-noor-dark leading-relaxed relative z-10">
                      {bm.arabic}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Doa */}
        {activeTab === "doa" && (
          <div>
            {doaBookmarks.length === 0 ? (
              <p className="text-center text-noor-textSecondary py-10 font-medium">Belum ada doa yang difavoritkan.</p>
            ) : (
              <div className="space-y-4">
                {doaBookmarks.map((bm) => (
                  <div key={bm.id} className="border border-noor-divider/60 rounded-xl p-5 hover:border-noor-gold/40 transition-colors">
                    <h3 className="font-bold text-noor-dark mb-2">{bm.title}</h3>
                    <p className="text-sm text-noor-textSecondary">{bm.translation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Catatan */}
        {activeTab === "catatan" && (
          <div>
            <form onSubmit={handleAddNote} className="mb-8">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Tuliskan refleksi, rasa syukur, atau doa pribadi Anda hari ini..."
                className="w-full h-28 p-4 bg-noor-card border border-noor-divider rounded-xl text-sm font-medium focus:outline-none focus:border-noor-gold focus:ring-1 focus:ring-noor-gold resize-none text-noor-dark placeholder-noor-textSecondary/50"
              />
              <div className="flex justify-end mt-3">
                <button 
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-6 py-2 bg-noor-gold text-white rounded-lg font-bold text-sm hover:bg-noor-dark transition-colors disabled:opacity-50"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-center text-noor-textSecondary py-6 font-medium text-sm border-t border-dashed border-noor-divider">
                  Buku catatan masih kosong.
                </p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-[#fcfaf7] border border-noor-divider/60 rounded-xl p-5 relative group">
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-noor-dark leading-relaxed whitespace-pre-wrap pr-8">{note.text}</p>
                    <span className="text-[10px] text-noor-textSecondary font-bold mt-4 block uppercase tracking-wider">
                      {note.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookmarkPage;
