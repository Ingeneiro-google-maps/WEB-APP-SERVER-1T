import React, { useEffect } from 'react';
import { GlobalState } from '../types';
import { Scale, RefreshCw, HeartHandshake, PackageOpen } from 'lucide-react';
import { fireConfetti as confetti } from '../utils/confettiWrapper';
import { DonationPot } from './DonationPot';

function getYoutubeId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('?')) {
    return cleanUrl;
  }
  if (cleanUrl.includes('/shorts/')) {
    const parts = cleanUrl.split('/shorts/');
    if (parts[1]) {
      const id = parts[1].split(/[?#&]/)[0];
      if (id.length === 11) return id;
    }
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

  const [balloons, setBalloons] = React.useState<{ id: number; left: number; color: string; size: number; delay: number }[]>([]);
  const [sparkles, setSparkles] = React.useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);

  // Celebration trigger when >= 100%
  useEffect(() => {
    if (progressRatio >= 100) {
      const type = state.celebrationType || 'confetti';
      if (type === 'none') return;

      try {
        if (type === 'confetti') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.65 }
          });
        } else if (type === 'fireworks') {
          const duration = 6 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
              return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 } });
          }, 250);
        } else if (type === 'balloons') {
          const colors = [
            'bg-rose-500', 'bg-sky-500', 'bg-amber-500', 'bg-emerald-500',
            'bg-violet-500', 'bg-pink-500', 'bg-yellow-500', 'bg-teal-500', 'bg-cyan-500'
          ];
          const newBalloons = Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            left: Math.random() * 90 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 25 + 35,
            delay: Math.random() * 5
          }));
          setBalloons(newBalloons);
          setTimeout(() => setBalloons([]), 11000);
        } else if (type === 'sparkles') {
          const newSparkles = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 94 + 3,
            top: Math.random() * 85 + 5,
            size: Math.random() * 15 + 10,
            delay: Math.random() * 5
          }));
          setSparkles(newSparkles);
          setTimeout(() => setSparkles([]), 11000);
        }
      } catch (e) {
        console.error('Error running celebration:', e);
      }
    }
  }, [progressRatio, state.celebrationType]);

  // Determine stage description & color logic: Red -> Yellow/Orange -> Green
  let stageTextClass = 'text-red-600 bg-red-50 border-red-200';
  let stageName = state.liveCounterStateRedLabel !== undefined ? state.liveCounterStateRedLabel : 'ROJO — DÉFICIT CRÍTICO INICIAL';

  if (progressRatio >= 75) {
    stageTextClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    stageName = state.liveCounterStateGreenLabel !== undefined ? state.liveCounterStateGreenLabel : 'VERDE — ¡META PRÓXIMA / ALCANZADA!';
  } else if (progressRatio >= 30) {
    stageTextClass = 'text-amber-700 bg-amber-50 border-amber-300';
    stageName = state.liveCounterStateOrangeLabel !== undefined ? state.liveCounterStateOrangeLabel : 'NARANJA / AMARILLO — EN PROGRESO CONSTANTE';
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
              {state.liveCounterShowStateBadge !== false && (
                <div className="mb-4">
                  <div className={`px-3.5 py-1.5 rounded-lg border text-xs font-black tracking-wider uppercase inline-flex items-center gap-2 ${stageTextClass}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    <span>ESTADO: {stageName || 'OCULTO'} ({progressRatio.toFixed(1)}%)</span>
                  </div>
                </div>
              )}

              {/* STYLES & OVERLAYS FOR THE CELEBRATIONS */}
              <style>{`
                @keyframes progress-stripes {
                  0% { background-position: 1.5rem 0; }
                  100% { background-position: 0 0; }
                }
                @keyframes pulse-glow {
                  0%, 100% { filter: drop-shadow(0 0 4px rgba(6,182,212,0.6)); opacity: 0.8; }
                  50% { filter: drop-shadow(0 0 20px rgba(6,182,212,1)); opacity: 1; }
                }
                @keyframes wave-preview {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes floatUp {
                  0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { transform: translateY(-20vh) rotate(15deg); opacity: 0; }
                }
                @keyframes sparkleTwinkle {
                  0% { transform: scale(0) rotate(0deg); opacity: 0; }
                  20% { transform: scale(1.2) rotate(45deg); opacity: 1; }
                  40% { transform: scale(0.8) rotate(90deg); opacity: 0.8; }
                  65% { transform: scale(1.3) rotate(135deg); opacity: 1; }
                  100% { transform: scale(0) rotate(180deg); opacity: 0; }
                }
              `}</style>

              {/* Balloons Celebration Overlay */}
              {balloons.length > 0 && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                  {balloons.map((b) => (
                    <div
                      key={b.id}
                      className={`fixed bottom-0 rounded-full ${b.color} shadow-lg pointer-events-none flex items-center justify-center`}
                      style={{
                        left: `${b.left}%`,
                        width: `${b.size}px`,
                        height: `${b.size * 1.25}px`,
                        animation: `floatUp 7s ease-in-out forwards`,
                        animationDelay: `${b.delay}s`,
                      }}
                    >
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-t-4 border-l-4 border-r-4 border-transparent border-t-inherit" />
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-slate-400 opacity-60" />
                      <div className="absolute top-2 left-3 w-2.5 h-2.5 bg-white/40 rounded-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Sparkles Celebration Overlay */}
              {sparkles.length > 0 && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                  {sparkles.map((s) => (
                    <svg
                      key={s.id}
                      className="fixed text-yellow-300 pointer-events-none fill-current drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"
                      viewBox="0 0 24 24"
                      style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animation: `sparkleTwinkle 4s ease-in-out forwards`,
                        animationDelay: `${s.delay}s`,
                      }}
                    >
                      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* THE PROGRESS BAR (Customizable with state.progressBarStyle) */}
              {(!state.progressBarStyle || state.progressBarStyle === 'default') && (
                <div className="relative h-14 sm:h-16 w-full bg-slate-200 rounded-2xl overflow-hidden shadow-inner flex border-4 border-white mb-3">
                  <div className="flex w-full h-full opacity-25">
                    <div className="h-full bg-red-500 w-[25%]"></div>
                    <div className="h-full bg-orange-500 w-[25%]"></div>
                    <div className="h-full bg-yellow-400 w-[25%]"></div>
                    <div className="h-full bg-emerald-500 w-[25%]"></div>
                  </div>
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 to-emerald-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-end px-4 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(8, progressRatio)}%` }}
                  >
                    <div className="h-4 w-4 bg-white rounded-full shadow-md animate-pulse flex items-center justify-center">
                      <div className="h-2 w-2 bg-[#1A202C] rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {state.progressBarStyle === 'striped-animated' && (
                <div className="relative h-14 sm:h-16 w-full bg-slate-200 rounded-2xl overflow-hidden shadow-inner flex border-4 border-white mb-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(8, progressRatio)}%`,
                      backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                      backgroundSize: '1.5rem 1.5rem',
                      animation: 'progress-stripes 1.2s linear infinite'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-emerald-950 font-black text-xs sm:text-sm tracking-widest uppercase">
                      🚀 PROGRESO SOLIDARIO: {progressRatio.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {state.progressBarStyle === 'neon-glow' && (
                <div className="relative h-14 sm:h-16 w-full bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex border-4 border-slate-900 mb-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(8, progressRatio)}%`,
                      animation: 'pulse-glow 2s infinite'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-cyan-400 font-mono font-black text-xs sm:text-sm tracking-wider uppercase animate-pulse">
                      ⚡ FLUJO NEÓN ACTIVADO: {progressRatio.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {state.progressBarStyle === 'gradient-wave' && (
                <div className="relative h-14 sm:h-16 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner flex border-4 border-white mb-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 via-indigo-500 via-teal-400 to-emerald-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(8, progressRatio)}%`,
                      backgroundSize: '200% auto',
                      animation: 'wave-preview 4s linear infinite'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-black text-xs sm:text-sm tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      ✨ OLA METÁLICA WAVE: {progressRatio.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {state.progressBarStyle === 'retro-blocks' && (
                <div className="relative h-14 sm:h-16 w-full bg-black rounded-2xl overflow-hidden flex border-4 border-zinc-850 p-1 mb-3">
                  <div className="flex gap-1 w-full h-full">
                    {Array.from({ length: 25 }).map((_, index) => {
                      const threshold = (index / 25) * 100;
                      const isActive = progressRatio >= threshold;
                      return (
                        <div
                          key={index}
                          className={`h-full flex-1 transition-all duration-300 ${
                            isActive
                              ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.85)] animate-pulse'
                              : 'bg-zinc-950 border border-zinc-900'
                          } rounded-sm`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Progress Bar Legend */}
              {state.liveCounterShowLegends !== false && (
                <div className="flex justify-between px-1 text-[11px] font-black uppercase tracking-tight">
                  <span className="text-red-600">{state.liveCounterLegend0 !== undefined ? state.liveCounterLegend0 : '0% Rojo'}</span>
                  <span className="text-orange-600">{state.liveCounterLegend30 !== undefined ? state.liveCounterLegend30 : '30% Naranja'}</span>
                  <span className="text-yellow-600">{state.liveCounterLegend70 !== undefined ? state.liveCounterLegend70 : '70% Amarillo'}</span>
                  <span className="text-emerald-600">{state.liveCounterLegend100 !== undefined ? state.liveCounterLegend100 : '100% Verde'}</span>
                </div>
              )}
            </div>

            {/* Public Donation Registration CTA */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={onOpenDonation}
                className="w-full py-4 px-4 sm:px-6 bg-[#008CBA] hover:bg-[#007399] text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">📦 Registrar Donación / Mercancía (Formulario)</span>
                <span className="inline sm:hidden">📦 Registrar Donación / Mercancía</span>
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

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
              {state.supplies.map((item) => {
                const pct = Math.min(100, Math.round((item.currentKilos / item.targetKilos) * 100));
                let barColor = 'bg-red-500';
                if (pct >= 75) barColor = 'bg-emerald-500';
                else if (pct >= 30) barColor = 'bg-amber-500';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#008CBA] transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#008CBA] block mb-1.5 truncate" title={item.category}>
                        {item.category}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-[#1A202C] leading-snug mb-3 line-clamp-2" title={item.name}>
                        {item.name}
                      </h3>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline justify-between mb-2 font-mono gap-1">
                        <span className="text-sm sm:text-xl font-black text-[#1A202C]">
                          {item.currentKilos.toLocaleString()} <span className="text-[10px] sm:text-xs font-bold text-slate-400">{item.unit}</span>
                        </span>
                        <span className="text-[9px] sm:text-xs font-bold text-slate-400">
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
        
        {/* Euro Donations Animated Pot */}
        {state.donationsEurosEnabled !== false && state.donationsEuros !== undefined && (
          <DonationPot 
            currentEuros={state.donationsEuros} 
            phase1={state.donationsEurosPhase1 || 1000}
            phase2={state.donationsEurosPhase2 || 200000}
            phase3={state.donationsEurosPhase3 || 300000}
          />
        )}

      </div>
    </section>
  );
};
