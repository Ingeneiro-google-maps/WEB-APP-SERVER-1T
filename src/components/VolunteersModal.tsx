import React, { useEffect, useState } from 'react';
import { X, Search, Heart, Sparkles, Users, Award, Shield } from 'lucide-react';
import { Volunteer } from '../types';

interface VolunteersModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteers: Volunteer[];
}

// Utility to convert standard Dropbox links to direct download URLs
export const getDirectImageUrl = (url: string): string => {
  if (!url) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'; // fallback
  let clean = url.trim();
  if (clean.includes('dropbox.com')) {
    // Convert dl=0 or dl=1 to raw=1 to get direct file stream
    clean = clean.replace(/dl=0/g, 'raw=1').replace(/dl=1/g, 'raw=1');
    // Replace with direct domain to bypass preview page
    clean = clean.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }
  return clean;
};

export const VolunteersModal: React.FC<VolunteersModalProps> = ({ isOpen, onClose, volunteers = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.role && v.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Content Container */}
      <div className="relative w-full max-w-6xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] z-10 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Mural de la Solidaridad
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
              <Users className="w-7 h-7 text-emerald-400" />
              <span>Nuestros Héroes Voluntarios 🇻🇪</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Cada foto representa una mano amiga que dona su tiempo y esfuerzo incondicional en esta noble causa por Venezuela. ¡Ellos hacen posible llegar a la meta!
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-full transition-all cursor-pointer border border-slate-700/50 hover:scale-105"
            aria-label="Cerrar mural"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search and Stats */}
        <div className="p-4 sm:px-8 sm:py-4 bg-slate-900/40 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar voluntario o rol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 hover:bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Quick stats badges */}
          <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
            <div className="px-3.5 py-1.5 bg-slate-950/80 rounded-full border border-slate-800 text-slate-400 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Total en mural: <b className="text-white font-bold">{volunteers.length}</b></span>
            </div>
            <div className="px-3.5 py-1.5 bg-slate-950/80 rounded-full border border-slate-800 text-slate-400 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-rose-500" />
              <span className="text-white font-bold">¡Mil Gracias!</span>
            </div>
          </div>
        </div>

        {/* Mural Body (Grid of Volunteers) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="inline-flex p-4 bg-slate-900 rounded-full border border-slate-800 text-slate-600 mb-4 animate-bounce">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">No se encontraron voluntarios</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Prueba buscando otro nombre o categoría de apoyo. ¡Asegúrate de que esté registrado en el panel!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              {filteredVolunteers.map((vol, idx) => {
                // Alternating light rotation angles for a highly-crafted polaroid/mural look
                const rotations = ['rotate-1', '-rotate-1', 'rotate-[1.5deg]', 'rotate-[-1.5deg]', 'rotate-[0.5deg]', 'rotate-[-0.5deg]'];
                const rot = rotations[idx % rotations.length];

                return (
                  <div 
                    key={vol.id}
                    className={`group relative bg-white p-3 pb-5 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] text-slate-800 flex flex-col border border-slate-200/60 overflow-hidden ${rot}`}
                  >
                    {/* Tape effect on top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-16 h-4.5 bg-yellow-100/80 backdrop-blur-xs border-x border-b border-yellow-200/50 shadow-xs rounded-b-xs origin-center rotate-[-3deg] z-10 pointer-events-none" />

                    {/* Volunteer Photo */}
                    <div className="relative aspect-square w-full rounded bg-slate-100 overflow-hidden border border-slate-200/50">
                      <img 
                        src={getDirectImageUrl(vol.photoUrl)} 
                        alt={`Foto de ${vol.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Failover to avatar if image crashes
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      
                      {/* Interactive decorative overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                        <span className="text-[10px] bg-slate-900/90 text-white font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 animate-pulse" />
                          Héroe
                        </span>
                      </div>
                    </div>

                    {/* Volunteer info */}
                    <div className="mt-3.5 text-center flex-1 flex flex-col justify-between">
                      <h4 className="font-extrabold text-[#111827] text-sm sm:text-base tracking-tight leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {vol.name}
                      </h4>
                      {vol.role ? (
                        <span className="inline-block mt-1 text-[10px] sm:text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-wide">
                          {vol.role}
                        </span>
                      ) : (
                        <span className="inline-block mt-1 text-[10px] sm:text-xs text-slate-400 font-medium">
                          Voluntario Activo
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Campaña Oficial de Solidaridad de Teo y Santiago de Compostela</span>
          </div>
          <span className="hidden sm:inline font-mono">meta.1T_voluntarios_v1.7</span>
        </div>

      </div>
    </div>
  );
};
