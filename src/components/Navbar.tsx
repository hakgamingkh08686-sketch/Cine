import React from 'react';
import { Film, ShieldCheck, ShoppingBag, Search, PlusCircle, UserCheck } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  onOpenPurchases: () => void;
  unlockedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  setSearchTerm,
  isAdminMode,
  setIsAdminMode,
  onOpenPurchases,
  unlockedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsAdminMode(false)}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-300 bg-clip-text text-transparent">
              CineKhmer
            </h1>
            <p className="text-xs text-rose-400 font-medium tracking-wide">
              វេបសាយរឿងភាគ & QR បង់ប្រាក់
            </p>
          </div>
        </div>

        {/* Search Bar (Only in Viewer Mode) */}
        {!isAdminMode && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ស្វែងរករឿងភាគ, ប្រភេទ..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!isAdminMode && (
            <button
              onClick={onOpenPurchases}
              className="relative flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">រឿងបានទិញ</span>
              {unlockedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {unlockedCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md ${
              isAdminMode
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isAdminMode ? (
              <>
                <Film className="w-4 h-4" />
                <span>ទស្សនិកជន (Viewer)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>អ្នកគ្រប់គ្រង (Creator)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
