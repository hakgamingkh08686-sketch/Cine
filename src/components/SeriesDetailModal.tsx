import React from 'react';
import { Series, Episode } from '../types';
import { X, Play, Lock, CheckCircle2, Star, Eye, Calendar, ShieldAlert } from 'lucide-react';
import { PersistentImage } from './PersistentImage';

interface SeriesDetailModalProps {
  series: Series | null;
  isUnlocked: boolean;
  onClose: () => void;
  onSelectEpisode: (episode: Episode) => void;
  onUnlockClick: (series: Series) => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({
  series,
  isUnlocked,
  onClose,
  onSelectEpisode,
  onUnlockClick,
}) => {
  if (!series) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Header Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <PersistentImage
            storageKey={series.bannerImage}
            fallbackUrl="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80"
            alt={series.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {series.genre.map((g, idx) => (
                  <span key={idx} className="bg-rose-600/90 text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                    {g}
                  </span>
                ))}
                <span className="bg-emerald-600/90 text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                  ៥ ភាគដំបូងមើលឥតគិតថ្លៃ 🟢
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {series.title}
              </h2>
            </div>

            {!isUnlocked ? (
              <button
                onClick={() => onUnlockClick(series)}
                className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-rose-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>ដោះសោរគ្រប់ភាគ (${series.price})</span>
              </button>
            ) : (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 backdrop-blur">
                <CheckCircle2 className="w-5 h-5" />
                <span>បានទិញដោះសោររួចរាល់</span>
              </div>
            )}
          </div>
        </div>

        {/* Details & Info */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 border-b border-slate-800 pb-4">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <strong className="text-white">{series.rating}</strong> វាយតម្លៃ
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <strong className="text-white">{series.views.toLocaleString()}</strong> អ្នកទស្សនា
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              ឆ្នាំចេញផ្សាយ: <strong className="text-white">{series.releaseYear}</strong>
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">សេចក្តីសង្ខេបសាច់រឿង</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {series.description}
            </p>
          </div>

          {/* Episode Notice */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-3 text-sm text-slate-300">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <p>
              <strong>គោលការណ៍រឿង៖</strong> ភាគទី ១ ដល់ ទី ៥ អាចទស្សនាដោយសេរី (Free)។ ចាប់ពីភាគទី ៦ ឡើងទៅ តម្រូវឱ្យបង់ប្រាក់ទើបអាចទស្សនាបន្តបាន។
            </p>
          </div>

          {/* Episodes Grid */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>បញ្ជីភាគរឿង ({series.totalEpisodes} ភាគ)</span>
              {!isUnlocked && (
                <span className="text-xs text-rose-400 font-normal">
                  ភាគទី ៦+ ជាប់សោរ 🔒
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
              {series.episodes.map((ep) => {
                const canWatch = ep.isFree || isUnlocked;
                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      if (canWatch) {
                        onSelectEpisode(ep);
                      } else {
                        onUnlockClick(series);
                      }
                    }}
                    className={`group relative rounded-xl p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                      canWatch
                        ? 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 hover:border-rose-500/60'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                      <PersistentImage
                        storageKey={ep.thumbnailUrl}
                        fallbackUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {canWatch ? (
                          <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400">ភាគទី {ep.episodeNumber}</span>
                        <span className="text-[10px] text-slate-400">{ep.duration}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate mt-0.5">{ep.title}</h4>
                      <div className="mt-1">
                        {ep.isFree ? (
                          <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            FREE 🟢
                          </span>
                        ) : isUnlocked ? (
                          <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            ដោះសោររួច ✅
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            បង់ប្រាក់ 🔒
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
