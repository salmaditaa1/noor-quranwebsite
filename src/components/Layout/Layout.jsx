import Navbar from "./Navbar";
import AudioPlayer from "../Quran/AudioPlayer";

const TopLeftOrnament = () => (
  <svg
    className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 text-noor-gold/10 opacity-[0.07] pointer-events-none z-0"
    viewBox="0 0 100 100"
    fill="currentColor"
  >
    <path d="M0,0 L0,100 L4,100 L4,4 L100,4 L100,0 Z" />
    <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M0,40 Q40,40 40,0 Q35,35 0,40 Z" />
    <path d="M0,60 Q60,60 60,0 Q50,50 0,60 Z" />
    <polygon points="10,10 15,30 30,15" />
    <polygon points="5,5 8,18 18,8" />
  </svg>
);

const BottomRightOrnament = () => (
  <svg
    className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 text-noor-gold/10 opacity-[0.07] pointer-events-none z-0 rotate-180"
    viewBox="0 0 100 100"
    fill="currentColor"
  >
    <path d="M0,0 L0,100 L4,100 L4,4 L100,4 L100,0 Z" />
    <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M0,40 Q40,40 40,0 Q35,35 0,40 Z" />
    <path d="M0,60 Q60,60 60,0 Q50,50 0,60 Z" />
    <polygon points="10,10 15,30 30,15" />
  </svg>
);

const MihrabBackdrop = () => (
  <div className="absolute inset-x-0 top-0 h-[600px] pointer-events-none overflow-hidden z-0 select-none opacity-[0.04]">
    <svg className="w-full h-full text-noor-light" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path
        d="M 0,0 L 1000,0 L 1000,600 Q 800,200 500,200 Q 200,200 0,600 Z"
        fill="currentColor"
      />
      <path
        d="M 50,0 L 950,0 L 950,550 Q 800,250 500,250 Q 200,250 50,550 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  </div>
);

function Layout({ children }) {
  return (
    <div className="min-h-screen islamic-pattern flex flex-col md:flex-row relative overflow-x-hidden bg-[#DABE9E] selection:bg-noor-gold/30 isolate" style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
      <TopLeftOrnament />
      <BottomRightOrnament />
      <MihrabBackdrop />

      <Navbar />

      <main className="flex-1 md:ml-[285px] min-h-screen p-3 sm:p-4 md:p-8 overflow-x-hidden overflow-y-auto overscroll-contain z-10 flex flex-col justify-between min-w-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="w-full">
          {children}
        </div>
        
        <div className="w-full flex items-center justify-center gap-4 my-8 opacity-25 select-none pointer-events-none">
          <div className="h-[1px] bg-gradient-to-r from-transparent to-noor-gold flex-1"></div>
          <span className="font-arabic text-noor-gold text-lg">✦ ۞ ✦</span>
          <div className="h-[1px] bg-gradient-to-l from-transparent to-noor-gold flex-1"></div>
        </div>
      </main>

      <AudioPlayer />
    </div>
  );
}

export default Layout;
