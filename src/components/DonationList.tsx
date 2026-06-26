import React, { useState, useEffect, useRef } from 'react';
import { DonorPledge } from '../types';
import { Search, Play, Pause, ChevronUp, RefreshCw, Trophy, Heart, MapPin, Calendar, Tag, AlertCircle } from 'lucide-react';

interface DonationListProps {
  pledges: DonorPledge[];
  onTriggerSync?: () => void;
  syncing?: boolean;
}

export const DonationList: React.FC<DonationListProps> = ({
  pledges = [],
  onTriggerSync,
  syncing = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState<'slow' | 'medium' | 'fast'>('slow');
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter pledges based on search query
  const filteredPledges = pledges.filter((pledge) =>
    pledge.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pledge.city && pledge.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (pledge.category && pledge.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate stats
  const totalKilos = pledges.reduce((acc, p) => acc + (p.pledgeKilos || 0), 0);
  const totalDonors = pledges.length;

  // Auto-scrolling effect using requestAnimationFrame for pristine 60fps smoothness
  useEffect(() => {
    if (!isAutoScrolling || isHovered || filteredPledges.length < 3) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    
    // Define speeds in pixels per second
    const speedMap = {
      slow: 22,    // 22px per second - cinematic and easy to read
      medium: 45,  // 45px per second
      fast: 80     // 80px per second
    };

    const speed = speedMap[scrollSpeed];

    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (container) {
        // Increment scrollTop slowly based on elapsed time to keep it frame-rate independent
        const delta = (speed * elapsed) / 1000;
        container.scrollTop += delta;

        // Infinite loop: if we scroll near the bottom, wrap back to the top smoothly
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (container.scrollTop >= maxScroll - 2) {
          // Wrap around to top with a slight delay or instantly
          container.scrollTop = 0;
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoScrolling, scrollSpeed, isHovered, filteredPledges.length]);

  return (
    <section id="donaciones-list" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F4F7F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#008CBA] mb-2 block flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
              Sincronizado con Base de Datos Excel
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#1A202C]">
              📋 LISTADO DE DONACIONES EN VIVO
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium mt-2 max-w-3xl">
              Consulte y busque en tiempo real todas las donaciones registradas y consolidadas desde la matriz de control en Google Sheets. Cada kilo suma para cumplir la meta de 1 tonelada.
            </p>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <div className="px-4 py-2 border-r border-slate-100 last:border-none">
              <span className="text-[10px] font-black uppercase text-slate-400 block">TOTAL DONANTES</span>
              <span className="text-xl sm:text-2xl font-black text-[#1A202C] font-mono">
                {totalDonors}
              </span>
            </div>
            <div className="px-4 py-2 border-r border-slate-100 last:border-none">
              <span className="text-[10px] font-black uppercase text-slate-400 block">KILOS CONSOLIDADOS</span>
              <span className="text-xl sm:text-2xl font-black text-[#008CBA] font-mono flex items-center gap-1">
                <Trophy className="w-5 h-5 text-amber-500 inline" />
                {totalKilos.toLocaleString()} kg
              </span>
            </div>
            {onTriggerSync && (
              <button
                onClick={onTriggerSync}
                disabled={syncing}
                title="Actualizar datos directamente de la base de datos de Excel"
                className="flex items-center justify-center px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition border border-slate-200 cursor-pointer text-xs font-black uppercase"
              >
                <RefreshCw className={`w-4 h-4 mr-2 text-[#008CBA] ${syncing ? 'animate-spin' : ''}`} />
                <span>Sincronizar</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel de Controles / Filtros */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Buscador Dinámico */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="donor-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre del donante..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Controles de Autodesplazamiento (Modo TV / Live Ticker) */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                🎥 Modo Auto-Subida:
              </span>
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isAutoScrolling 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title={isAutoScrolling ? "Pausar subida interactiva lenta" : "Reactivar subida interactiva lenta"}
              >
                {isAutoScrolling ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Activo</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Pausado</span>
                  </>
                )}
              </button>
            </div>

            {/* Velocidad de la subida */}
            {isAutoScrolling && (
              <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 px-2 uppercase">VELOCIDAD:</span>
                {(['slow', 'medium', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setScrollSpeed(speed)}
                    className={`px-3 py-1 rounded-lg text-xs font-black capitalize transition cursor-pointer ${
                      scrollSpeed === speed
                        ? 'bg-[#1A202C] text-white shadow'
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {speed === 'slow' ? 'Lento' : speed === 'medium' ? 'Medio' : 'Rápido'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenedor del Listado Profesional */}
        <div className="relative">
          {/* Indicadores de Scroll e Interactividad */}
          {isAutoScrolling && !isHovered && filteredPledges.length >= 3 && (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
              <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
              <span>Desplazando • Coloque el cursor para detener</span>
            </div>
          )}

          {/* Contenedor de Desplazamiento */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`overflow-y-auto max-h-[550px] rounded-3xl border border-slate-200 bg-white shadow-inner p-4 sm:p-6 space-y-4 scroll-smooth transition-all duration-300 ${
              isHovered ? 'border-blue-300 ring-2 ring-blue-500/5' : ''
            }`}
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredPledges.length === 0 ? (
              <div className="py-16 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">No se encontraron donantes que coincidan con su búsqueda.</p>
                <p className="text-slate-400 text-sm mt-1">Intente buscar con otro nombre o verifique la ortografía.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPledges.map((pledge, index) => {
                  // Preciosas iniciales para avatar
                  const initials = (pledge.donorName || 'D')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  // Colores rotativos muy bonitos para el avatar
                  const colors = [
                    'bg-blue-100 text-blue-700 border-blue-200',
                    'bg-emerald-100 text-emerald-700 border-emerald-200',
                    'bg-purple-100 text-purple-700 border-purple-200',
                    'bg-amber-100 text-amber-700 border-amber-200',
                    'bg-rose-100 text-rose-700 border-rose-200',
                    'bg-indigo-100 text-indigo-700 border-indigo-200'
                  ];
                  const colorClass = colors[index % colors.length];

                  return (
                    <div
                      key={pledge.id || `pledge-${index}`}
                      id={pledge.id}
                      className="p-5 bg-gradient-to-br from-white to-slate-50/50 hover:to-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Fondo sutil decorativo en hover */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#008CBA]/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500"></div>

                      <div>
                        {/* Cabecera del donante */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm border shadow-inner shrink-0 ${colorClass}`}>
                              {initials}
                            </div>
                            <div>
                              <h4 className="font-black text-[#1A202C] text-base group-hover:text-[#008CBA] transition">
                                {pledge.donorName || 'Donante Anónimo'}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-400 text-xs mt-0.5">
                                {pledge.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    {pledge.city}
                                  </span>
                                )}
                                {pledge.city && pledge.date && <span>•</span>}
                                {pledge.date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                    {pledge.date}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Kilos Donados (Badge Resaltado) */}
                          <div className="text-right shrink-0 z-10">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#008CBA]/10 text-[#008CBA] border border-[#008CBA]/20 text-xs sm:text-sm font-mono font-black rounded-xl shadow-inner uppercase tracking-wider">
                              +{pledge.pledgeKilos || 0} kg
                            </span>
                          </div>
                        </div>

                        {/* Categoría de insumos */}
                        {pledge.category && (
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-lg">
                              <Tag className="w-2.5 h-2.5 text-slate-500" />
                              {pledge.category}
                            </span>
                          </div>
                        )}

                        {/* Mensaje de apoyo / Descripción */}
                        {(pledge.message || pledge.description) && (
                          <div className="bg-slate-50 border-l-4 border-slate-300 p-3 rounded-r-xl text-slate-600 text-xs sm:text-sm leading-relaxed italic font-medium relative mb-1">
                            <span className="text-lg leading-none font-serif text-slate-300 absolute left-1.5 top-0">“</span>
                            <p className="pl-3">
                              {pledge.message || pledge.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Línea decorativa inferior */}
                      <div className="h-1 bg-gradient-to-r from-transparent via-[#008CBA]/20 to-transparent absolute bottom-0 left-0 right-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Leyenda aclaratoria profesional */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#008CBA] rounded-full"></span>
            <span>💡 <b>¿Cómo funciona el listado?</b> Los datos se extraen de la pestaña central de Excel. Cada registro nuevo que ingrese por el formulario o desde el panel administrativo se indexará aquí automáticamente.</span>
          </div>
          <div className="shrink-0 font-mono text-[10px] bg-white px-2 py-1 rounded border border-slate-200 font-bold">
            Excel BD Integrado: OK
          </div>
        </div>

      </div>
    </section>
  );
};
