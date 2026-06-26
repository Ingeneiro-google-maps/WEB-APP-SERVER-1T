import React from 'react';
import { Settings, HeartHandshake, Bot, RefreshCw, AlertTriangle } from 'lucide-react';
import { GlobalState } from '../types';

interface HeaderProps {
  state: GlobalState;
  onOpenAdmin: () => void;
  onOpenAi: () => void;
  isAdminView: boolean;
  lastSyncTime: string;
  onTriggerSync: () => void;
  syncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenAdmin,
  onOpenAi,
  isAdminView,
  lastSyncTime,
  onTriggerSync,
  syncing
}) => {
  const formattedSync = lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ahora';

  return (
    <header className="sticky top-0 z-40 bg-white text-[#1A202C] border-b border-slate-200 shadow-sm">
      {/* Top Emergency Red Alert Bar */}
      <div className="bg-red-600 text-white px-4 py-2 text-xs sm:text-sm font-bold tracking-wider uppercase flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="text-base leading-none">🇻🇪</span>
          <AlertTriangle className="w-4 h-4 animate-bounce shrink-0 text-amber-300" />
          <span>{state.headerAlertText || 'Emergencia Nacional #VEN-2026: Terremoto en Los Andes (Mérida, Trujillo, Táchira)'}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono font-medium">
          <span className="bg-red-700 px-2 py-0.5 rounded">Sincronización de Base de Datos Excel</span>
          <span>• Ayuda 100% Directa ONG</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-blue-600 to-red-600 p-0.5 rounded-2xl shadow-md shrink-0">
            <div className="w-full h-full bg-[#008CBA] rounded-[14px] flex items-center justify-center text-white font-black text-2xl italic leading-none">
              1T
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-3xl font-black tracking-tighter uppercase text-[#008CBA] leading-none flex items-center gap-2">
              <span>POR <span className="text-[#1A202C]">1 T</span></span>
              <span className="text-2xl" title="Venezuela">🇻🇪</span>
            </div>
            <div className="text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase mt-0.5 flex items-center gap-1">
              <span>Acción Humanitaria Emergencia Venezuela</span>
            </div>
          </div>
        </div>

        {/* Navigation links & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden xl:flex items-center gap-5 font-bold text-xs tracking-widest uppercase text-slate-500">
            <a href="#iniciativa" className="hover:text-[#008CBA] transition">Iniciativa</a>
            {state.visibleBlocks?.centersGrid !== false && (
              <a href="#centros" className="hover:text-[#008CBA] transition">Centros Acopio España</a>
            )}
            {state.visibleBlocks?.donationsList !== false && (
              <a href="#donaciones-list" className="hover:text-[#008CBA] transition text-[#008CBA] font-extrabold">Listado de Donaciones</a>
            )}
            {state.visibleBlocks?.newsSection !== false && (
              <a href="#noticias" className="hover:text-[#008CBA] transition">Noticias</a>
            )}
            {state.visibleBlocks?.faqSection !== false && (
              <a href="#faq" className="hover:text-[#008CBA] transition">FAQ</a>
            )}
            {state.visibleBlocks?.suggestionsSection !== false && (
              <a href="#sugerencias" className="hover:text-[#008CBA] transition">Sugerencias</a>
            )}
          </div>

          {/* Drive Excel Sync Trigger */}
          <button
            onClick={onTriggerSync}
            disabled={syncing}
            title={`Sincronización automática de Excel cada 10 minutos. Última: ${formattedSync}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono font-bold transition border border-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#008CBA] ${syncing ? 'animate-spin' : ''}`} />
            <span>Auto: Cada 10m</span>
          </button>

          {/* Admin Exit Button (Only visible if currently in Admin view) */}
          {isAdminView && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>← Salir Admin</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
