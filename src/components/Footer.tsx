import React, { useState, useEffect } from 'react';
import { Heart, Lock, KeyRound, AlertCircle, X, Instagram, Users, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  onUnlockAdmin?: () => void;
  codeVersion?: string;
  publicVisitCounterEnabled?: boolean;
  publicVisitCounterBase?: number;
  publicVisitCounterStartDate?: string;
  publicVisitCounterUpdateInterval?: number;
}

export const Footer: React.FC<FooterProps> = ({ 
  onUnlockAdmin, 
  codeVersion = '1.0',
  publicVisitCounterEnabled = false,
  publicVisitCounterBase = 15000,
  publicVisitCounterStartDate = new Date().toISOString(),
  publicVisitCounterUpdateInterval = 4500
}) => {
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const [currentVisits, setCurrentVisits] = useState(publicVisitCounterBase);
  const [activeFlags, setActiveFlags] = useState<string[]>(['🇪🇸', '🇻🇪']);

  const LATAM_EU_FLAGS = [
    '🇪🇸', '🇻🇪', '🇨🇴', '🇦🇷', '🇲🇽', '🇵🇪', '🇨🇱', '🇪🇨', '🇮🇹', '🇫🇷', '🇩🇪', '🇵🇹', '🇬🇧', '🇺🇸'
  ];

  useEffect(() => {
    if (!publicVisitCounterEnabled) return;

    // Calculate base + daily visits
    const startDate = new Date(publicVisitCounterStartDate);
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceStart = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / msPerDay));
    
    // Base + ~300 per day since start
    const calculatedBase = publicVisitCounterBase + (daysSinceStart * 342);
    setCurrentVisits(calculatedBase);

    // Simulate new visits popping in
    const interval = setInterval(() => {
      // Randomly add 1 to 3 visits every few seconds
      setCurrentVisits(prev => prev + Math.floor(Math.random() * 3) + 1);
      
      // Randomly change a flag
      setActiveFlags(prev => {
        const newFlags = [...prev];
        if (Math.random() > 0.5) {
          const randomFlag = LATAM_EU_FLAGS[Math.floor(Math.random() * LATAM_EU_FLAGS.length)];
          // Keep array size max 5
          if (!newFlags.includes(randomFlag)) {
            newFlags.unshift(randomFlag);
            if (newFlags.length > 5) newFlags.pop();
          }
        }
        return newFlags;
      });
    }, publicVisitCounterUpdateInterval);

    return () => clearInterval(interval);
  }, [publicVisitCounterEnabled, publicVisitCounterBase, publicVisitCounterStartDate, publicVisitCounterUpdateInterval]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '8069987') {
      setIsLockModalOpen(false);
      setPassword('');
      setError(false);
      if (onUnlockAdmin) onUnlockAdmin();
    } else {
      setError(true);
    }
  };

  return (
    <>
      <footer className="py-8 px-6 sm:px-10 bg-white border-t border-slate-200 text-[#1A202C] relative overflow-hidden">
        {/* Subtle Venezuela Tricolor Top Border inside Footer */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/2 bg-[#FFCC00]"></div>
          <div className="w-1/4 bg-[#00247D]"></div>
          <div className="w-1/4 bg-[#CF142B]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#008CBA] rounded-lg flex items-center justify-center text-white font-black text-sm italic leading-none shadow-sm">
              1T
            </div>
            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 flex-wrap">
                <span>© 2026 Por 1T — Solidaridad ONG España con Venezuela 🇻🇪</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200 normal-case">Sincronización Excel v{codeVersion}</span>
              </p>
              <p className="text-[10px] font-bold text-[#008CBA] uppercase tracking-widest mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Desarrollo web realizado por el Ingeniero. Orlando Galdámez</span>
                <a 
                  href="https://www.instagram.com/ing.orlando.galdamez" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-md transition normal-case shrink-0"
                  title="Instagram de Orlando Galdámez"
                >
                  <Instagram className="w-3 h-3 text-pink-500 shrink-0" />
                  <span className="text-[9px] font-black lowercase font-sans">@ing.orlando.galdamez</span>
                </a>
                <span>- 2026</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-black uppercase text-slate-500 tracking-wider">
            <a href="#iniciativa" className="hover:text-[#008CBA] transition">Iniciativa</a>
            <a href="#centros" className="hover:text-[#008CBA] transition">Centros Acopio España</a>
            <a href="#noticias" className="hover:text-[#008CBA] transition">Noticias Sismo</a>
            <a href="#faq" className="hover:text-[#008CBA] transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-black uppercase text-[#008CBA] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span>#FuerzaVenezuela</span>
            </div>

            {/* Candadito Admin Access */}
            <button
              onClick={() => {
                setIsLockModalOpen(true);
                setError(false);
                setPassword('');
              }}
              title="Acceso Panel Administrador ONG"
              className="p-2 text-slate-300 hover:text-[#008CBA] hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* --- CONTADOR DE VISITAS PÚBLICO --- */}
        {publicVisitCounterEnabled && (
          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-center items-center gap-4 text-slate-600">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
              <Globe2 className="w-4 h-4 text-[#008CBA]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Visitas Totales:</span>
              <span className="font-mono font-bold text-slate-800 tracking-tight text-sm">
                {currentVisits.toLocaleString('es-ES')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visitantes en tiempo real:</span>
              <div className="flex -space-x-1">
                <AnimatePresence>
                  {activeFlags.map((flag, index) => (
                    <motion.div
                      key={`${flag}-${index}`}
                      initial={{ opacity: 0, scale: 0, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xs relative z-10"
                      style={{ zIndex: 10 - index }}
                    >
                      {flag}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

      </footer>

      {/* Lock Password Modal */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 border border-slate-200 shadow-2xl text-[#1A202C] relative">
            <button
              onClick={() => setIsLockModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black">
              <KeyRound className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-black uppercase tracking-tight text-center mb-1">
              Acceso Restringido
            </h4>
            <p className="text-xs text-slate-500 text-center font-medium mb-6">
              Ingrese clave de Administrador para gestionar inventario, donaciones y avisos.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Clave incorrecta. Intente de nuevo.</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Clave de seguridad..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-center font-mono font-black text-lg focus:outline-none focus:border-[#008CBA] focus:bg-white tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#008CBA] hover:bg-[#007299] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                Desbloquear Console
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
