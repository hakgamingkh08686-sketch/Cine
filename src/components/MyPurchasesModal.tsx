import React, { useState } from 'react';
import { Series, Order } from '../types';
import { X, ShoppingBag, CheckCircle2, Play, Search, Phone, ShieldAlert, Award } from 'lucide-react';
import { PersistentImage } from './PersistentImage';

interface MyPurchasesModalProps {
  unlockedSeriesIds: string[];
  seriesList: Series[];
  orders: Order[];
  onClose: () => void;
  onSelectSeries: (series: Series) => void;
  onRestorePurchases: (unlockedIds: string[]) => void;
}

export const MyPurchasesModal: React.FC<MyPurchasesModalProps> = ({
  unlockedSeriesIds,
  seriesList,
  orders,
  onClose,
  onSelectSeries,
  onRestorePurchases,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchMessage, setSearchMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const unlockedSeries = seriesList.filter((s) => unlockedSeriesIds.includes(s.id));

  const handleSearchPurchasesByPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setSearchMessage({ type: 'error', text: 'សូមបញ្ចូលលេខទូរសព្ទរបស់អ្នក។' });
      return;
    }

    // Filter orders by phone (allowing minor space/format differences)
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const matchedOrders = orders.filter((o) => {
      const cleanOrderPhone = o.customerPhone.replace(/\s+/g, '');
      return cleanOrderPhone.includes(cleanPhone) || cleanPhone.includes(cleanOrderPhone);
    });

    if (matchedOrders.length === 0) {
      setSearchMessage({
        type: 'error',
        text: `មិនមានទិន្នន័យទិញរឿងសម្រាប់លេខទូរសព្ទ "${phoneNumber}" ឡើយ។`,
      });
    } else {
      const matchedSeriesIds = matchedOrders.map((o) => o.seriesId);
      // Combine with existing
      const updatedIds = Array.from(new Set([...unlockedSeriesIds, ...matchedSeriesIds]));
      onRestorePurchases(updatedIds);
      setSearchMessage({
        type: 'success',
        text: `បានរកឃើញ និងទាញយកការទិញចំនួន ${matchedOrders.length} រឿងភាគ ដោយជោគជ័យ!`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">រឿងភាគដែលអ្នកបានទិញដោះសោររួច</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Phone Number Restore Section */}
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4" /> ទាញយកការទិញឡើងវិញតាមលេខទូរសព្ទ (Retrieve Purchases)
            </div>
            <p className="text-slate-400 text-xs">
              ប្រសិនបើអ្នកបានផ្លាស់ប្តូរឧបករណ៍ ឬលុបកម្មវិធីរុករក (Browser) អ្នកអាចវាយបញ្ចូលលេខទូរសព្ទដែលធ្លាប់បង់ប្រាក់ដើម្បីទាញយករឿងទាំងនោះមកវិញ។
            </p>
            <form onSubmit={handleSearchPurchasesByPhone} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ឧ. 015 466 210"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>ស្វែងរកគណនី</span>
              </button>
            </form>

            {searchMessage && (
              <div className={`p-3 rounded-xl text-xs border ${
                searchMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                {searchMessage.text}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">បញ្ជីរឿងបានដោះសោរលើឧបករណ៍នេះ</h4>

            {unlockedSeries.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40 text-rose-500" />
                <p className="text-base font-semibold text-white mb-1">មិនទាន់មានរឿងបានដោះសោរនៅឡើយទេ</p>
                <p className="text-xs">សូមជ្រើសរើសរឿងភាគ និងបង់ប្រាក់តាម QR Code ដើម្បីទស្សនាភាគទី ៦ ឡើងទៅ។</p>
              </div>
            ) : (
              unlockedSeries.map((series) => (
                <div
                  key={series.id}
                  onClick={() => {
                    onSelectSeries(series);
                    onClose();
                  }}
                  className="group bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all"
                >
                  <PersistentImage
                    storageKey={series.coverImage}
                    fallbackUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
                    alt={series.title}
                    className="w-24 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ដោះសោររួចរាល់
                      </span>
                      <span className="text-xs text-slate-400">{series.totalEpisodes} ភាគ</span>
                    </div>
                    <h4 className="text-base font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                      {series.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{series.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
