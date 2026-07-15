import { useState, useEffect } from "react";
import { Bookmark, BookOpen, Sparkles, PenTool, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppSettings } from "../context/AppSettingsContext";

function BookmarkPage() {
  const [activeTab, setActiveTab] = useState("ayat"); // "ayat" | "doa" | "catatan"
  const { bookmarkedVerses, toggleBookmarkVerse } = useAppSettings();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const ayatBookmarks = bookmarkedVerses.filter(item => item.surahNomor !== "dua");
  const doaBookmarks = bookmarkedVerses.filter(item => item.surahNomor === "dua");

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = JSON.parse(localStorage.getItem("noor_notes")) || [];
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
                  <div key={`${bm.surahNomor}-${bm.nomorAyat}`} className="border border-noor-divider/60 rounded-xl p-5 hover:border-noor-gold/40 transition-colors relative group">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <Link to={`/surat/${bm.surahNomor}`} className="text-sm font-bold text-noor-gold bg-noor-gold/10 hover:bg-noor-gold/20 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                        <span>QS. {bm.surahName} • Ayat {bm.nomorAyat}</span>
                      </Link>
                      <button 
                        onClick={() => toggleBookmarkVerse(bm)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-arabic text-2xl text-right text-noor-dark leading-[2.2] mb-3">
                      {bm.teksArab}
                    </p>
                    <p className="text-left text-xs text-noor-gold font-medium italic mb-1.5">
                      {bm.teksLatin}
                    </p>
                    <p className="text-left text-xs text-noor-textSecondary leading-relaxed border-t border-noor-divider/25 pt-2.5">
                      {bm.teksIndonesia}
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
                  <div key={bm.nomorAyat} className="border border-noor-divider/60 rounded-xl p-5 hover:border-noor-gold/40 transition-colors relative">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-noor-dark text-base">{bm.title}</h3>
                      <button 
                        onClick={() => toggleBookmarkVerse(bm)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-arabic text-2xl text-right text-noor-dark leading-[2.2] mb-3">
                      {bm.arabic}
                    </p>
                    <p className="text-left text-xs text-noor-gold font-medium italic mb-1.5">
                      "{bm.transliteration}"
                    </p>
                    <p className="text-left text-xs text-noor-textSecondary leading-relaxed mb-3 border-t border-noor-divider/25 pt-2.5">
                      {bm.translation}
                    </p>
                    <div className="text-right">
                      <span className="inline-block text-[9px] font-bold text-noor-textSecondary/70 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        Sumber: {bm.reference}
                      </span>
                    </div>
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
