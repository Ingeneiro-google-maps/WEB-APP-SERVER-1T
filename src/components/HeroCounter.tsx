import React, { useEffect } from 'react';
import { GlobalState } from '../types';
import { Scale, RefreshCw, HeartHandshake, PackageOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

function getYoutubeId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('?')) {
    return cleanUrl;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

interface HeroCounterProps {
  state: GlobalState;
  onSelectTargetTons: (tons: number) => void;
  onOpenDonation: () => void;
  onTriggerSync: () => void;
  syncing: boolean;
}

export const HeroCounter: React.FC<HeroCounterProps> = ({
  state,
  onSelectTargetTons,
  onOpenDonation,
  onTriggerSync,
  syncing
}) => {
  const totalKg = (state.pledges || []).reduce((acc, p) => acc + (p.pledgeKilos || 0), 0);
  const targetKg = state.globalTargetTons * 1000;
  const progressRatio = Math.min(100, Math.max(0, (totalKg / targetKg) * 100));
  const tonsCollected = (totalKg / 1000).toFixed(2);

  const videoId = getYoutubeId(state.headerVideoYoutubeUrl || '');
  const isVideoActive = !!(state.headerVideoEnabled && videoId);

  // Confetti trigger when >= 100%
  useEffect(() => {
    if (progressRatio >= 100) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [progressRatio]);

  // Determine stage description & color logic: Red -> Yellow/Orange -> Green
  let stageTextClass = 'text-red-600 bg-red-50 border-red-200';
  let stageName = 'ROJO — DÉFICIT CRÍTICO INICIAL';

  if (progressRatio >= 75) {
    stageTextClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    stageName = 'VERDE — ¡META PRÓXIMA / ALCANZADA!';
  } else if (progressRatio >= 30) {
    stageTextClass = 'text-amber-700 bg-amber-50 border-amber-300';
    stageName = 'NARANJA / AMARILLO — EN PROGRESO CONSTANTE';
  }

  const formattedSyncTime = state.lastSyncTime
    ? new Date(state.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Hace unos instantes';

  return (
    <section id="iniciativa" className="bg-[#F4F7F9] text-[#1A202C] pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid: Hero Text (Left) & Progress Counter Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Left Column: Bold Typography Hero Headline with Optional Background Video */}
          <div className={`relative lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between lg:border-r border-slate-200 overflow-hidden transition-all duration-500 ${
            isVideoActive ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-white to-slate-50 text-[#1A202C]'
          }`}>
            {/* Background Video Embed and Overlay */}
            {isVideoActive && (
              <>
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] sm:w-[220%] sm:h-[220%] lg:w-[180%] lg:h-[180%] -translate-x-1/2 -translate-y-1/2 aspect-video object-cover"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video de Fondo"
                  />
                </div>
                {/* Dark Cinematic Capa de Atenuación en Negro */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50 z-10" />
              </>
            )}

            <div className="relative z-20">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-black tracking-[0.2em] uppercase rounded mb-6 shadow-sm ${
                isVideoActive ? 'bg-[#008CBA]/90 text-white' : 'bg-[#008CBA] text-white'
              }`}>
                <span>{state.heroBadgeText || '🇻🇪 Emergencia Humanitaria • Terremoto Venezuela'}</span>
              </span>
              
              <h1 className={`text-4xl sm:text-6xl lg:text-[76px] leading-[0.88] font-black tracking-tighter uppercase mb-6 ${
                isVideoActive ? 'text-white' : 'text-[#1A202C]'
              }`}>
                {state.heroTitleRow1 || 'AYUDA VITAL'} <span className="text-3xl sm:text-5xl align-middle">🇻🇪</span> <br />
                <span className={isVideoActive ? 'text-sky-300' : 'text-[#008CBA]'}>
                  {state.heroTitleRow2 || 'POR 1 TONELADA'}
                </span> <br />
                {state.heroTitleRow3 || 'DESDE ESPAÑA'}
              </h1>
              
              <p className={`text-base sm:text-xl font-medium leading-relaxed max-w-xl mb-8 ${
                isVideoActive ? 'text-slate-200' : 'text-slate-500'
              }`}>
                {state.emergencySubtitle} Los datos de mercancía e inventario se sincronizan automáticamente cada 10 minutos desde el servidor.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className={`relative z-20 flex flex-wrap items-center justify-between gap-4 pt-6 border-t ${
              isVideoActive ? 'border-slate-800' : 'border-slate-200/80'
            }`}>
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
                isVideoActive 
                  ? 'bg-slate-900/90 border-slate-800 text-slate-200 shadow-xl' 
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider italic">
                  Sincronización Automática (Cada 10m): {formattedSyncTime}
                </span>
              </div>
              
              <button
                onClick={onTriggerSync}
                disabled={syncing}
                className={`text-xs font-black uppercase inline-flex items-center gap-1.5 underline decoration-2 underline-offset-4 cursor-pointer ${
                  isVideoActive ? 'text-sky-300 hover:text-sky-200' : 'text-[#008CBA] hover:text-[#006080]'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>Forzar Lectura Ahora</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Progress Counter Panel ("Navarra") */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#008CBA] flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Contador Navarra en Vivo</span>
                </span>
                
                {/* Meta Target Display */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase">OBJETIVO:</span>
                  <span className="px-2 py-0.5 bg-[#1A202C] text-white rounded text-xs font-black font-mono shadow">
                    {state.globalTargetTons}T
                  </span>
                </div>
              </div>

              {/* Big Numbers */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Recaudado (Kilos)</p>
                  <p className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-[#1A202C]">
                    {totalKg.toLocaleString()} <span className="text-2xl font-bold text-[#008CBA]">kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">En Toneladas</p>
                  <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-500">
                    {tonsCollected} <span className="text-xl font-bold text-slate-500">/ {state.globalTargetTons}T</span>
                  </p>
                </div>
              </div>

              {/* Stage Badge */}
              <div className="mb-4">
                <div className={`px-3.5 py-1.5 rounded-lg border text-xs font-black tracking-wider uppercase inline-flex items-center gap-2 ${stageTextClass}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  <span>ESTADO: {stageName} ({progressRatio.toFixed(1)}%)</span>
                </div>
              </div>

              {/* THE PROGRESS BAR (Red -> Orange/Yellow -> Green) */}
              <div className="relative h-14 sm:h-16 w-full bg-slate-200 rounded-2xl overflow-hidden shadow-inner flex border-4 border-white mb-3">
                {/* Background 4-quarter visual cue */}
                <div className="flex w-full h-full opacity-25">
                  <div className="h-full bg-red-500 w-[25%]"></div>
                  <div className="h-full bg-orange-500 w-[25%]"></div>
                  <div className="h-full bg-yellow-400 w-[25%]"></div>
                  <div className="h-full bg-emerald-500 w-[25%]"></div>
                </div>
                
                {/* Active Dynamic Progress Bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 to-emerald-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-end px-4 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(8, progressRatio)}%` }}
                >
                  <div className="h-4 w-4 bg-white rounded-full shadow-md animate-pulse flex items-center justify-center">
                    <div className="h-2 w-2 bg-[#1A202C] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Legend */}
              <div className="flex justify-between px-1 text-[11px] font-black uppercase tracking-tight">
                <span className="text-red-600">0% Rojo</span>
                <span className="text-orange-600">30% Naranja</span>
                <span className="text-yellow-600">70% Amarillo</span>
                <span className="text-emerald-600">100% Verde</span>
              </div>
            </div>

            {/* Public Donation Registration CTA */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={onOpenDonation}
                className="w-full py-4 px-6 bg-[#008CBA] hover:bg-[#007399] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition transform active:scale-98 cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5 text-amber-300 shrink-0" />
                <span>📦 Registrar Donación / Mercancía (Formulario Completo)</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUPPLIES CATEGORIES GRID (Bold Clean Cards) */}
        {state.visibleBlocks?.suppliesGrid !== false && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A202C] flex items-center gap-2.5">
                <PackageOpen className="w-6 h-6 text-[#008CBA]" />
                <span>Suministros Recaudados por Categoría</span>
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Kilos a Toneladas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {state.supplies.map((item) => {
                const pct = Math.min(100, Math.round((item.currentKilos / item.targetKilos) * 100));
                let barColor = 'bg-red-500';
                if (pct >= 75) barColor = 'bg-emerald-500';
                else if (pct >= 30) barColor = 'bg-amber-500';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#008CBA] transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#008CBA] block mb-1.5">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-sm text-[#1A202C] leading-snug mb-3">
                        {item.name}
                      </h3>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-2 font-mono">
                        <span className="text-xl font-black text-[#1A202C]">
                          {item.currentKilos.toLocaleString()} <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Meta: {item.targetKilos}
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
