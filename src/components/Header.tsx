import React, { useState } from 'react';
import { Settings, HeartHandshake, Bot, RefreshCw, AlertTriangle, Menu, X, ChevronDown } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formattedSync = lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ahora';

  return (
    <header className="sticky top-0 z-40 bg-white text-[#1A202C] border-b border-slate-200 shadow-sm">
      {/* Top Emergency Red Alert Bar */}
      <div className="bg-red-600 text-white px-4 py-2 text-xs sm:text-sm font-bold tracking-wider uppercase flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="text-base leading-none">🇻🇪</span>
          <AlertTriangle className="w-4 h-4 animate-bounce shrink-0 text-amber-300" />
          <span>{state.headerAlertText || 'Emergencia Nacional #VEN-2026: Terremoto'}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono font-medium">
          <span className="bg-red-700 px-2 py-0.5 rounded flex items-center gap-1.5">
            Sincronización de Base de Datos Excel <span className="bg-white text-red-700 px-1.5 py-0.2 text-[10px] font-black rounded-sm">v{state.codeVersion || "1.2"}</span>
          </span>
          <span>• Des. web: Ing. Orlando , Galdámez</span>
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
            <div className="text-[8px] xs:text-[10px] sm:text-xs font-bold tracking-normal sm:tracking-widest text-slate-400 uppercase mt-0.5 flex items-center gap-1">
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
            {state.visibleBlocks?.whatsappSection !== false && (
              <a href="#whatsapp" className="hover:text-[#25D366] transition flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                Chat al Vivo
              </a>
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

          {/* Mobile Secciones Dropdown (Highly optimized side menu for mobile and tablet screens) */}
          {!isAdminView && (
            <div className="relative xl:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-[#008CBA] hover:text-white text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm cursor-pointer border border-slate-200"
              >
                {isMenuOpen ? <X className="w-3.5 h-3.5 text-rose-500 shrink-0" /> : <Menu className="w-3.5 h-3.5 text-[#008CBA] shrink-0" />}
                <span>Menú</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 shrink-0 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Collapsible Dropdown Menu Panel (Absolutely positioned on one side) */}
              {isMenuOpen && (
                <>
                  {/* Backdrop for easy closing click-outside */}
                  <div className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-xs" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-40 animate-fade-in divide-y divide-slate-100">
                    <div className="px-4 pb-2">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                        📱 Secciones de la Web
                      </span>
                      <p className="text-[9px] text-slate-400 font-medium leading-normal">Toca para ir directo a la sección:</p>
                    </div>
                    
                    <div className="py-1 flex flex-col">
                      <a 
                        href="#iniciativa" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#008CBA] text-xs font-bold transition-all"
                      >
                        <span className="text-base bg-slate-100 p-1.5 rounded-xl shrink-0">🏠</span>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">La Iniciativa</span>
                          <span className="text-[9px] text-slate-400 font-normal truncate">Meta global y objetivos</span>
                        </div>
                      </a>
                      
                      {state.visibleBlocks?.centersGrid !== false && (
                        <a 
                          href="#centros" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#008CBA] text-xs font-bold transition-all"
                        >
                          <span className="text-base bg-slate-100 p-1.5 rounded-xl shrink-0">📍</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">Centros Acopio España</span>
                            <span className="text-[9px] text-slate-400 font-normal truncate">Lugares de entrega autorizados</span>
                          </div>
                        </a>
                      )}
                      
                      {state.visibleBlocks?.donationsList !== false && (
                        <a 
                          href="#donaciones-list" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 bg-[#008CBA]/5 hover:bg-[#008CBA]/10 text-[#008CBA] text-xs font-black transition-all"
                        >
                          <span className="text-base bg-[#008CBA]/10 p-1.5 rounded-xl shrink-0 text-[#008CBA]">📋</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-black">Listado Donaciones</span>
                            <span className="text-[9px] text-[#008CBA]/70 font-medium truncate">Envíos registrados en vivo</span>
                          </div>
                        </a>
                      )}
                      
                      {state.visibleBlocks?.newsSection !== false && (
                        <a 
                          href="#noticias" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#008CBA] text-xs font-bold transition-all"
                        >
                          <span className="text-base bg-slate-100 p-1.5 rounded-xl shrink-0">🔔</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">Noticias y Boletín</span>
                            <span className="text-[9px] text-slate-400 font-normal truncate">Reportes de envío a Venezuela</span>
                          </div>
                        </a>
                      )}
                      
                      {state.visibleBlocks?.faqSection !== false && (
                        <a 
                          href="#faq" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#008CBA] text-xs font-bold transition-all"
                        >
                          <span className="text-base bg-slate-100 p-1.5 rounded-xl shrink-0">❓</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">Preguntas Frecuentes</span>
                            <span className="text-[9px] text-slate-400 font-normal truncate">Dudas sobre logística y aduanas</span>
                          </div>
                        </a>
                      )}
                      
                      {state.visibleBlocks?.whatsappSection !== false && (
                        <a 
                          href="#whatsapp" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#25D366] text-xs font-bold transition-all"
                        >
                          <span className="text-base bg-emerald-50 text-[#25D366] p-1.5 rounded-xl shrink-0 shadow-sm animate-pulse">💬</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-[#25D366]">Chat al Vivo</span>
                            <span className="text-[9px] text-slate-400 font-normal truncate">Coordinación de envíos en tiempo real</span>
                          </div>
                        </a>
                      )}
                      
                      {state.visibleBlocks?.suggestionsSection !== false && (
                        <a 
                          href="#sugerencias" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#008CBA] text-xs font-bold transition-all"
                        >
                          <span className="text-base bg-slate-100 p-1.5 rounded-xl shrink-0">💡</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">Sugerencias y Dudas</span>
                            <span className="text-[9px] text-slate-400 font-normal truncate">Canal de contacto directo</span>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
