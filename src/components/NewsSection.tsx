import React from 'react';
import { NewsItem } from '../types';
import { Bell, Info, AlertTriangle, AlertCircle, Calendar, User } from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  if (!news || news.length === 0) return null;

  const getSeverityStyles = (severity: 'green' | 'orange' | 'red') => {
    switch (severity) {
      case 'red':
        return {
          bg: 'bg-red-50 hover:bg-red-100/80',
          border: 'border-red-300 left-red-500',
          text: 'text-red-900',
          badgeBg: 'bg-red-500 text-white',
          icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          label: '🔴 URGENTE / ROJO'
        };
      case 'orange':
        return {
          bg: 'bg-amber-50 hover:bg-amber-100/80',
          border: 'border-amber-300 left-amber-500',
          text: 'text-amber-900',
          badgeBg: 'bg-amber-500 text-slate-950',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          label: '🟠 IMPORTANTE / NARANJA'
        };
      case 'green':
      default:
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/80',
          border: 'border-emerald-300 left-emerald-500',
          text: 'text-emerald-900',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <Info className="w-5 h-5 text-emerald-600 shrink-0" />,
          label: '🟢 INFORMATIVO / VERDE'
        };
    }
  };

  return (
    <section id="noticias" className="bg-[#F4F7F9] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#008CBA] mb-2 block flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#008CBA] animate-pulse" />
              Actualizaciones Oficiales ONG
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#1A202C]">
              ÚLTIMAS NOTICIAS Y AVISOS
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium mt-2 max-w-2xl">
              Mensajes oficiales emitidos directamente por la Administración de la campaña sobre logística, despachos aéreos y conteo de toneladas.
            </p>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
            const styles = getSeverityStyles(item.severity);
            return (
              <article
                key={item.id}
                className={`p-6 sm:p-7 rounded-3xl border ${styles.border} ${styles.bg} transition-all shadow-sm hover:shadow-md flex flex-col justify-between relative border-l-8`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles.badgeBg}`}>
                      {styles.label}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-black tracking-tight ${styles.text} mb-3 flex items-start gap-2.5`}>
                    {styles.icon}
                    <span>{item.title}</span>
                  </h3>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 whitespace-pre-line font-medium">
                    {item.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <User className="w-3.5 h-3.5" />
                    Emitido por:
                  </span>
                  <span className="font-mono bg-white/70 px-2.5 py-1 rounded-lg border border-black/5">
                    {item.author || 'Administrador'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
