import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Plus,
  X,
  Loader2,
  Map as MapIcon,
  Archive,
  PackageCheck,
} from 'lucide-react';
import ReportItemModal from './components/ReportItemModal';
import ClaimModal from './components/ClaimModal';
import CampusMap from './components/CampusMap';
import { fetchItems } from './services/itemService';

const CATEGORIES = ['Semua', 'KTM', 'Elektronik', 'Buku', 'Lainnya'];

const CATEGORY_COLORS = {
  Semua: 'bg-[#c3e3f5] text-slate-800 border-[#9bcbe6]',
  KTM: 'bg-[#fcd5ce] text-slate-800 border-[#f8b4a6]',
  Elektronik: 'bg-[#d8f3dc] text-slate-800 border-[#b7e4c7]',
  Buku: 'bg-[#fde2e4] text-slate-800 border-[#fac5c9]',
  Lainnya: 'bg-[#e2e2e9] text-slate-800 border-[#c6c6d3]',
};

export default function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeTab, setActiveTab] = useState('Unclaimed');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const data = await fetchItems();
        setItems(data);
      } catch (err) {
        console.error('Gagal memuat data:', err.message);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const unclaimedItems = useMemo(
    () => items.filter((item) => item.status !== 'Claimed'),
    [items]
  );

  const claimedItems = useMemo(
    () => items.filter((item) => item.status === 'Claimed'),
    [items]
  );

  const filteredItems = useMemo(() => {
    const sourceList =
      activeTab === 'Unclaimed' ? unclaimedItems : claimedItems;

    return sourceList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, unclaimedItems, claimedItems, searchQuery, selectedCategory]);

  const handleAddItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setActiveTab('Unclaimed');
  };

  const handleClaimSuccess = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'Claimed' } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-slate-800 pb-16">
      {/* Header Flat - Pastel Sky */}
      <header className="bg-[#c3e3f5] border-b-4 border-[#a6cee3] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Logo Komputasi Flat Pastel (Terminal Radar Node) */}
            <div className="w-11 h-11 rounded-xl bg-[#f8edd8] border-2 border-slate-800 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
  <svg
    viewBox="0 0 64 64"
    fill="none"
    className="w-8 h-8"
    aria-hidden="true"
  >
    <path
      d="M32 10C22.0589 10 14 18.0589 14 28C14 40.5 32 54 32 54C32 54 50 40.5 50 28C50 18.0589 41.9411 10 32 10Z"
      fill="#c3e3f5"
      stroke="#1e293b"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <circle
      cx="30"
      cy="26"
      r="7"
      fill="#fcd5ce"
      stroke="#1e293b"
      strokeWidth="3.5"
    />
    <path
      d="M35.5 31.5L41 37"
      stroke="#1e293b"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
</div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none flex items-center">
                  <span>FI</span>
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-md bg-[#fcd5ce] border border-slate-800 text-slate-900">
                    LOST
                  </span>
                </h1>
                <span className="font-mono-tech text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f8edd8] border border-slate-800 text-slate-800">
                  v2.0
                </span>
              </div>
              <p className="font-mono-tech text-[10px] sm:text-xs text-slate-700 font-bold mt-1 tracking-tight">
                &gt;_ FILKOM_ITEM_LOCATOR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#f8edd8] border-2 border-slate-800 px-3 py-1 rounded-full font-mono-tech text-xs font-bold text-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  unclaimedItems.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              ></span>
              <span>ACTIVE_ITEMS: {unclaimedItems.length}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#fcd5ce] hover:bg-[#fabeb3] text-slate-800 font-bold text-sm px-4 py-2 rounded-xl border-2 border-slate-800 active:translate-y-0.5 active:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Lapor Barang</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Search Section - Antique White */}
      <section className="bg-[#f8edd8] border-b-4 border-[#e9dac1] pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block font-mono-tech text-xs font-bold bg-[#c3e3f5] border-2 border-slate-800 px-3 py-1 rounded-full mb-3 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
            // LOST &amp; FOUND SYSTEM — FILKOM UB
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-800 mb-2">
            Temukan Kembali Barangmu di Area FILKOM
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium mb-6">
            Cari barang temuan berdasarkan nama atau lokasi gedung, lalu verifikasi kepemilikanmu.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query judul barang atau lokasi (misal: KTM, Charger, Gedung F)..."
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 border-2 border-slate-800 focus:outline-none focus:ring-4 focus:ring-[#c3e3f5] text-sm sm:text-base shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-800 cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              const colStyle =
                CATEGORY_COLORS[category] ||
                'bg-white text-slate-800 border-slate-300';
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`font-mono-tech px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
                    isActive
                      ? `${colStyle} border-slate-800 scale-105 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]`
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-800 hover:text-slate-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        {/* Bar Kontrol Tab Status & Toggle Peta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white px-4 py-3 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('Unclaimed')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold border-2 transition cursor-pointer ${
                activeTab === 'Unclaimed'
                  ? 'bg-[#f8edd8] text-slate-800 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]'
                  : 'bg-slate-50 text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Belum Diklaim ({unclaimedItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Claimed')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold border-2 transition cursor-pointer ${
                activeTab === 'Claimed'
                  ? 'bg-[#d8f3dc] text-slate-800 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]'
                  : 'bg-slate-50 text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Riwayat Diklaim ({claimedItems.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-mono-tech text-xs font-bold bg-[#c3e3f5] hover:bg-[#a6cee3] text-slate-800 border-2 border-slate-800 transition cursor-pointer"
          >
            <MapIcon className="w-3.5 h-3.5 text-slate-800" />
            <span>{showMap ? 'HIDE_MAP' : 'SHOW_MAP'}</span>
          </button>
        </div>

        {/* Peta hanya menerima barang yang BELUM diklaim */}
        {showMap && (
          <div className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] mb-8 bg-white">
            <CampusMap
              items={unclaimedItems}
              onSelectClaimItem={(item) => setSelectedClaimItem(item)}
            />
          </div>
        )}

        {/* Grid Feed Barang */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border-2 border-slate-800 p-16 text-center flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="font-mono-tech text-sm font-bold text-slate-600">
              FETCHING_DATABASE_ITEMS...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-800 p-12 text-center shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {activeTab === 'Unclaimed'
                ? 'Tidak ada barang yang belum diklaim'
                : 'Belum ada riwayat barang yang diklaim'}
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-4">
              {activeTab === 'Unclaimed'
                ? 'Semua barang temuan sudah kembali ke pemiliknya, atau ubah kata kunci pencarian.'
                : 'Barang yang sudah berhasil diverifikasi dan diklaim akan muncul di arsip ini.'}
            </p>
            {(searchQuery || selectedCategory !== 'Semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                }}
                className="px-4 py-2 bg-[#c3e3f5] hover:bg-[#a6cee3] border-2 border-slate-800 font-bold text-sm rounded-lg transition cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isClaimed = item.status === 'Claimed';
              const formattedDate = item.created_at
                ? new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-';

              return (
                <article
                  key={item.id}
                  className={`bg-white rounded-2xl overflow-hidden border-2 border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all flex flex-col ${
                    isClaimed
                      ? 'opacity-85'
                      : 'hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]'
                  }`}
                >
                  <div className="relative h-44 bg-[#f8edd8] overflow-hidden border-b-2 border-slate-800">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="font-mono-tech px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#c3e3f5] text-slate-800 border border-slate-800">
                        {item.category}
                      </span>
                      <span
                        className={`font-mono-tech px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-800 ${
                          isClaimed
                            ? 'bg-[#d8f3dc] text-slate-800'
                            : 'bg-[#ffedd5] text-slate-800'
                        }`}
                      >
                        {isClaimed ? 'CLAIMED' : 'UNCLAIMED'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="font-mono-tech text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      LOG_DATE: {formattedDate}
                    </span>

                    <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs font-medium text-slate-600 mb-4 line-clamp-2 flex-1">
                      {item.description}
                    </p>

                    <div className="flex items-start gap-1.5 text-xs font-bold text-slate-700 bg-[#f3f8fc] border-2 border-[#d0e5f2] px-2.5 py-2 rounded-xl mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                      <span className="leading-tight">{item.location}</span>
                    </div>

                    <button
                      type="button"
                      disabled={isClaimed}
                      onClick={() => setSelectedClaimItem(item)}
                      className={`w-full py-2 px-4 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                        isClaimed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                          : 'bg-[#c3e3f5] hover:bg-[#a6cee3] border-slate-800 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]'
                      }`}
                    >
                      {isClaimed ? 'Sudah Diklaim' : 'Klaim Barang'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Lapor & Klaim */}
      <ReportItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <ClaimModal
        item={selectedClaimItem}
        isOpen={Boolean(selectedClaimItem)}
        onClose={() => setSelectedClaimItem(null)}
        onClaimSuccess={handleClaimSuccess}
      />
    </div>
  );
}