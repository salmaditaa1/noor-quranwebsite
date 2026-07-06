import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, Volume2, User, X, Clock, HelpCircle, List } from "lucide-react";
import { useAudio, RECITERS } from "../../context/AudioContext";

function AudioPlayer() {
  const {
    activeSurah,
    isPlaying,
    loading,
    duration,
    seekPosition,
    playbackRate,
    togglePlay,
    stopAudio,
    seek,
    changeReciter,
    changePlaybackRate,
    activeReciter
  } = useAudio();

  const [showReciterList, setShowReciterList] = useState(false);

  if (!activeSurah) return null;

  // Helper to format seconds to MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSliderChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  const currentReciterName = RECITERS.find((r) => r.id === activeReciter)?.name || "Qari";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed bottom-[64px] md:bottom-0 left-0 md:left-[285px] right-0 z-40 p-4 border-t border-noor-gold/30 glass-panel-dark shadow-noor-heavy"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Panel: Track Info & Visualizer */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            {/* Visualizer animation bars */}
            <div className="w-8 h-8 rounded-lg bg-noor-gold/15 flex items-center justify-center gap-0.5 border border-noor-gold/35 flex-shrink-0">
              {isPlaying && !loading ? (
                <>
                  <div className="w-1 rounded-sm bg-noor-gold visualizer-bar"></div>
                  <div className="w-1 rounded-sm bg-noor-gold visualizer-bar"></div>
                  <div className="w-1 rounded-sm bg-noor-gold visualizer-bar"></div>
                  <div className="w-1 rounded-sm bg-noor-gold visualizer-bar"></div>
                </>
              ) : (
                <Volume2 className="w-4 h-4 text-noor-gold" />
              )}
            </div>
            
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white tracking-wide truncate">
                QS. {activeSurah.namaLatin} ({activeSurah.nama})
              </h4>
              <p className="text-[10px] text-[#E8D8BF]/70 font-semibold tracking-wide flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3 text-noor-gold" />
                <span>{currentReciterName}</span>
              </p>
            </div>

            {/* Spinner indicator when loading */}
            {loading && (
              <div className="w-4 h-4 border-2 border-noor-gold border-t-transparent rounded-full animate-spin ml-2"></div>
            )}
          </div>

          {/* Middle Panel: Scrubber & Controls */}
          <div className="flex-1 flex flex-col items-center gap-1.5 w-full max-w-xl">
            {/* Slider & Times */}
            <div className="w-full flex items-center gap-3 text-[11px] font-mono text-[#E8D8BF]/80 font-bold select-none">
              <span>{formatTime(seekPosition)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={seekPosition}
                onChange={handleSliderChange}
                disabled={loading}
                className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-noor-gold focus:outline-none"
              />
              <span>{formatTime(duration)}</span>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center gap-4">
              {/* Playback speed toggle */}
              <button
                onClick={() => {
                  const rates = [1, 1.25, 1.5, 2];
                  const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
                  changePlaybackRate(rates[nextIdx]);
                }}
                className="px-2.5 py-1 text-[10px] font-bold bg-white/5 hover:bg-white/15 border border-[#E8D8BF]/20 rounded-lg text-noor-gold transition-all"
                title="Kecepatan Putar"
              >
                {playbackRate}x
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-noor-gold text-noor-dark flex items-center justify-center hover:scale-105 hover:bg-[#F6EFE4] transition-all shadow-md focus:outline-none disabled:opacity-50"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 stroke-[3px]" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Stop */}
              <button
                onClick={stopAudio}
                className="p-2.5 rounded-full bg-white/5 hover:bg-red-500/25 border border-[#E8D8BF]/10 hover:border-red-500/40 text-red-400 transition-all focus:outline-none"
                title="Hentikan Audio"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>

              {/* Toggle Qari button */}
              <button
                onClick={() => setShowReciterList(!showReciterList)}
                className={`p-2.5 rounded-full border transition-all ${
                  showReciterList
                    ? "bg-noor-gold text-noor-dark border-noor-gold"
                    : "bg-white/5 text-[#E8D8BF] border-white/10 hover:bg-white/10"
                }`}
                title="Pilih Qari"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Close button */}
          <div className="hidden md:block">
            <button
              onClick={stopAudio}
              className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Dynamic Reciter List overlay */}
        {showReciterList && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 md:bottom-28 right-4 md:right-8 bg-[#2C0F12] border border-noor-gold/30 rounded-xl p-3 w-[260px] shadow-noor-heavy"
          >
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-noor-gold/20">
              <span className="text-xs font-bold text-noor-gold tracking-wider uppercase">Pilih Reciter (Qari)</span>
              <button onClick={() => setShowReciterList(false)} className="text-white/40 hover:text-white text-xs">
                Tutup
              </button>
            </div>
            
            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
              {RECITERS.map((reciter) => {
                const active = reciter.id === activeReciter;
                return (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      changeReciter(reciter.id);
                      setShowReciterList(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                      active
                        ? "bg-noor-gold text-noor-dark font-bold"
                        : "text-[#E8D8BF] hover:bg-white/5"
                    }`}
                  >
                    <p className="font-semibold">{reciter.name}</p>
                    <p className={`text-[9px] mt-0.5 ${active ? "text-noor-dark/70" : "text-[#E8D8BF]/50"}`}>
                      {reciter.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AudioPlayer;
