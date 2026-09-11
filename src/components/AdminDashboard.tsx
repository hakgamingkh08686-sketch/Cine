import React, { useState } from 'react';
import { Series, CreatorSettings, Order, Episode } from '../types';
import { Plus, DollarSign, Film, ShoppingCart, Settings, QrCode, Trash2, CheckCircle2, ShieldCheck, Eye, Star, Upload, Video } from 'lucide-react';
import { storeVideo } from '../lib/videoStorage';
import { PersistentImage } from './PersistentImage';
import { KHQRCode } from './KHQRCode';
import { generateACLEDAKHQR } from '../lib/khqr';

interface AdminDashboardProps {
  seriesList: Series[];
  setSeriesList: React.Dispatch<React.SetStateAction<Series[]>>;
  orders: Order[];
  creatorSettings: CreatorSettings;
  setCreatorSettings: React.Dispatch<React.SetStateAction<CreatorSettings>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  seriesList,
  setSeriesList,
  orders,
  creatorSettings,
  setCreatorSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SERIES' | 'ORDERS' | 'SETTINGS'>('OVERVIEW');

  // New Series Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('រឿងមនោសញ្ចេតនា');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(1.00);
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80');
  const [newBanner, setNewBanner] = useState('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [newTotalEpisodes, setNewTotalEpisodes] = useState(40);
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<File[]>([]);

  // State for safe custom modals/alerts (iframe-proof)
  const [seriesToDelete, setSeriesToDelete] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string>('');

  // Editing Episodes State
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [editingEpisodes, setEditingEpisodes] = useState<Episode[]>([]);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.currency === 'USD' ? o.amount : o.amount / 4100), 0);

  const handleVideoFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      // Sort naturally so that Episode 1, Episode 2, Episode 10 are in order
      const sortedFiles = filesArray.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      });
      setUploadedVideoFiles(sortedFiles);
      setNewTotalEpisodes(sortedFiles.length);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setNewCover(URL.createObjectURL(file));
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setNewBanner(URL.createObjectURL(file));
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCreatorSettings({ ...creatorSettings, qrImageUrl: event.target.result as string });
          setSavedMessage('អាប់ឡូតរូបភាព QR បានជោគជ័យ! ✅');
          setTimeout(() => setSavedMessage(''), 3000);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const seriesId = `series-${Date.now()}`;
    const coverKey = coverFile ? `cover-${seriesId}` : newCover;
    const bannerKey = bannerFile ? `banner-${seriesId}` : newBanner;

    // Save cover and banner to IndexedDB if they are custom uploaded files
    if (coverFile) {
      storeVideo(`cover-${seriesId}`, coverFile);
    }
    if (bannerFile) {
      storeVideo(`banner-${seriesId}`, bannerFile);
    }

    const episodesList: Episode[] = Array.from({ length: newTotalEpisodes }, (_, i) => {
      const epNum = i + 1;
      const isFree = epNum <= 5;
      const videoFile = uploadedVideoFiles[i];
      const epId = `${seriesId}-ep${epNum}`;

      // Save video file to IndexedDB
      if (videoFile) {
        storeVideo(epId, videoFile);
      }

      const videoUrl = videoFile 
        ? 'local'
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

      return {
        id: epId,
        seriesId,
        episodeNumber: epNum,
        title: `ភាគទី ${epNum} ${epNum <= 5 ? '(ឥតគិតថ្លៃ)' : '(វីដេអូបង់ប្រាក់ $1.00)'}`,
        duration: '40 នាទី',
        videoUrl,
        thumbnailUrl: coverKey,
        isFree,
        description: `សាច់រឿងភាគទី ${epNum} នៃរឿង ${newTitle}។${videoFile ? ` (ហ្វាល: ${videoFile.name})` : ''}`
      };
    });

    const createdSeries: Series = {
      id: seriesId,
      title: newTitle,
      genre: newGenre.split(',').map((g) => g.trim()),
      description: newDesc,
      coverImage: coverKey,
      bannerImage: bannerKey,
      totalEpisodes: newTotalEpisodes,
      price: newPrice,
      currency: 'USD',
      rating: 5.0,
      views: 120,
      releaseYear: 2026,
      episodes: episodesList
    };

    setSeriesList([createdSeries, ...seriesList]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setCoverFile(null);
    setBannerFile(null);
    setUploadedVideoFiles([]);
    setSavedMessage('បានបង្កើតរឿងភាគថ្មីដោយជោគជ័យ! 🎉');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleDeleteSeriesConfirm = () => {
    if (seriesToDelete) {
      setSeriesList(seriesList.filter((s) => s.id !== seriesToDelete));
      setSeriesToDelete(null);
      setSavedMessage('បានលុបរឿងភាគដោយជោគជ័យ! 🗑️');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Creator & Admin Center
          </div>
          <h2 className="text-2xl font-extrabold text-white">ផ្ទាំងគ្រប់គ្រងរឿងភាគ និងការទូទាត់</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតរឿងភាគថ្មី</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        {[
          { id: 'OVERVIEW', label: 'ទិដ្ឋភាពទូទៅ (Overview)', icon: DollarSign },
          { id: 'SERIES', label: 'គ្រប់គ្រងរឿងភាគ (Series)', icon: Film },
          { id: 'ORDERS', label: 'បញ្ជីការទូទាត់ QR (Orders)', icon: ShoppingCart },
          { id: 'SETTINGS', label: 'ការកំណត់ QR & ធនាគារ', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3.5 text-sm font-semibold transition-all border-b-2 ${
                active
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">ចំណូលសរុប (Total Revenue)</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-400 mt-1 font-medium">≈ {(totalRevenue * 4100).toLocaleString()}៛</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">ការទូទាត់សរុប (Orders)</span>
                <ShoppingCart className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {orders.length}
              </div>
              <p className="text-xs text-slate-400 mt-1">ប្រតិបត្តិការ QR ជោគជ័យ</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">រឿងភាគសរុប (Series)</span>
                <Film className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {seriesList.length}
              </div>
              <p className="text-xs text-amber-400 mt-1">មាន ៥ ភាគ Free ស្រាប់</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">អ្នកទស្សនាសរុប (Views)</span>
                <Eye className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {seriesList.reduce((acc, s) => acc + s.views, 0).toLocaleString()}
              </div>
              <p className="text-xs text-cyan-400 mt-1">ទស្សនិកជនលើបណ្ដាញ</p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">ប្រតិបត្តិការទូទាត់ QR ចុងក្រោយ</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <th className="py-3 px-4">លេខកូដ (Order ID)</th>
                    <th className="py-3 px-4">រឿងភាគ</th>
                    <th className="py-3 px-4">អតិថិជន</th>
                    <th className="py-3 px-4">ទឹកប្រាក់</th>
                    <th className="py-3 px-4">មធ្យោបាយ</th>
                    <th className="py-3 px-4">ស្ថានភាព</th>
                    <th className="py-3 px-4">កាលបរិច្ឆេទ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-rose-400">{o.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{o.seriesTitle}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {o.customerName} <span className="text-xs text-slate-500 block">({o.customerPhone})</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${o.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-xs font-medium bg-slate-800 rounded px-2 py-1 inline-block mt-2">
                        {o.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> បានទូទាត់
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">{o.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERIES MANAGEMENT */}
      {activeTab === 'SERIES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesList.map((series) => (
              <div key={series.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div>
                  <div className="relative h-40">
                    <PersistentImage
                      storageKey={series.coverImage}
                      fallbackUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
                      alt={series.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute top-3 right-3 bg-slate-900/90 px-2 py-1 rounded text-xs font-bold text-rose-400">
                      ${series.price} / រឿង
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{series.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{series.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>{series.totalEpisodes} ភាគសរុប</span>
                      <span className="text-emerald-400 font-semibold">ភាគ ១-៥ Free 🟢</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">ID: {series.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSeries(series);
                        setEditingEpisodes([...series.episodes]);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-rose-600/10"
                      title="កែសម្រួលតំណភ្ជាប់វីដេអូភាគរឿង"
                    >
                      <span>🎬 កែសម្រួលភាគ</span>
                    </button>
                    <button
                      onClick={() => setSeriesToDelete(series.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors"
                      title="លុបរឿង"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">ប្រវត្តិការបញ្ជាទិញ និងទូទាត់ប្រាក់តាម QR</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                  <th className="py-3 px-4">ល.រ (Order ID)</th>
                  <th className="py-3 px-4">រឿងភាគ</th>
                  <th className="py-3 px-4">ឈ្មោះអតិថិជន</th>
                  <th className="py-3 px-4">លេខទូរសព្ទ</th>
                  <th className="py-3 px-4">ទឹកប្រាក់</th>
                  <th className="py-3 px-4">កម្មវិធីទូទាត់</th>
                  <th className="py-3 px-4">កាលបរិច្ឆេទ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-rose-400">{o.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{o.seriesTitle}</td>
                    <td className="py-3 px-4 text-slate-200">{o.customerName}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{o.customerPhone}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">${o.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-xs font-semibold">{o.paymentMethod}</td>
                    <td className="py-3 px-4 text-xs text-slate-400">{o.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-rose-400" />
            <span>ការកំណត់គណនីធនាគារ និង QR Code សម្រាប់ទទួលប្រាក់</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">ឈ្មោះធនាគារ (Bank Name)</label>
              <input
                type="text"
                value={creatorSettings.bankName}
                onChange={(e) => setCreatorSettings({ ...creatorSettings, bankName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">ឈ្មោះម្ចាស់គណនី (Account Name)</label>
              <input
                type="text"
                value={creatorSettings.accountName}
                onChange={(e) => {
                  const nameVal = e.target.value;
                  const newKhqr = generateACLEDAKHQR({
                    accountName: nameVal,
                    accountNumber: creatorSettings.accountNumber
                  });
                  setCreatorSettings({
                    ...creatorSettings,
                    accountName: nameVal,
                    khqrString: newKhqr
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">លេខគណនី (Account Number)</label>
              <input
                type="text"
                value={creatorSettings.accountNumber}
                onChange={(e) => {
                  const numVal = e.target.value;
                  const newKhqr = generateACLEDAKHQR({
                    accountName: creatorSettings.accountName,
                    accountNumber: numVal
                  });
                  setCreatorSettings({
                    ...creatorSettings,
                    accountNumber: numVal,
                    khqrString: newKhqr
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">តម្លៃលំនាំដើមក្នុងមួយរឿង ($)</label>
              <input
                type="number"
                step="0.5"
                value={creatorSettings.defaultSeriesPrice}
                onChange={(e) => setCreatorSettings({ ...creatorSettings, defaultSeriesPrice: parseFloat(e.target.value) || 2.5 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">រូបភាព QR Code (Upload KHQR Image)</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-850 border border-slate-800 rounded-2xl p-4">
                <KHQRCode creatorSettings={creatorSettings} className="w-24 h-24" />
                <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                  <p className="text-xs text-slate-400">អាប់ឡូតរូបភាព QR ធនាគារផ្ទាល់ខ្លួនរបស់អ្នក ដើម្បីឱ្យអតិថិជនស្កេនបង់ប្រាក់ផ្ទាល់ចូលគណនីរបស់អ្នក។</p>
                  <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-rose-500 rounded-xl px-4 py-2 text-xs font-bold text-white cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-rose-400" />
                    <span>ជ្រើសរើសរូបភាព QR</span>
                    <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSavedMessage('រក្សាទុកការកំណត់បានដោយជោគជ័យ! ✅');
                setTimeout(() => setSavedMessage(''), 3000);
              }}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-600/20 transition-all"
            >
              រក្សាទុកការផ្លាស់ប្តូរ (Save Settings)
            </button>
          </div>
        </div>
      )}

      {/* CREATE SERIES MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">បង្កើតរឿងភាគថ្មី</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateSeries} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ចំណងជើងរឿង (Series Title)</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ឧ. ស្នេហ៍ក្នុងភ្លើងសង្គ្រាម"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ប្រភេទរឿង (Genres, comma separated)</label>
                <input
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="រឿងមនោសញ្ចេតនា, រឿងភាគ"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">សេចក្តីសង្ខេប (Description)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="សរសេរពីសាច់រឿង..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">តម្លៃដោះសោរ ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 2.5)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">ចំនួនភាគសរុប</label>
                  <input
                    type="number"
                    value={newTotalEpisodes}
                    onChange={(e) => setNewTotalEpisodes(parseInt(e.target.value) || 12)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Cover & Banner Image File Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">រូបភាព Cover (រាងឈរ)</label>
                  <div className="bg-slate-850 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                    {newCover ? (
                      <img src={newCover} alt="Cover Preview" className="h-20 w-16 object-cover rounded-md border border-slate-700" />
                    ) : (
                      <div className="h-20 w-16 bg-slate-800 border border-dashed border-slate-700 rounded-md" />
                    )}
                    <label className="w-full flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 rounded-lg py-1.5 text-[11px] font-bold text-white cursor-pointer transition-colors border border-slate-700">
                      <Upload className="w-3.5 h-3.5 text-rose-400" />
                      <span>អាប់ឡូតរូប Cover</span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">រូបភាព Banner (រាងផ្ដេក)</label>
                  <div className="bg-slate-850 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                    {newBanner ? (
                      <img src={newBanner} alt="Banner Preview" className="h-10 w-24 object-cover rounded-md border border-slate-700" />
                    ) : (
                      <div className="h-10 w-24 bg-slate-800 border border-dashed border-slate-700 rounded-md" />
                    )}
                    <label className="w-full flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 rounded-lg py-1.5 text-[11px] font-bold text-white cursor-pointer transition-colors border border-slate-700">
                      <Upload className="w-3.5 h-3.5 text-rose-400" />
                      <span>អាប់ឡូតរូប Banner</span>
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  អាប់ឡូតហ្វាលវីដេអូភាគ (Bulk Video Files Upload - ឧ. ភាគ ១ ដល់ ៤០)
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-2xl p-4 cursor-pointer bg-slate-800/50 transition-colors">
                  <Upload className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="text-xs font-bold text-white text-center">
                    {uploadedVideoFiles.length > 0 
                      ? `បានជ្រើសរើសហ្វាលវីដេអូចំនួន ${uploadedVideoFiles.length} ភាគ ✅` 
                      : 'ចុចទីនេះដើម្បីជ្រើសរើសហ្វាលវីដេអូច្រើន (Multiple Video Files)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 text-center">
                    ភាគ ១ ដល់ ៥ នឹង Free ដោយស្វ័យប្រវត្តិ ឯភាគ ៦ ឡើងទៅត្រូវបង់ប្រាក់ $1.00
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoFilesUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-rose-600/20 transition-all"
                >
                  បង្កើតរឿងភាគ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM SAFE DELETE MODAL (IFRAME-PROOF) */}
      {seriesToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">តើអ្នកពិតជាចង់លុបរឿងភាគនេះមែនទេ?</h4>
              <p className="text-xs text-slate-400">សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានឡើយ ហើយរឿងភាគនេះនឹងត្រូវលុបចោលទាំងស្រុង។</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSeriesToDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                ទេ បោះបង់
              </button>
              <button
                onClick={handleDeleteSeriesConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg"
              >
                យល់ព្រម លុបចោល
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EPISODE EDITOR MODAL */}
      {editingSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">ប្រព័ន្ធគ្រប់គ្រងភាគរឿង (Bunny CDN Integrated)</span>
                <h3 className="text-xl font-black text-white mt-0.5">កែសម្រួលភាគរឿង៖ {editingSeries.title}</h3>
              </div>
              <button onClick={() => setEditingSeries(null)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-1">
                <p className="font-bold text-rose-400 flex items-center gap-1.5">💡 របៀបយកវីដេអូពី Bunny.net មកដាក់៖</p>
                <p>1. ចុចចម្លង (Copy) តំណភ្ជាប់ **HLS Playlist URL** ឬ **Direct play URL** ពីគណនី Bunny.net របស់លោកអ្នក</p>
                <p>2. យកមក**បិទភ្ជាប់ (Paste)** ចូលក្នុងប្រអប់ **"តំណភ្ជាប់វីដេអូ (URL / .m3u8)"** នៃភាគនីមួយៗខាងក្រោម</p>
                <p>3. ចុចប៊ូតុង **"រក្សាទុកការផ្លាស់ប្តូរ"** នៅខាងក្រោមបំផុតជាការស្រេច!</p>
              </div>

              <div className="space-y-4 divide-y divide-slate-800/50 max-h-[45vh] overflow-y-auto pr-2">
                {editingEpisodes.map((episode, idx) => (
                  <div key={episode.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        🎬 ភាគទី {episode.episodeNumber}
                        {episode.isFree ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Free 🟢</span>
                        ) : (
                          <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold uppercase">បង់ប្រាក់ 🔒</span>
                        )}
                      </span>
                      <button
                        onClick={() => {
                          const updated = [...editingEpisodes];
                          updated[idx] = { ...updated[idx], isFree: !updated[idx].isFree };
                          setEditingEpisodes(updated);
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all border ${
                          episode.isFree 
                            ? 'bg-rose-600/10 text-rose-400 border-rose-500/20 hover:bg-rose-600/20' 
                            : 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600/20'
                        }`}
                      >
                        {episode.isFree ? '🔒 កំណត់ឱ្យបង់ប្រាក់' : '🟢 កំណត់ឱ្យមើល Free'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">ចំណងជើងភាគ (Episode Title)</label>
                        <input
                          type="text"
                          value={episode.title}
                          onChange={(e) => {
                            const updated = [...editingEpisodes];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setEditingEpisodes(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">តំណភ្ជាប់វីដេអូ (Video URL / .m3u8)</label>
                        <input
                          type="text"
                          value={episode.videoUrl}
                          onChange={(e) => {
                            const updated = [...editingEpisodes];
                            updated[idx] = { ...updated[idx], videoUrl: e.target.value };
                            setEditingEpisodes(updated);
                          }}
                          placeholder="ឧ. https://vz-xxx.b-cdn.net/.../playlist.m3u8"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSeries(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition-colors"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updatedList = seriesList.map((s) => {
                      if (s.id === editingSeries.id) {
                        return { ...s, episodes: editingEpisodes };
                      }
                      return s;
                    });
                    setSeriesList(updatedList);
                    setEditingSeries(null);
                    setSavedMessage('បានរក្សាទុកការកែប្រែភាគរឿងដោយជោគជ័យ! 🎉');
                    setTimeout(() => setSavedMessage(''), 4000);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-rose-600/20 transition-all"
                >
                  រក្សាទុកការផ្លាស់ប្តូរ (Save Changes)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT SAVE NOTIFICATION TOAST */}
      {savedMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-emerald-500 text-white font-semibold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

    </div>
  );
};
