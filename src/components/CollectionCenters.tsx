import React, { useState } from 'react';
import { CollectionCenter } from '../types';
import { MapPin, Phone, Clock, ExternalLink, ShieldCheck, AlertCircle, Search } from 'lucide-react';

interface CollectionCentersProps {
  centers: CollectionCenter[];
  showAll?: boolean;
}

export const CollectionCenters: React.FC<CollectionCentersProps> = ({ centers, showAll = false }) => {
  const [filterCountry, setFilterCountry] = useState<string>('España');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingDirectionsId, setLoadingDirectionsId] = useState<string | null>(null);

  const handleGetDirections = (center: CollectionCenter) => {
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(center.address + ', ' + center.city + ', España')}`;
    
    if (navigator.geolocation) {
      setLoadingDirectionsId(center.id);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoadingDirectionsId(null);
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(center.address + ', ' + center.city + ', España')}`;
          window.open(url, '_blank');
        },
        (error) => {
          setLoadingDirectionsId(null);
          // Fallback gracefully
          window.open(fallbackUrl, '_blank');
        },
        { enableHighAccuracy: true, timeout: 3500, maximumAge: 60000 }
      );
    } else {
      window.open(fallbackUrl, '_blank');
    }
  };

  const countries = Array.from(new Set<string>(centers.map(c => c.country || 'España')));
  
  const filteredByCountry = centers.filter(c => filterCountry === 'all' || (c.country || 'España') === filterCountry);
  const cities = Array.from(new Set<string>(filteredByCountry.map(c => c.city)));

  const filteredCenters = centers.filter(c => {
    const matchesCountry = filterCountry === 'all' || (c.country || 'España') === filterCountry;
    const matchesCity = filterCity === 'all' || c.city === filterCity;
    const matchesQuery = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.acceptedItems.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesCity && matchesQuery;
  });

  const displayedCenters = showAll ? filteredCenters : filteredCenters.slice(0, 6);

  const handleCountryChange = (country: string) => {
    setFilterCountry(country);
    setFilterCity('all');
  };

  return (
    <section id="centros" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 text-[#1A202C]">
      <div className="max-w-7xl mx-auto">
        
        {showAll && (
          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              <span>← Volver a la portada principal</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#008CBA] mb-2 block">
              Red Logística Humanitaria • Envío Aéreo Inmediato
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#1A202C]">
              {showAll ? 'TODOS LOS CENTROS DE ACOPIO' : 'CENTROS DE ACOPIO'} <br /> PARA LLEVAR LA COMIDA <span className="text-[#008CBA] text-2xl sm:text-4xl">(ESPAÑA 🇪🇸)</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium mt-3 max-w-2xl">
              Consulte los puntos autorizados en España para depositar directamente alimentos no perecederos, agua, insumos médicos urgentes y ropa limpia clasificada.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar insumo o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium text-[#1A202C] placeholder:text-slate-400 focus:outline-none focus:border-[#008CBA] focus:bg-white transition w-full sm:w-60"
              />
            </div>

            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-[#1A202C] focus:outline-none focus:border-[#008CBA] cursor-pointer"
            >
              <option value="all">Todas las Ciudades ({centers.length})</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCenters.map((center) => (
            <div
              key={center.id}
              className="group p-6 sm:p-8 bg-[#F4F7F9] border border-slate-200 hover:border-[#008CBA] hover:bg-white rounded-3xl transition-all shadow-sm hover:shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#008CBA] opacity-0 group-hover:opacity-100 transition"></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-md bg-[#008CBA]/10 text-[#008CBA] font-black text-[10px] tracking-widest uppercase">
                    {center.city}, {center.country}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verificado</span>
                  </span>
                </div>

                <h3 className="font-black text-xl text-[#1A202C] leading-tight mb-2 uppercase tracking-tight group-hover:text-[#008CBA] transition">
                  {center.name}
                </h3>

                <p className="text-xs text-slate-500 font-medium mb-4 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#008CBA] shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{center.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{center.contact}</span>
                  </div>
                </div>

                {/* Accepted Items tags */}
                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Se Recibe en este punto:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {center.acceptedItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg uppercase tracking-tight shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Urgent Needs Warning */}
                {center.urgentNeeds && center.urgentNeeds.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 mb-6">
                    <div className="flex items-center gap-1.5 text-red-700 font-black text-[10px] tracking-wider uppercase mb-1">
                      <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                      <span>Necesidad Crítica Específica:</span>
                    </div>
                    <p className="text-xs font-bold text-red-900 leading-snug">
                      {center.urgentNeeds.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Maps Action CTA */}
              <button
                onClick={() => handleGetDirections(center)}
                className="w-full py-3 bg-white group-hover:bg-[#008CBA] text-[#1A202C] group-hover:text-white border border-slate-200 group-hover:border-transparent rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer active:scale-95"
              >
                {loadingDirectionsId === center.id ? (
                  <>
                    <span className="animate-pulse text-amber-500 shrink-0">📍 Obteniendo GPS...</span>
                    <span className="text-[10px] animate-pulse">Calculando ruta...</span>
                  </>
                ) : (
                  <>
                    <span>Cómo Llegar (Google Maps)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {!showAll && filteredCenters.length > 6 && (
          <div className="mt-12 text-center flex justify-center">
            <button
              onClick={() => window.location.href = '?view=centros'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#008CBA] hover:bg-[#007096] text-white text-sm font-black tracking-widest uppercase rounded-2xl transition shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Ver más centros de acopio ({filteredCenters.length - 6} más)</span>
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {filteredCenters.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-lg font-black uppercase text-slate-400">No se encontraron centros para su búsqueda.</p>
          </div>
        )}

      </div>
    </section>
  );
};
