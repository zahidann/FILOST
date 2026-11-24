import React, { useState } from 'react';
import {
  X,
  Upload,
  MapPin,
  Phone,
  Lock,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { uploadItem } from '../services/itemService';

// Daftar spot FILKOM UB beserta koordinat GPS akuratnya
const FILKOM_SPOTS = [
  { name: 'Junction FILKOM', lat: -7.95395, lng: 112.61465 },
  { name: 'Gedung F (Ruang Kuliah / Lobi)', lat: -7.95365, lng: 112.61445 },
  { name: 'Pos Satpam Gedung F', lat: -7.9535, lng: 112.6148 },
  { name: 'Gedung G (Ruang Kuliah / Lobi)', lat: -7.9542, lng: 112.6144 },
  { name: 'Gazebo FILKOM', lat: -7.9541, lng: 112.61485 },
  { name: 'Ruang Baca / Perpustakaan FILKOM', lat: -7.95375, lng: 112.61425 },
  { name: 'Kantin / Pujasera FILKOM', lat: -7.95435, lng: 112.6147 },
  { name: 'Parkiran Motor FILKOM', lat: -7.95335, lng: 112.61495 },
];

export default function ReportItemModal({ isOpen, onClose, onAddItem }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('KTM');
  const [description, setDescription] = useState('');
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [locationDetail, setLocationDetail] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle('');
    setCategory('KTM');
    setDescription('');
    setSelectedSpotIndex(0);
    setLocationDetail('');
    setFinderContact('');
    setSecretQuestion('');
    setSecretAnswer('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Silakan pilih foto barang terlebih dahulu.');
      return;
    }

    const spot = FILKOM_SPOTS[selectedSpotIndex];
    const fullLocation = locationDetail.trim()
      ? `${spot.name} (${locationDetail.trim()})`
      : spot.name;

    try {
      setIsSubmitting(true);
      const savedItem = await uploadItem({
        title: title.trim(),
        category,
        description: description.trim(),
        location: fullLocation,
        finder_contact: finderContact.trim(),
        secret_question: secretQuestion.trim(),
        secret_answer: secretAnswer.trim(),
        latitude: spot.lat,
        longitude: spot.lng,
        imageFile,
      });

      onAddItem(savedItem);
      resetForm();
      onClose();
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan saat menyimpan laporan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Lapor Barang Temuan</h2>
            <p className="text-xs text-sky-200/80">
              Lengkapi informasi barang dan pertanyaan verifikasi untuk pemilik asli.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Judul Barang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: KTM TIF a.n. Budi / Charger Lenovo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="KTM">KTM</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Buku">Buku</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Deskripsi Singkat <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi umum barang (tanpa membocorkan ciri rahasia)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Pilihan Titik Peta FILKOM + Detail Ruangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Area / Gedung FILKOM <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={selectedSpotIndex}
                onChange={(e) => setSelectedSpotIndex(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {FILKOM_SPOTS.map((spot, idx) => (
                  <option key={spot.name} value={idx}>
                    {spot.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detail Titik (Opsional)
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="Misal: Ruang F3.2 / Meja Utara"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Kontak Penemu / Satpam (WA) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={finderContact}
              onChange={(e) => setFinderContact(e.target.value)}
              placeholder="Contoh: 0812-3456-7890 (Pos Satpam Gedung F)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Upload Foto Barang */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Foto Barang <span className="text-rose-500">*</span>
            </label>
            {imagePreview ? (
              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
                <img
                  src={imagePreview}
                  alt="Preview barang"
                  className="w-full h-full object-cover"
                />
                <label className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer transition">
                  Ganti Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl bg-slate-50 hover:bg-sky-50/40 transition cursor-pointer">
                <Upload className="w-6 h-6 text-sky-600 mb-1.5" />
                <span className="text-sm font-semibold text-slate-700">
                  Klik untuk unggah foto barang
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  PNG, JPG, atau WEBP (Maks. 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Box Pertanyaan Rahasia */}
          <div className="bg-[#0B192C] text-white p-4 rounded-xl border border-sky-500/30 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Kunci Verifikasi Kepemilikan
                </h4>
                <p className="text-xs text-sky-200/80">
                  Nomor kontak Anda akan dikunci dan hanya terbuka jika pengklaim menjawab pertanyaan ini dengan benar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-sky-200 mb-1">
                  <Lock className="w-3 h-3" />
                  <span>Pertanyaan Rahasia <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={secretQuestion}
                  onChange={(e) => setSecretQuestion(e.target.value)}
                  placeholder="Contoh: Warna stiker di belakang?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Jawaban Rahasia <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  placeholder="Contoh: biru"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Publikasikan Laporan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}