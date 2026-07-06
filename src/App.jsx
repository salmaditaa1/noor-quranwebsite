import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { AudioProvider } from "./context/AudioContext";

// Layout & Components
import Navbar from "./components/Layout/Navbar";
import AudioPlayer from "./components/Quran/AudioPlayer";

// Pages
import Dashboard from "./pages/Dashboard";
import QuranIndex from "./pages/QuranIndex";
import DetailSurat from "./pages/DetailSurat";
import Favorit from "./pages/Favorit";
import TasbihPage from "./pages/TasbihPage";

function App() {
  return (
    <AppSettingsProvider>
      <AudioProvider>
        <HashRouter>
          <div className="min-h-screen islamic-pattern flex flex-col md:flex-row relative">
            {/* Sidebar / Bottom Tab Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[285px] min-h-screen p-4 md:p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/quran" element={<QuranIndex />} />
                <Route path="/surat/:nomor" element={<DetailSurat />} />
                <Route path="/favorit" element={<Favorit />} />
                <Route path="/tasbih" element={<TasbihPage />} />
              </Routes>
            </main>

            {/* Global floating Audio Console */}
            <AudioPlayer />

            {/* Toast Notifications */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                className: "glass-panel text-noor-dark border border-noor-gold/30 rounded-xl font-sans text-sm font-bold shadow-noor-warm",
                duration: 3000,
                style: {
                  background: "#F6EFE4",
                  color: "#2C0F12",
                },
              }}
            />
          </div>
        </HashRouter>
      </AudioProvider>
    </AppSettingsProvider>
  );
}

export default App;