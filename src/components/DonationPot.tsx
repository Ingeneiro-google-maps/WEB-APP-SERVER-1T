import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Heart, HandCoins, Activity, Shirt, MapPin } from 'lucide-react';

interface DonationPotProps {
  currentEuros: number;
  phase1: number;
  phase2: number;
  phase3: number;
}

export const DonationPot: React.FC<DonationPotProps> = ({ currentEuros, phase1, phase2, phase3 }) => {
  const [prevEuros, setPrevEuros] = useState(currentEuros);
  const [animatingCoins, setAnimatingCoins] = useState<{ id: number; delay: number; xOffset: number }[]>([]);

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
      // Trigger coins!
      const newCoins = Array.from({ length: 15 }).map((_, i) => ({
        id: Date.now() + i,
        delay: Math.random() * 0.5,
        xOffset: (Math.random() - 0.5) * 80
      }));
      setAnimatingCoins(prev => [...prev, ...newCoins].slice(-30)); // Keep max 30 to avoid lag
      
      setPrevEuros(currentEuros);
      
      // Cleanup after animation
      setTimeout(() => {
        setAnimatingCoins([]);
      }, 3000);
    }
  }, [currentEuros, prevEuros]);

  const percentage = activeTarget > 0 ? Math.min(100, Math.round((currentEuros / activeTarget) * 100)) : 100;

  return (
    <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-lg relative overflow-hidden">
      {/* Background Decorative Icons */}
      <div className="absolute top-4 right-4 text-amber-200/40 transform rotate-12">
        <MapPin className="w-24 h-24" /> {/* Venezuela Flag conceptually / Map */}
      </div>
      <div className="absolute bottom-4 left-4 text-amber-200/40 transform -rotate-12">
        <Activity className="w-16 h-16" /> {/* Medicina */}
      </div>
      <div className="absolute top-12 left-1/4 text-amber-200/40 transform -rotate-12">
        <Shirt className="w-12 h-12" /> {/* Ropa */}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Pot / Chest Visual */}
        <motion.div 
          className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 flex items-end justify-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const newCoins = Array.from({ length: 5 }).map((_, i) => ({
              id: Date.now() + i + Math.random(),
              delay: Math.random() * 0.2,
              xOffset: (Math.random() - 0.5) * 80
            }));
            setAnimatingCoins(prev => [...prev, ...newCoins].slice(-30));
            setTimeout(() => {
              setAnimatingCoins(prev => prev.filter(c => !newCoins.find(nc => nc.id === c.id)));
            }, 3000);
          }}
        >
          {/* Base Pot SVG */}
          <motion.div 
            className="absolute inset-0 z-10 drop-shadow-xl text-amber-600 flex items-end justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 100" className="w-40 h-40 sm:w-56 sm:h-56">
              <path d="M 20 40 Q 10 90 30 90 L 70 90 Q 90 90 80 40 L 95 35 Q 90 20 80 25 L 20 25 Q 10 20 5 35 L 20 40 Z" fill="currentColor" />
              <path d="M 20 25 L 80 25 Q 90 20 95 35 L 5 35 Q 10 20 20 25 Z" fill="#b45309" />
              {/* Chest / Pot details */}
              <rect x="45" y="50" width="10" height="15" rx="2" fill="#78350f" />
              <circle cx="50" cy="57" r="2" fill="#fbbf24" />
            </svg>
          </motion.div>

          {/* Fill level representing coins */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 sm:w-40 h-28 sm:h-40 overflow-hidden z-20 rounded-b-[2rem]">
            <motion.div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 via-amber-400 to-yellow-300"
              initial={{ height: 0 }}
              animate={{ height: `${percentage}%` }}
              transition={{ type: "spring", duration: 1.5, bounce: 0.3 }}
            >
              {/* Sparkles on top of the liquid coins */}
              <div className="absolute top-0 left-0 w-full h-4 bg-yellow-200/50 blur-sm rounded-full"></div>
            </motion.div>
          </div>

          {/* Falling Coins Animation */}
          <AnimatePresence>
            {animatingCoins.map(coin => (
              <motion.div
                key={coin.id}
                initial={{ y: -150, opacity: 0, x: coin.xOffset, rotate: 0 }}
                animate={{ y: 20, opacity: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, delay: coin.delay, type: "spring" }}
                className="absolute top-0 z-30 text-yellow-500"
              >
                <Coins className="w-8 h-8 drop-shadow-md fill-yellow-400" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Info Text */}
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-amber-200">
            <HandCoins className="w-4 h-4" />
            Fondo de Donaciones (Euros) - {phaseName}
          </div>
          
          <h3 className="text-4xl sm:text-5xl font-black text-[#1A202C] mb-2 tracking-tighter">
            € {currentEuros.toLocaleString('es-ES')}
          </h3>
          
          <p className="text-amber-700 font-medium mb-6">
            Meta {phaseName}: € {activeTarget.toLocaleString('es-ES')} ({percentage}%)
          </p>

          <div className="w-full max-w-md bg-amber-200/50 rounded-full h-4 overflow-hidden border border-amber-300 mx-auto md:mx-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          <p className="text-sm text-amber-600 mt-4 font-semibold">
            ¡Cada moneda cuenta! Ayúdanos a llenar el cofre para proveer medicinas, ropa y suministros esenciales a Venezuela.
          </p>
        </div>
      </div>
    </div>
  );
};
