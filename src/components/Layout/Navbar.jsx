import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Clock,
  Compass,
  Sparkles,
  Bookmark,
  Heart,
  BarChart3,
  User,
  Info
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/quran", label: "Al-Qur'an", icon: BookOpen },
  { path: "/prayer", label: "Jadwal Sholat", icon: Clock },
  { path: "/dzikir", label: "Dzikir & Tasbih", icon: Compass },
  { path: "/dua", label: "Doa Harian", icon: Sparkles },
  { path: "/bookmark", label: "Bookmark & Catatan", icon: Bookmark },
  { path: "/favorit", label: "Favorit Saya", icon: Heart },
  { path: "/progress", label: "Analisis Progress", icon: BarChart3 },
  { path: "/profile", label: "Profil & Preferensi", icon: User },
];

const MOBILE_NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/quran", label: "Qur'an", icon: BookOpen },
  { path: "/prayer", label: "Sholat", icon: Clock },
  { path: "/dzikir", label: "Dzikir", icon: Compass },
  { path: "/profile", label: "Profil", icon: User },
];

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[285px] fixed top-0 left-0 h-screen bg-noor-dark text-[#F6EFE4] p-5 border-r border-noor-gold/20 shadow-noor-heavy z-20 overflow-y-auto scrollbar-thin">
        {/* Brand Header */}
        <div className="mb-8 mt-2 relative flex-shrink-0">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-radial-gradient from-noor-gold/10 to-transparent pointer-events-none rounded-full blur-xl"></div>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-noor-gold to-noor-light flex items-center justify-center shadow-md border border-noor-gold/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-[#F6EFE4] font-arabic">ن</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-noor-gold to-[#F6EFE4] bg-clip-text text-transparent">
                Noor
              </h1>
              <p className="text-[10px] text-[#E8D8BF]/60 tracking-wider">ISLAMIC COMPANION</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link key={item.path} to={item.path} className="relative block">
                <div
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-noor transition-all duration-300 ${
                    active
                      ? "text-noor-dark font-semibold"
                      : "text-[#E8D8BF]/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Active Indicator slide-in */}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-noor-gold to-[#F6EFE4] rounded-noor -z-10 shadow-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={`w-4.5 h-4.5 transition-transform duration-300 ${active ? "scale-110" : ""}`} />
                  <span className="text-xs tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-4 border-t border-noor-gold/10 text-[10px] text-[#E8D8BF]/40 flex flex-col gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3 text-noor-gold/60" />
            <span>Versi 1.1.0 — Pro Edition</span>
          </div>
          <p>© {new Date().getFullYear()} Noor App. Semoga bermanfaat.</p>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-noor-gold/20 shadow-noor-heavy z-30 px-3 pb-safe flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path} className="relative py-1 flex flex-col items-center justify-center flex-1">
              <div className={`p-1.5 rounded-full relative flex items-center justify-center ${active ? "text-noor-light" : "text-[#7A5845]/70"}`}>
                {active && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute inset-0 bg-noor-gold/15 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${active ? "scale-110 stroke-[2.5px]" : "stroke-2"}`} />
              </div>
              <span className={`text-[9px] tracking-wide mt-0.5 ${active ? "text-noor-light font-bold" : "text-[#7A5845]/60 font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Navbar;
