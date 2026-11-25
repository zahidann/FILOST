import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Plus,
  X,
  Loader2,
  Map as MapIcon,
} from 'lucide-react';
import ReportItemModal from './components/ReportItemModal';
import ClaimModal from './components/ClaimModal';
import CampusMap from './components/CampusMap';
import { fetchItems } from './services/itemService';

const FALLBACK_ITEMS = [
  {
    id: 1,
    title: 'KTM Mahasiswa TIF a.n. Budi Santoso',
    category: 'KTM',
    status: 'Unclaimed',
    location: 'Pos Satpam Gedung F',
    description: 'Ditemukan di dekat parkiran motor timur Gedung F sekitar pukul 09.30 WIB.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    secret_question: 'Berapa 3 digit terakhir NIM yang tertera di KTM?',
    secret_answer: '042',
    finder_contact: '0812-3456-7890 (Pos Satpam Gedung F)',
    latitude: -7.9535,
    longitude: 112.6148,
    created_at: '2026-11-24T09:30:00Z',
  },
  {
    id: 2,
    title: 'Charger Laptop Lenovo Type-C 65W',
    category: 'Elektronik',
    status: 'Unclaimed',
    location: 'Ruang F3.2 (Meja Tengah)',
    description: 'Tertinggal setelah jam kuliah Pemrograman Web. Kabel tergulung rapi dengan pengikat velcro.',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    secret_question: 'Apa warna pengikat velcro pada kabel charger ini?',
    secret_answer: 'hitam',
    finder_contact: '0857-1122-3344 (Raka - TIF 24)',
    latitude: -7.95365,
    longitude: 112.61445,
    created_at: '2026-11-24T11:15:00Z',
  },
];

const CATEGORIES = ['Semua', 'KTM', 'Elektronik', 'Buku', 'Lainnya'];

// Map kategori ke warna flat-pastel yang spesifik
const CATEGORY_COLORS = {
  'Semua': 'bg-[#c3e3f5] text-slate-800 border-[#9bcbe6]',
  'KTM': 'bg-[#fcd5ce] text-slate-800 border-[#f8b4a6]',
  'Elektronik': 'bg-[#d8f3dc] text-slate-800 border-[#b7e4c7]',
  'Buku': 'bg-[#fde2e4] text-slate-800 border-[#fac5c9]',
  'Lainnya': 'bg-[#e2e2e9] text-slate-800 border-[#c6c6d3]',
};

export default function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
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
        console.warn('Menggunakan fallback data:', err.message);
        setItems(FALLBACK_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleAddItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleClaimSuccess = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'Claimed' } : item
      )
    );
  };

  const unclaimedCount = items.filter((i) => i.status === 'Unclaimed').length;

  return (
    <div className="min-h-screen bg-[#faf6f0] text-slate-800 font-sans pb-16">
      {/* Header Flat - Pastel Sky */}
      <header className="bg-[#c3e3f5] border-b-4 border-[#a6cee3] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Logo Custom SVG Flat Pastel */}
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
              <h1 className="text-xl font-black tracking-tight text-slate-800 leading-none">
                FI<span className="text-blue-600">LOST</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 font-bold mt-0.5 uppercase tracking-wider">
                FILKOM Item Locator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#f8edd8] border-2 border-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{unclaimedCount} Barang Belum Diklaim</span>
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
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-800 mb-2">
            Temukan Kembali Barangmu di Area FILKOM
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-semibold mb-6">
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
              placeholder="Cari judul barang atau lokasi (misal: KTM, Charger, Gedung F)..."
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
              const colStyle = CATEGORY_COLORS[category] || 'bg-white text-slate-800 border-slate-300';
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
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
        {/* Toggle Peta Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 bg-white px-4 py-3 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            Menampilkan{' '}
            <span className="font-extrabold text-blue-600">{filteredItems.length}</span>{' '}
            barang temuan
            {selectedCategory !== 'Semua' && (
              <span>
                {' '}
                pada kategori <span className="font-extrabold text-indigo-600">{selectedCategory}</span>
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#c3e3f5] hover:bg-[#a6cee3] text-slate-800 border-2 border-slate-800 transition cursor-pointer"
          >
            <MapIcon className="w-3.5 h-3.5 text-slate-800" />
            <span>{showMap ? 'Sembunyikan Peta' : 'Tampilkan Peta Kampus'}</span>
          </button>
        </div>

        {/* Peta */}
        {showMap && (
          <div className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] mb-8 bg-white">
            <CampusMap
              items={filteredItems}
              onSelectClaimItem={(item) => setSelectedClaimItem(item)}
            />
          </div>
        )}

        {/* Grid Feed Barang */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border-2 border-slate-800 p-16 text-center flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-600">
              Memuat data barang dari database...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-800 p-12 text-center shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">
              Barang tidak ditemukan
            </h3>
            <p className="text-sm font-semibold text-slate-500 mb-4">
              Cari kata kunci lain atau ubah filter kategori ke "Semua".
            </p>
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
                  className="bg-white rounded-2xl overflow-hidden border-2 border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transition-all flex flex-col"
                >
                  <div className="relative h-44 bg-[#f8edd8] overflow-hidden border-b-2 border-slate-800">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#c3e3f5] text-slate-800 border border-slate-800">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isClaimed
                            ? 'bg-[#d8f3dc] text-slate-800 border-[#a2d2a9]'
                            : 'bg-[#ffedd5] text-slate-800 border-[#fed7aa]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Ditemukan: {formattedDate}
                    </span>

                    <h3 className="text-base font-black text-slate-800 leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs font-semibold text-slate-600 mb-4 line-clamp-2 flex-1">
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
                      className={`w-full py-2 px-4 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
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