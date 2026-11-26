import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FILKOM_CENTER = [-7.9538, 112.6146];

export default function CampusMap({ items, onSelectClaimItem }) {
  // Hanya tampilkan pin untuk barang yang BELUM diklaim (Unclaimed)
  const activeUnclaimedItems = items.filter(
    (item) =>
      item.status !== 'Claimed' &&
      typeof item.latitude === 'number' &&
      typeof item.longitude === 'number' &&
      !Number.isNaN(item.latitude) &&
      !Number.isNaN(item.longitude)
  );

  return (
    <section className="bg-white overflow-hidden">
      {/* Header Peta Flat Pastel */}
      <div className="bg-[#c3e3f5] text-slate-800 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#f8edd8] border-2 border-slate-800 text-slate-800">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black leading-tight">
              Peta Persebaran Barang Temuan — FILKOM UB
            </h3>
            <p className="text-xs font-semibold text-slate-700">
              Hanya menampilkan titik lokasi barang yang belum diklaim.
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-slate-800 bg-[#f8edd8] border-2 border-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
          {activeUnclaimedItems.length} Titik Lokasi Aktif
        </span>
      </div>

      {/* Container Leaflet Map */}
      <div className="h-[360px] sm:h-[420px] w-full relative z-10">
        <MapContainer
          center={FILKOM_CENTER}
          zoom={18}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {activeUnclaimedItems.map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
            >
              <Popup className="filost-popup" minWidth={210} maxWidth={240}>
                <div className="space-y-2 py-0.5">
                  <div className="relative h-28 w-full rounded-lg overflow-hidden bg-[#f8edd8] border border-slate-300">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffedd5] text-slate-800 border border-slate-800">
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      {item.location}
                    </p>
                  </div>

                  {onSelectClaimItem && (
                    <button
                      type="button"
                      onClick={() => onSelectClaimItem(item)}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#c3e3f5] hover:bg-[#a6cee3] text-slate-800 border border-slate-800 text-xs font-extrabold transition cursor-pointer"
                    >
                      Klaim Barang
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}