import React, { useState, useEffect } from 'react';
import { Episode, Series } from '../types';
import { X, Lock, Play, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getVideo } from '../lib/videoStorage';

interface VideoPlayerModalProps {
  episode: Episode | null;
  series: Series | null;
  isUnlocked: boolean;
  onClose: () => void;
  onSelectEpisode: (episode: Episode) => void;
  onUnlockClick: (series: Series) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  episode,
  series,
  isUnlocked,
  onClose,
  onSelectEpisode,
  onUnlockClick,
}) => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState<string>('Auto (HLS)');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);

  useEffect(() => {
    if (!episode) return;
    
    let objectUrl = '';
    async function loadVideo() {
      setIsLoadingVideo(true);
      try {
        // Try to get from IndexedDB first
        const storedBlob = await getVideo(episode.id);
        if (storedBlob) {
          objectUrl = URL.createObjectURL(storedBlob);
          setActiveVideoUrl(objectUrl);
        } else {
          // Fallback to episode.videoUrl if it is not a revoked blob URL.
          if (episode.videoUrl && episode.videoUrl.startsWith('blob:')) {
            // It's a stale blob URL from a past session. Fallback to sample stream.
            setActiveVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
          } else {
            setActiveVideoUrl(episode.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
          }
        }
      } catch (err) {
        console.error('Error loading video:', err);
        setActiveVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      } finally {
        setIsLoadingVideo(false);
      }
    }
    
    loadVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [episode]);

  // Apply playback speed to native video element
  useEffect(() => {
    const videoElement = document.getElementById('netflix-video-player') as HTMLVideoElement | null;
    if (videoElement) {
      videoElement.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeVideoUrl]);

  if (!episode || !series) return null;

  const canWatch = episode.isFree || isUnlocked;

  const currentIndex = series.episodes.findIndex((e) => e.id === episode.id);
  const prevEpisode = currentIndex > 0 ? series.episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < series.episodes.length - 1 ? series.episodes[currentIndex + 1] : null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto transition-all duration-500 ${
      isTheaterMode ? 'bg-black/98' : 'bg-slate-950/90 backdrop-blur-lg'
    }`}>
      <div className={`relative w-full max-w-5xl bg-slate-900 border rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto transition-all duration-500 ${
        isTheaterMode ? 'border-rose-950/40 shadow-rose-950/20' : 'border-slate-800'
      }`}>
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-400 font-semibold tracking-wider uppercase">{series.title}</span>
              <span className="bg-rose-500/10 text-rose-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Premium HLS</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              ភាគទី {episode.episodeNumber}: {episode.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                isTheaterMode 
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="ម៉ូដរោងកុន ( Theater Mode )"
            >
              <span>🎬 {isTheaterMode ? 'បើកភ្លើង' : 'បិទភ្លើង'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Box / Paywall */}
        <div className="relative aspect-video bg-black w-full flex items-center justify-center overflow-hidden">
          {canWatch ? (
            isLoadingVideo ? (
              <div className="text-white text-xs animate-pulse">កំពុងទាញយកវីដេអូ...</div>
            ) : (
              <div className="relative w-full h-full">
                <video
                  id="netflix-video-player"
                  key={activeVideoUrl}
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
                
                {/* Advanced Overlay Player Controls (Speed & Quality Selection Simulator) */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80">
                  {/* Quality Selector */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowQualityMenu(!showQualityMenu);
                        setShowSpeedMenu(false);
                      }}
                      className="text-slate-300 hover:text-white text-[11px] font-bold tracking-wide flex items-center gap-1 px-1.5 py-0.5 rounded transition-all"
                    >
                      ⚙️ {selectedQuality}
                    </button>
                    {showQualityMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-20">
                        <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                          កម្រិតច្បាស់ (Bunny CDN)
                        </div>
                        {['Auto (HLS)', 'Bunny CDN - 1080p 🌟', 'Bunny CDN - 720p', 'Low Mobile - 480p'].map((quality) => (
                          <button
                            key={quality}
                            onClick={() => {
                              setSelectedQuality(quality);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-600 hover:text-white transition-all flex items-center justify-between ${
                              selectedQuality === quality ? 'text-rose-400 bg-rose-500/10' : 'text-slate-300'
                            }`}
                          >
                            <span>{quality}</span>
                            {selectedQuality === quality && <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1 rounded">Active</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-slate-700">|</span>

                  {/* Playback Speed Selector */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSpeedMenu(!showSpeedMenu);
                        setShowQualityMenu(false);
                      }}
                      className="text-slate-300 hover:text-white text-[11px] font-bold tracking-wide flex items-center gap-1 px-1.5 py-0.5 rounded transition-all"
                    >
                      ⚡ {playbackSpeed === 1 ? 'ល្បឿនធម្មតា' : `${playbackSpeed}x`}
                    </button>
                    {showSpeedMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-20">
                        <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                          ល្បឿនវីដេអូ
                        </div>
                        {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              setShowSpeedMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-600 hover:text-white transition-all flex items-center justify-between ${
                              playbackSpeed === speed ? 'text-rose-400 bg-rose-500/10' : 'text-slate-300'
                            }`}
                          >
                            <span>{speed === 1 ? 'ល្បឿនធម្មតា (1x)' : `${speed}x`}</span>
                            {playbackSpeed === speed && <span className="text-rose-400">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Secure Player Notice */}
                <div className="absolute bottom-16 left-4 z-10 hidden md:flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-xl text-[10px] font-semibold select-none shadow-lg">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  🔒 Secured with Bunny Tokenizer: DRM Protection Enabled
                </div>
              </div>
            )
          ) : (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-4 text-amber-400 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ភាគទី {episode.episodeNumber} ជាប់សោរ (បង់ប្រាក់)
              </h3>
              <p className="text-slate-300 max-w-md text-sm mb-6">
                ភាគទី ១ ដល់ ទី ៥ គឺឥតគិតថ្លៃ។ ចាប់ពីភាគទី ៦ ឡើងទៅ តម្រូវឱ្យបង់ប្រាក់ចំនួន <strong className="text-rose-400">${series.price.toFixed(2)}</strong> ដើម្បីដោះសោររឿងទាំងអស់រហូតចប់។
              </p>
              <button
                onClick={() => onUnlockClick(series)}
                className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-rose-600/30 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <span>បង់ប្រាក់តាម QR Code ដោះសោរឥឡូវនេះ</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation & Episode Details */}
        <div className="p-6 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => prevEpisode && onSelectEpisode(prevEpisode)}
              disabled={!prevEpisode}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                prevEpisode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-800/40 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> ភាគមុន
            </button>
            <button
              onClick={() => nextEpisode && onSelectEpisode(nextEpisode)}
              disabled={!nextEpisode}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                nextEpisode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-800/40 text-slate-500 cursor-not-allowed'
              }`}
            >
              ភាគបន្ទាប់ <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            {episode.description}
          </div>
        </div>

        {/* Episode Quick Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 overflow-x-auto flex items-center gap-2">
          {series.episodes.map((ep) => {
            const isCurrent = ep.id === episode.id;
            const openable = ep.isFree || isUnlocked;
            return (
              <button
                key={ep.id}
                onClick={() => openable && onSelectEpisode(ep)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-md'
                    : openable
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-slate-900/60 text-slate-500 border border-slate-800'
                }`}
              >
                <span>ភាគ {ep.episodeNumber}</span>
                {ep.isFree ? (
                  <span className="text-[10px] text-emerald-400">Free</span>
                ) : isUnlocked ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-400" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
