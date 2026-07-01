import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, HandHeart, Sparkles, User } from 'lucide-react';

interface DonationPotProps {
  currentEuros: number;
  phase1: number;
  phase2: number;
  phase3: number;
  template?: string;
  showRecentDonors?: boolean;
}

const DONOR_NAMES = [
  "María G.", "Carlos R.", "José F.", "Ana M.", "Luisa P.", 
  "Miguel A.", "Sofía T.", "Juan C.", "Carmen L.", "David S.",
  "Elena B.", "Pedro N.", "Lucía V.", "Diego M.", "Valeria R.",
  "Gabriel O.", "Isabella D.", "Andrés C.", "Camila H.", "Javier E."
];

const generateDonorsToMatchTotal = (total: number) => {
  if (total <= 0) return [];
  const donors = [];
  let sum = 0;
  let idCounter = 1;
  
  // Target a manageable number of items (e.g., 30-50) so the list doesn't get too massive for huge amounts
  const targetCount = 40;
  let avgAmount = Math.max(5, Math.ceil(total / targetCount));
  
  while (sum < total) {
    let amount = Math.floor(Math.random() * (avgAmount * 1.2)) + Math.floor(avgAmount * 0.8);
    // Round to nearest 5 for realistic looking donations
    amount = Math.ceil(amount / 5) * 5;
    
    if (sum + amount > total) {
      amount = total - sum;
    }
    
    if (amount <= 0) break;

    const name = DONOR_NAMES[Math.floor(Math.random() * DONOR_NAMES.length)];
    donors.push({ id: `gen-${idCounter++}-${Math.random().toString(36).substring(7)}`, name, amount });
    sum += amount;
  }
  
  return donors.reverse(); // Newest/last generated at the top
};

export const DonationPot: React.FC<DonationPotProps> = ({ 
  currentEuros, phase1, phase2, phase3, 
  template = 'template1', showRecentDonors = false 
}) => {
  const [prevEuros, setPrevEuros] = useState(currentEuros);
  const [showThankYou, setShowThankYou] = useState(false);
  const [recentDonors, setRecentDonors] = useState<any[]>([]);

  // Generate initial breakdown
  useEffect(() => {
    if (showRecentDonors) {
      setRecentDonors(generateDonorsToMatchTotal(currentEuros));
    }
  }, [showRecentDonors]);

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

  const percentage = Math.min(100, Math.round((currentEuros / activeTarget) * 100));

  // Trigger animation and update donor breakdown when currentEuros increases
  useEffect(() => {
    if (currentEuros !== prevEuros) {
      if (currentEuros > prevEuros) {
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);
        }, 4000);
      }
      
      if (showRecentDonors) {
        const currentSum = recentDonors.reduce((acc, d) => acc + d.amount, 0);
        
        if (currentEuros > currentSum && recentDonors.length > 0) {
          // Add a new donor for the exact difference
          const diff = currentEuros - currentSum;
          const name = DONOR_NAMES[Math.floor(Math.random() * DONOR_NAMES.length)];
          const newDonor = { id: `diff-${Date.now()}`, name, amount: diff };
          setRecentDonors(prev => [newDonor, ...prev]);
        } else if (currentEuros !== currentSum) {
          // Regenerate completely if the amount dropped or there are no donors
          setRecentDonors(generateDonorsToMatchTotal(currentEuros));
        }
      }
      
      setPrevEuros(currentEuros);
    }
  }, [currentEuros, prevEuros, showRecentDonors, recentDonors]);

  // Template Styles configuration
  const templateStyles: Record<string, any> = {
    template1: { // Elegante Fundación (Azul/Blanco)
      container: "bg-white border-slate-100 shadow-2xl text-slate-900",
      accent: "text-[#1464A5]",
      barBg: "bg-slate-100",
      barFill: "bg-gradient-to-r from-[#1464A5] to-[#49A5E6]",
      tag: "bg-slate-50 text-slate-600 border-slate-200",
      donorBg: "bg-slate-50 border-slate-200",
    },
    template2: { // Moderno Neón (Oscuro/Brillante)
      container: "bg-slate-950 border-slate-800 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-white",
      accent: "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      barBg: "bg-slate-900",
      barFill: "bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
      tag: "bg-slate-900 text-emerald-400 border-emerald-900",
      donorBg: "bg-slate-900 border-slate-800",
    },
    template3: { // Minimalista (Grises/Limpios)
      container: "bg-zinc-50 border-zinc-200 shadow-sm text-zinc-800",
      accent: "text-zinc-900",
      barBg: "bg-zinc-200",
      barFill: "bg-zinc-800",
      tag: "bg-white text-zinc-600 border-zinc-200",
      donorBg: "bg-white border-zinc-100",
    },
    template4: { // Cálido Esperanza (Naranja/Oro)
      container: "bg-orange-50/50 border-orange-100 shadow-xl text-stone-800",
      accent: "text-orange-600",
      barBg: "bg-orange-100",
      barFill: "bg-gradient-to-r from-orange-500 to-amber-400",
      tag: "bg-white text-orange-700 border-orange-200",
      donorBg: "bg-white border-orange-200",
    },
    template5: { // Tecnológico (Cyan/Malla)
      container: "bg-blue-950 border-blue-900 shadow-2xl text-blue-50 relative overflow-hidden",
      accent: "text-cyan-400",
      barBg: "bg-blue-900",
      barFill: "bg-gradient-to-r from-blue-500 to-cyan-400",
      tag: "bg-blue-900/50 text-cyan-300 border-blue-800",
      donorBg: "bg-blue-900/50 border-blue-800",
    },
    template6: { // Orgánico (Verde/Naturaleza)
      container: "bg-green-50 border-green-100 shadow-lg text-emerald-900",
      accent: "text-emerald-600",
      barBg: "bg-green-200/50",
      barFill: "bg-gradient-to-r from-emerald-600 to-green-400",
      tag: "bg-white text-emerald-700 border-green-200",
      donorBg: "bg-white border-green-200",
    },
    template7: { // Royal (Púrpura/Dorado)
      container: "bg-indigo-950 border-indigo-900 shadow-2xl text-indigo-50",
      accent: "text-yellow-400",
      barBg: "bg-indigo-900",
      barFill: "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200",
      tag: "bg-indigo-900/50 text-yellow-400 border-indigo-800",
      donorBg: "bg-indigo-900/50 border-indigo-800 text-indigo-100",
    },
    template8: { // Corporativo (Gris Pizarra/Azul)
      container: "bg-slate-100 border-slate-300 shadow-md text-slate-800",
      accent: "text-blue-700",
      barBg: "bg-slate-300",
      barFill: "bg-gradient-to-r from-slate-700 to-slate-500",
      tag: "bg-white text-slate-600 border-slate-300",
      donorBg: "bg-white border-slate-200",
    },
    template9: { // Festivo (Multicolor)
      container: "bg-white border-pink-200 shadow-xl text-slate-800",
      accent: "text-pink-600",
      barBg: "bg-slate-100",
      barFill: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
      tag: "bg-pink-50 text-pink-700 border-pink-200",
      donorBg: "bg-pink-50 border-pink-100",
    },
    template10: { // Ultra-Premium (Negro/Platino)
      container: "bg-black border-zinc-800 shadow-2xl text-zinc-100",
      accent: "text-zinc-300",
      barBg: "bg-zinc-900",
      barFill: "bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-200",
      tag: "bg-zinc-900 text-zinc-300 border-zinc-800",
      donorBg: "bg-zinc-900 border-zinc-800",
    }
  };

  const style = templateStyles[template] || templateStyles['template1'];

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

      <div className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden group transition-colors duration-500 ${style.container}`}>
        
        {/* Elegant Background Accents (only visible in template 1 for simplicity or apply subtly) */}
        {template === 'template1' && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#1464A5]/10 to-transparent rounded-bl-[100px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1464A5]/5 to-transparent rounded-tr-[100px] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
          </>
        )}

        <div className="relative z-10 flex flex-col items-center">
          
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border mb-8 transition-colors ${style.tag}`}>
            <Activity className="w-4 h-4" />
            Objetivo Actual - {phaseName}
          </div>
          
          <div className="relative mb-6">
            <h3 className={`text-6xl sm:text-7xl font-light tracking-tighter transition-colors ${style.accent}`}>
              € {currentEuros.toLocaleString('es-ES')}
            </h3>
            <AnimatePresence>
              {showThankYou && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  className={`absolute -top-6 -right-12 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 ${template === 'template2' ? 'bg-emerald-500' : 'bg-[#1464A5]'}`}
                >
                  <Sparkles className="w-3 h-3" />
                  ¡Gracias!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between text-sm font-medium opacity-60 mb-3 px-1">
              <span>Recaudado</span>
              <span>Meta: € {activeTarget.toLocaleString('es-ES')}</span>
            </div>
            
            <div className={`w-full rounded-full h-3 sm:h-4 overflow-hidden border border-white/10 shadow-inner relative transition-colors ${style.barBg}`}>
              <motion.div 
                className={`h-full rounded-full relative overflow-hidden transition-colors ${style.barFill}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Subtle highlight inside the bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
              </motion.div>
            </div>
            
            <div className="mt-4 flex justify-between items-center px-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded-md opacity-80 ${style.tag}`}>
                {percentage}% Alcanzado
              </span>
              <a href="#dona-ahora" className="text-sm font-semibold opacity-80 hover:opacity-100 transition-colors flex items-center gap-1">
                Colabora con la causa <Heart className="w-4 h-4 fill-current opacity-70" />
              </a>
            </div>
          </div>
          
          {/* Dynamic Recent Donors List */}
          {showRecentDonors && (
            <div className="w-full max-w-3xl mx-auto mt-12 pt-8 border-t border-current border-opacity-10">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-6 opacity-60 text-center flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" /> Últimas Aportaciones
              </h4>
              <div className="overflow-y-auto max-h-[350px] relative w-full pr-2">
                <div className="flex flex-col gap-3 pb-8 relative z-0">
                  <AnimatePresence initial={false}>
                    {recentDonors.map((donor, idx) => (
                      <motion.div
                        key={donor.id}
                        initial={{ opacity: 0, y: -30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`flex items-center justify-between p-3 sm:px-5 rounded-xl border transition-colors ${style.donorBg}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${style.tag}`}>
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{donor.name}</p>
                            <p className="text-xs opacity-60">Hace unos momentos</p>
                          </div>
                        </div>
                        <div className={`font-bold ${style.accent}`}>
                          + €{donor.amount}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
