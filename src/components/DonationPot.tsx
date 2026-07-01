import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, HandHeart, Sparkles } from 'lucide-react';

interface DonationPotProps {
  currentEuros: number;
  phase1: number;
  phase2: number;
  phase3: number;
}

export const DonationPot: React.FC<DonationPotProps> = ({ currentEuros, phase1, phase2, phase3 }) => {
  const [prevEuros, setPrevEuros] = useState(currentEuros);
  const [showThankYou, setShowThankYou] = useState(false);

  // Determine active phase
  let activeTarget = phase1 || 1000;
  let phaseName = "Fase 1";
  
  if (currentEuros >= (phase2 || 200000)) {
    activeTarget = phase3 || 300000;
    phaseName = "Fase 3";
  } else if (currentEuros >= (phase1 || 1000)) {
    activeTarget = phase2 || 200000;
    phaseName = "Fase 2";
  }

  // Trigger animation when currentEuros increases
  useEffect(() => {
    if (currentEuros > prevEuros) {
      setShowThankYou(true);
      setPrevEuros(currentEuros);
      
      setTimeout(() => {
        setShowThankYou(false);
      }, 4000);
    }
  }, [currentEuros, prevEuros]);

  const percentage = activeTarget > 0 ? Math.min(100, Math.round((currentEuros / activeTarget) * 100)) : 100;

  return (
    <div id="donations-section" className="mt-16 sm:mt-24 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 tracking-tight flex items-center justify-center gap-3">
          <HandHeart className="w-8 h-8 text-[#1464A5]" />
          Fondo de Asistencia Humanitaria
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium">
          Nuestra campaña de recaudación de fondos destinada a proveer soporte vital, medicinas y recursos esenciales a quienes más lo necesitan.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-2xl relative overflow-hidden group">
        
        {/* Elegant Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#1464A5]/10 to-transparent rounded-bl-[100px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1464A5]/5 to-transparent rounded-tr-[100px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

        <div className="relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold tracking-widest uppercase border border-slate-200 mb-8">
            <Activity className="w-4 h-4 text-[#1464A5]" />
            Objetivo Actual - {phaseName}
          </div>
          
          <div className="relative mb-6">
            <h3 className="text-6xl sm:text-7xl font-light text-[#072146] tracking-tighter">
              € {currentEuros.toLocaleString('es-ES')}
            </h3>
            <AnimatePresence>
              {showThankYou && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  className="absolute -top-6 -right-12 bg-[#1464A5] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  ¡Gracias!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between text-sm font-medium text-slate-500 mb-3 px-1">
              <span>Recaudado</span>
              <span>Meta: € {activeTarget.toLocaleString('es-ES')}</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-200/60 shadow-inner relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#1464A5] to-[#49A5E6] rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Subtle highlight inside the bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
              </motion.div>
            </div>
            
            <div className="mt-4 flex justify-between items-center px-1">
              <span className="text-xs font-semibold text-[#1464A5] bg-[#1464A5]/10 px-2 py-1 rounded-md">
                {percentage}% Alcanzado
              </span>
              <a href="#dona-ahora" className="text-sm font-semibold text-slate-800 hover:text-[#1464A5] transition-colors flex items-center gap-1">
                Colabora con la causa <Heart className="w-4 h-4 fill-current opacity-70" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

