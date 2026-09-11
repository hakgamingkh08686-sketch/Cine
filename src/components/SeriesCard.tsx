import React from 'react';
import { Series } from '../types';
import { Play, Star, Eye, Lock, CheckCircle2 } from 'lucide-react';
import { PersistentImage } from './PersistentImage';

interface SeriesCardProps {
  series: Series;
  isUnlocked: boolean;
  onSelect: (series: Series) => void;
  onUnlockClick: (series: Series) => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  isUnlocked,
  onSelect,
  onUnlockClick,
}) => {
  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all duration-300 flex flex-col">
      {/* Thumbnail Banner */}
      <div 
        className="relative aspect-[16/10] overflow-hidden cursor-pointer"
        onClick={() => onSelect(series)}
      >
        <PersistentImage
          storageKey={series.coverImage}
          fallbackUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
          alt={series.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="bg-rose-600/90 backdrop-blur text-white text-xs px-2.5 py-1 rounded-lg font-medium shadow-md">
            ៥ ភាគដំបូង Free 🟢
          </span>
          {isUnlocked ? (
            <span className="bg-emerald-600/90 backdrop-blur text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> បានដោះសោររួច
            </span>
          ) : (
            <span className="bg-amber-500/90 backdrop-blur text-slate-950 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 shadow-md">
              <Lock className="w-3 h-3" /> ភាគ ៦+ បង់ប្រាក់ (${series.price})
            </span>
          )}
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>

        {/* Bottom stats overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {series.rating}
            </span>
            <span className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur">
              <Eye className="w-3.5 h-3.5 text-slate-400" /> {series.views.toLocaleString()}
            </span>
          </div>
          <span className="bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur text-rose-300 font-semibold">
            {series.totalEpisodes} ភាគសរុប
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {series.genre.map((g, idx) => (
              <span key={idx} className="text-[11px] font-medium bg-slate-800 text-rose-300 px-2 py-0.5 rounded-md">
                {g}
              </span>
            ))}
          </div>
          <h3 
            className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-rose-400 cursor-pointer transition-colors"
            onClick={() => onSelect(series)}
          >
            {series.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {series.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-sm">
            <span className="text-slate-400 text-xs block">តម្លៃរឿងពេញ៖</span>
            <span className="text-white font-bold text-base">
              ${series.price.toFixed(2)} <span className="text-xs text-slate-400 font-normal">({(series.price * 4100).toLocaleString()}៛)</span>
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelect(series)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              មើលភាគ
            </button>
            {!isUnlocked && (
              <button
                onClick={() => onUnlockClick(series)}
                className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-rose-600/20 flex items-center gap-1"
              >
                ទិញដោះសោរ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
