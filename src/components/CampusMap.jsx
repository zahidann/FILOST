import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';

// Perbaikan ikon marker default Leaflet agar tidak broken saat di-bundle oleh Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Koordinat tepat di kompleks Gedung F & Junction FILKOM UB
const FILKOM_CENTER = [-7.9538, 112.6146];

export default function CampusMap({ items, onSelectClaimItem }) {
  const mappableItems = items.filter(
    (item) =>
      typeof item.latitude === 'number' &&
      typeof item.longitude === 'number' &&
      !Number.isNaN(item.latitude) &&
      !Number.isNaN(item.longitude)
  );

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
      {/* Header Peta */}
      <div className="bg-[#0B192C] text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-sky-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold leading-tight">
              Peta Persebaran Barang Temuan — FILKOM UB
            </h3>
            <p className="text-xs text-sky-200/80">
              Klik pin lokasi di peta untuk melihat foto dan judul barang.
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-sky-300 bg-slate-900/90 border border-sky-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
          {mappableItems.length} Titik Lokasi Aktif
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

          {mappableItems.map((item) => {
            const isClaimed = item.status === 'Claimed';

            return (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
              >
                <Popup className="filost-popup" minWidth={210} maxWidth={240}>
                  <div className="space-y-2 py-0.5">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isClaimed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.location}
                      </p>
                    </div>

                    {!isClaimed && onSelectClaimItem && (
                      <button
                        type="button"
                        onClick={() => onSelectClaimItem(item)}
                        className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Klaim Barang
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}