import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  ShieldQuestion,
  Loader2,
} from 'lucide-react';
import { claimItem } from '../services/itemService';

export default function ClaimModal({ item, isOpen, onClose, onClaimSuccess }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [unlockedContact, setUnlockedContact] = useState('');
  const [unlockedLocation, setUnlockedLocation] = useState('');

  // Reset state setiap kali modal dibuka untuk item baru
  useEffect(() => {
    if (isOpen) {
      setUserAnswer('');
      setErrorMessage('');
      setIsVerified(false);
      setIsChecking(false);
      setUnlockedContact('');
      setUnlockedLocation('');
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsChecking(true);

    try {
      const result = await claimItem(item.id, userAnswer);

      if (result.success) {
        setUnlockedContact(result.finder_contact);
        setUnlockedLocation(result.location);
        setIsVerified(true);
        if (onClaimSuccess) {
          onClaimSuccess(item.id);
        }
      } else {
        setErrorMessage(result.message || 'Jawaban tidak cocok, silakan coba lagi');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memverifikasi jawaban.');
    } finally {
      setIsChecking(false);
    }
  };

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B192C]/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between border-b border-sky-500/20">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                isVerified
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {isVerified ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight leading-tight">
                {isVerified ? 'Kepemilikan Terverifikasi' : 'Verifikasi Klaim Barang'}
              </h3>
              <p className="text-xs text-sky-200/80">
                {isVerified
                  ? 'Informasi kontak & pengambilan telah dibuka'
                  : 'Jawab pertanyaan rahasia dari penemu untuk membuka kontak'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-5">
          {/* Ringkasan Item */}
          <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/90 p-3 rounded-xl">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-200"
            />
            <div className="min-w-0">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0B192C] text-sky-300 mb-1">
                {item.category}
              </span>
              <h4 className="text-sm font-bold text-[#0B192C] truncate">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Ditemukan: {formattedDate}
              </p>
            </div>
          </div>

          {!isVerified ? (
            /* TAMPILAN TERKUNCI (FORM PERTANYAAN RAHASIA) */
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 mb-1.5">
                  <ShieldQuestion className="w-4 h-4 text-sky-600" />
                  <span>Pertanyaan Rahasia dari Penemu</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-[#0B192C]">
                  “{item.secret_question}”
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jawaban Anda <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ketik jawaban Anda di sini..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                    errorMessage
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'
                  }`}
                />

                {/* Pesan Error jika Jawaban Salah */}
                {errorMessage && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isChecking || !userAnswer.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition cursor-pointer disabled:opacity-60"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memeriksa...</span>
                    </>
                  ) : (
                    <span>Verifikasi Jawaban</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* TAMPILAN TERBUKA (VERIFIKASI BERHASIL) */
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-emerald-900">
                    Verifikasi Berhasil!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                    Jawaban Anda cocok. Silakan hubungi kontak di bawah ini atau datangi lokasi pengambilan barang.
                  </p>
                </div>
              </div>

              {/* Informasi Kontak & Lokasi Pengambilan yang Terbuka */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-sky-500/30 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-sky-300">
                      Informasi Kontak Penemu / Satpam
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white mt-0.5 select-all">
                      {unlockedContact || item.finder_contact}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3.5 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-sky-300">
                      Lokasi Pengambilan Barang
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {unlockedLocation || item.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0B192C] hover:bg-slate-800 text-white transition cursor-pointer"
                >
                  Selesai &amp; Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}