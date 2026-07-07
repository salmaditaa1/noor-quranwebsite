import { Suspense, lazy, useState, useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

// Context Providers
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { AudioProvider } from "./context/AudioContext";
import { ActivityProvider } from "./context/ActivityContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout & Components
import Navbar from "./components/Layout/Navbar";
import AudioPlayer from "./components/Quran/AudioPlayer";
import PageTransition from "./components/Layout/PageTransition";
import Loader from "./components/Common/Loader";
import AzanReminder from "./components/PrayerTimes/AzanReminder";

// Lazy-loaded Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const QuranIndex = lazy(() => import("./pages/QuranIndex"));
const DetailSurat = lazy(() => import("./pages/DetailSurat"));
const Favorit = lazy(() => import("./pages/Favorit"));
const TasbihPage = lazy(() => import("./pages/TasbihPage"));
const PrayerPage = lazy(() => import("./pages/PrayerPage"));
const QiblaPage = lazy(() => import("./pages/QiblaPage"));
const AzanSettings = lazy(() => import("./pages/AzanSettings"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const DzikirPage = lazy(() => import("./pages/DzikirPage"));
const DailyDuaPage = lazy(() => import("./pages/DailyDuaPage"));
const BookmarkPage = lazy(() => import("./pages/BookmarkPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HijriCalendarPage = lazy(() => import("./pages/HijriCalendarPage"));

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!user ? (
          <>
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><LoginPage /></PageTransition>} />
          </>
        ) : (
          <>
            <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/quran" element={<PageTransition><QuranIndex /></PageTransition>} />
            <Route path="/surat/:nomor" element={<PageTransition><DetailSurat /></PageTransition>} />
            <Route path="/favorit" element={<PageTransition><Favorit /></PageTransition>} />
            <Route path="/tasbih" element={<PageTransition><TasbihPage /></PageTransition>} />
            <Route path="/prayer" element={<PageTransition><PrayerPage /></PageTransition>} />
            <Route path="/calendar" element={<PageTransition><HijriCalendarPage /></PageTransition>} />
            <Route path="/qibla" element={<PageTransition><QiblaPage /></PageTransition>} />
            <Route path="/azan-settings" element={<PageTransition><AzanSettings /></PageTransition>} />
            <Route path="/dzikir" element={<PageTransition><DzikirPage /></PageTransition>} />
            <Route path="/dua" element={<PageTransition><DailyDuaPage /></PageTransition>} />
            <Route path="/bookmark" element={<PageTransition><BookmarkPage /></PageTransition>} />
            <Route path="/progress" element={<PageTransition><ProgressPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="*" element={<PageTransition><ComingSoon title="Halaman Tidak Ditemukan" /></PageTransition>} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

function MainApp() {
  const { user } = useAuth();
  
  return (
    <>
      {user && <AzanReminder />}
      <div className={`min-h-screen flex flex-col md:flex-row relative bg-noor-bg text-noor-dark transition-colors duration-500`}>
        <div className="absolute inset-0 islamic-pattern opacity-10 pointer-events-none z-0"></div>
        {/* Sidebar / Bottom Tab Navigation */}
        {user && <Navbar />}

        {/* Main Content Area */}
        <main className={`flex-1 ${user ? "md:ml-[285px]" : ""} min-h-screen p-4 md:p-8 overflow-y-auto overflow-x-hidden relative`}>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader label="Memuat..." /></div>}>
            <AnimatedRoutes />
          </Suspense>
        </main>

        {/* Global floating Audio Console */}
        {user && <AudioPlayer />}

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
    </>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem("noor-preferences"));
    return prefs?.theme || "cream";
  });

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.className = `theme-${theme}`;

    const handleThemeChange = () => {
      const prefs = JSON.parse(localStorage.getItem("noor-preferences"));
      if (prefs?.theme) {
        setTheme(prefs.theme);
        document.documentElement.className = `theme-${prefs.theme}`;
      }
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, [theme]);

  return (
    <AuthProvider>
      <ActivityProvider>
        <AppSettingsProvider>
          <AudioProvider>
            <HashRouter>
              <MainApp />
            </HashRouter>
          </AudioProvider>
        </AppSettingsProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}

export default App;