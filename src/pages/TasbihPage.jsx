import TasbihPanel from "../components/Tasbih/TasbihPanel";

function TasbihPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-noor-dark to-noor-light text-[#F6EFE4] rounded-noor p-5 mb-6 border border-noor-gold/20 shadow-noor-warm text-center relative overflow-hidden">
        <h2 className="text-xl font-bold tracking-wide">Tasbih Digital</h2>
        <p className="text-[#E8D8BF]/70 text-xs mt-1">
          Lantunkan dzikir harian Anda untuk membersihkan hati dan menenangkan jiwa.
        </p>
      </div>

      <div className="h-[550px]">
        <TasbihPanel />
      </div>
    </div>
  );
}

export default TasbihPage;
