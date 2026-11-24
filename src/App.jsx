import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Plus,
  PackageSearch,
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
    latitude: -7.9524,
    longitude: 112.6142,
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
    latitude: -7.9527,
    longitude: 112.6146,
    created_at: '2026-11-24T11:15:00Z',
  },
  {
    id: 3,
    title: 'Buku "Clean Code" - Robert C. Martin',
    category: 'Buku',
    status: 'Claimed',
    location: 'Ruang Baca / Perpustakaan FILKOM',
    description: 'Terdapat pembatas buku kertas di halaman 112.',
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    secret_question: 'Apa warna pembatas buku di dalamnya?',
    secret_answer: 'biru',
    finder_contact: '0813-9988-7766 (Petugas Ruang Baca)',
    latitude: -7.9522,
    longitude: 112.6148,
    created_at: '2026-11-23T14:00:00Z',
  },
];

const CATEGORIES = ['Semua', 'KTM', 'Elektronik', 'Buku', 'Lainnya'];

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header Modern */}
      <header className="bg-[#0B192C] text-white shadow-lg sticky top-0 z-30 border-b border-sky-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
              <PackageSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                FI<span className="text-sky-400">LOST</span>
              </h1>
              <p className="text-xs sm:text-sm text-sky-200/80 font-medium mt-0.5">
                FILKOM Item Locator &amp; Online Search Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs text-sky-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{unclaimedCount} Barang Belum Diklaim</span>
            </div>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Lapor Barang</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Search Bar Section */}
      <section className="bg-gradient-to-b from-[#0B192C] via-[#102542] to-[#16325B] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Temukan Kembali Barangmu di Area FILKOM
          </h2>
          <p className="text-sky-200/80 text-sm sm:text-base mb-6">
            Cari barang temuan berdasarkan nama atau lokasi gedung, lalu verifikasi kepemilikanmu.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul barang atau lokasi (misal: KTM, Charger, Gedung F)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-sky-400 text-slate-950 font-semibold shadow-md shadow-sky-400/25'
                      : 'bg-white/10 text-sky-100 hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        {/* Control Bar + Tombol Toggle Peta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200/80">
          <p className="text-sm text-slate-600">
            Menampilkan{' '}
            <span className="font-bold text-[#0B192C]">{filteredItems.length}</span>{' '}
            barang temuan
            {selectedCategory !== 'Semua' && (
              <span>
                {' '}
                pada kategori <span className="font-semibold text-sky-600">{selectedCategory}</span>
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition cursor-pointer"
          >
            <MapIcon className="w-4 h-4 text-sky-600" />
            <span>{showMap ? 'Sembunyikan Peta' : 'Tampilkan Peta Kampus'}</span>
          </button>
        </div>

        {/* Peta Interaktif Kampus FILKOM UB */}
        {showMap && (
          <CampusMap
            items={filteredItems}
            onSelectClaimItem={(item) => setSelectedClaimItem(item)}
          />
        )}

        {/* Feed Grid Kartu Barang */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Memuat data barang dari database...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Barang tidak ditemukan
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Coba kata kunci lain atau ubah filter kategori ke "Semua".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition cursor-pointer"
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
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300 transition flex flex-col"
                >
                  <div className="relative h-48 bg-slate-200 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0B192C]/85 text-sky-300 backdrop-blur-sm">
                        {item.category}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                          isClaimed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs text-slate-400 mb-1">
                      Ditemukan: {formattedDate}
                    </span>

                    <h3 className="text-lg font-bold text-[#0B192C] leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                      {item.description}
                    </p>

                    <div className="flex items-start gap-2 text-sm text-slate-700 bg-sky-50 border border-sky-100 px-3 py-2 rounded-lg mb-4">
                      <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{item.location}</span>
                    </div>

                    <button
                      type="button"
                      disabled={isClaimed}
                      onClick={() => setSelectedClaimItem(item)}
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition ${
                        isClaimed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-600/20 cursor-pointer'
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

      {/* Modal Form Lapor Barang */}
      <ReportItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onAddItem={handleAddItem}
      />

      {/* Modal Verification-Locked Claiming */}
      <ClaimModal
        item={selectedClaimItem}
        isOpen={Boolean(selectedClaimItem)}
        onClose={() => setSelectedClaimItem(null)}
        onClaimSuccess={handleClaimSuccess}
      />
    </div>
  );
}