import React, { useState } from 'react';
import { initialSeriesList, initialCreatorSettings, initialOrders } from './data/mockData';
import { Series, Episode, Order, CreatorSettings } from './types';
import { Navbar } from './components/Navbar';
import { SeriesCard } from './components/SeriesCard';
import { SeriesDetailModal } from './components/SeriesDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PaymentModal } from './components/PaymentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MyPurchasesModal } from './components/MyPurchasesModal';
import { Film, ShieldCheck, Sparkles, Tv, PlayCircle, QrCode } from 'lucide-react';

export default function App() {
  const [seriesList, setSeriesList] = useState<Series[]>(() => {
    const saved = localStorage.getItem('cinekhmer_series_list');
    return saved ? JSON.parse(saved) : initialSeriesList;
  });

  const [creatorSettings, setCreatorSettings] = useState<CreatorSettings>(() => {
    const saved = localStorage.getItem('cinekhmer_creator_settings');
    return saved ? JSON.parse(saved) : initialCreatorSettings;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cinekhmer_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  
  // Unlocked series IDs (by default series-1 is unlocked for demo or empty)
  const [unlockedSeriesIds, setUnlockedSeriesIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cinekhmer_unlocked_ids');
    return saved ? JSON.parse(saved) : ['series-1'];
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ទាំងអស់');

  // Modals state
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [paymentSeries, setPaymentSeries] = useState<Series | null>(null);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState<boolean>(false);

  // Sync to localStorage
  React.useEffect(() => {
    localStorage.setItem('cinekhmer_series_list', JSON.stringify(seriesList));
  }, [seriesList]);

  React.useEffect(() => {
    localStorage.setItem('cinekhmer_creator_settings', JSON.stringify(creatorSettings));
  }, [creatorSettings]);

  React.useEffect(() => {
    localStorage.setItem('cinekhmer_orders', JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    localStorage.setItem('cinekhmer_unlocked_ids', JSON.stringify(unlockedSeriesIds));
  }, [unlockedSeriesIds]);

  // Filter series based on search & genre
  const filteredSeries = seriesList.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'ទាំងអស់' || s.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const genres = ['ទាំងអស់', 'រឿងមនោសញ្ចេតនា', 'រឿងអាថ៌កំបាំង', 'រឿងក្បាច់គុន', 'រន្ធត់'];

  const handlePaymentSuccess = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    if (!unlockedSeriesIds.includes(newOrder.seriesId)) {
      setUnlockedSeriesIds([...unlockedSeriesIds, newOrder.seriesId]);
    }
    setPaymentSeries(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onOpenPurchases={() => setIsPurchasesOpen(true)}
        unlockedCount={unlockedSeriesIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminMode ? (
          <AdminDashboard
            seriesList={seriesList}
            setSeriesList={setSeriesList}
            orders={orders}
            creatorSettings={creatorSettings}
            setCreatorSettings={setCreatorSettings}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            
            {/* Hero Banner Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-12 shadow-2xl">
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-rose-600/20 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> វេបសាយរឿងភាគអនឡាញ (KHQR Payment)
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  ទស្សនារឿងភាគដែលលោកអ្នកពេញចិត្ត ដោយសេរី ៥ ភាគដំបូង!
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  ងាយស្រួលទស្សនា និងបង់ប្រាក់តាម QR Code (ABA / KHQR) យ៉ាងឆាប់រហ័ស។ ដោះសោររឿងពេញត្រឹមតែ ១ ចុចប៉ុណ្ណោះ។
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (seriesList.length > 0) setSelectedSeries(seriesList[0]);
                    }}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5 fill-current" />
                    <span>ទស្សនារឿងល្បីឥឡូវនេះ</span>
                  </button>
                  <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-300">
                    <QrCode className="w-5 h-5 text-rose-400" />
                    <span>ស្កេនបង់ប្រាក់ទូទាត់ស្វ័យប្រវត្តិ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGenre === g
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Series Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-rose-500" />
                  <span>បញ្ជីរឿងភាគពេញនិយម</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  បង្ហាញ {filteredSeries.length} រឿង
                </span>
              </div>

              {filteredSeries.length === 0 ? (
                <div className="py-16 text-center bg-slate-900/50 rounded-3xl border border-slate-800">
                  <Film className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-base font-semibold text-slate-300">ពុំមានរឿងភាគដែលត្រូវស្វែងរកទេ</p>
                  <p className="text-xs text-slate-500 mt-1">សូមព្យាយាមស្វែងរកពាក្យគន្លឹះផ្សេង។</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSeries.map((series) => {
                    const isUnlocked = unlockedSeriesIds.includes(series.id);
                    return (
                      <SeriesCard
                        key={series.id}
                        series={series}
                        isUnlocked={isUnlocked}
                        onSelect={(s) => setSelectedSeries(s)}
                        onUnlockClick={(s) => setPaymentSeries(s)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500 space-y-2 mt-12">
        <p className="font-semibold text-slate-400">CineKhmer - វេបសាយចាក់ផ្សាយរឿងភាគ និងទូទាត់ប្រាក់តាម QR Code</p>
        <p>រក្សាសិទ្ធិគ្រប់យ៉ាង © 2026 CineKhmer. ឥតគិតថ្លៃ ៥ ភាគដំបូង សម្រាប់អ្នកទស្សនាទាំងអស់គ្នា។</p>
      </footer>

      {/* MODALS */}
      {selectedSeries && (
        <SeriesDetailModal
          series={selectedSeries}
          isUnlocked={unlockedSeriesIds.includes(selectedSeries.id)}
          onClose={() => setSelectedSeries(null)}
          onSelectEpisode={(ep) => {
            setSelectedEpisode(ep);
          }}
          onUnlockClick={(s) => {
            setPaymentSeries(s);
          }}
        />
      )}

      {selectedEpisode && selectedSeries && (
        <VideoPlayerModal
          episode={selectedEpisode}
          series={selectedSeries}
          isUnlocked={unlockedSeriesIds.includes(selectedSeries.id)}
          onClose={() => setSelectedEpisode(null)}
          onSelectEpisode={(ep) => setSelectedEpisode(ep)}
          onUnlockClick={(s) => {
            setSelectedEpisode(null);
            setPaymentSeries(s);
          }}
        />
      )}

      {paymentSeries && (
        <PaymentModal
          series={paymentSeries}
          creatorSettings={creatorSettings}
          onClose={() => setPaymentSeries(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {isPurchasesOpen && (
        <MyPurchasesModal
          unlockedSeriesIds={unlockedSeriesIds}
          seriesList={seriesList}
          orders={orders}
          onClose={() => setIsPurchasesOpen(false)}
          onSelectSeries={(s) => setSelectedSeries(s)}
          onRestorePurchases={(ids) => setUnlockedSeriesIds(ids)}
        />
      )}

    </div>
  );
}
