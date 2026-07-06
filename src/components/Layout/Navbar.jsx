import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, Heart, Compass, Info } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/quran", label: "Al-Qur'an", icon: BookOpen },
  { path: "/favorit", label: "Favorit", icon: Heart },
  { path: "/tasbih", label: "Tasbih", icon: Compass },
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
      <aside className="hidden md:flex flex-col w-[285px] fixed top-0 left-0 h-screen bg-noor-dark text-[#F6EFE4] p-6 border-r border-noor-gold/20 shadow-noor-heavy z-20">
        {/* Brand Header */}
        <div className="mb-10 mt-4 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-radial-gradient from-noor-gold/10 to-transparent pointer-events-none rounded-full blur-xl"></div>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-noor-gold to-noor-light flex items-center justify-center shadow-md border border-noor-gold/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-[#F6EFE4] font-arabic">ن</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-noor-gold to-[#F6EFE4] bg-clip-text text-transparent">
                Noor
              </h1>
              <p className="text-xs text-[#E8D8BF]/60 tracking-wider">ISLAMIC COMPANION</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link key={item.path} to={item.path} className="relative block">
                <div
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-noor transition-all duration-300 ${
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
                  
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? "scale-110" : ""}`} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto pt-6 border-t border-noor-gold/10 text-xs text-[#E8D8BF]/40 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-noor-gold/60" />
            <span>Versi 1.0.0 — Premium</span>
          </div>
          <p>© {new Date().getFullYear()} Noor App. Semoga barokah.</p>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-noor-gold/20 shadow-noor-heavy z-30 px-4 pb-safe flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path} className="relative py-1 flex flex-col items-center justify-center flex-1">
              <div className={`p-2 rounded-full relative flex items-center justify-center ${active ? "text-noor-light" : "text-[#7A5845]/70"}`}>
                {active && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute inset-0 bg-noor-gold/15 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${active ? "scale-110 stroke-[2.5px]" : "stroke-2"}`} />
              </div>
              <span className={`text-[10px] tracking-wide mt-0.5 ${active ? "text-noor-light font-bold" : "text-[#7A5845]/60 font-medium"}`}>
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
