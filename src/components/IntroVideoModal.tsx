import React, { useState, useEffect } from 'react';
import { X, Play, Volume2, Globe, Sparkles } from 'lucide-react';

interface IntroVideoModalProps {
  enabled: boolean;
  youtubeUrl: string;
  onClose: () => void;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
}

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

export const IntroVideoModal: React.FC<IntroVideoModalProps> = ({
  enabled,
  youtubeUrl,
  badgeText,
  title,
  subtitle,
  btnText,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const videoId = getYoutubeId(youtubeUrl);
  const isShorts = youtubeUrl.includes('/shorts/') || youtubeUrl.includes('instagram.com') || youtubeUrl.includes('tiktok.com');

  useEffect(() => {
    if (enabled && videoId) {
      const hasSeen = sessionStorage.getItem('hasSeenIntroVideo');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [enabled, videoId]);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenIntroVideo', 'true');
    setIsOpen(false);
    onClose();
  };

  if (!isOpen || !videoId) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md transition-all duration-700 animate-fade-in font-sans p-3 sm:p-6 overflow-y-auto">
      {/* Immersive background glowing effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#008CBA]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Dynamic container width: smaller & taller if shorts, standard widescreen if landscape */}
      <div className={`relative w-full bg-slate-900 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-stretch transition-all duration-500 my-auto ${
        isShorts ? 'max-w-[340px] sm:max-w-[380px] shadow-indigo-500/10' : 'max-w-4xl'
      }`}>
        {/* Top bar with tiny badge and highly visible close button */}
        <div className="w-full flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800/60 bg-slate-950/40 relative z-10 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008CBA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008CBA]"></span>
            </span>
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider truncate">
              {badgeText || 'Video de Presentación Oficial de la Campaña 🇻🇪'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer shrink-0 border border-white/10"
            title="Cerrar y acceder a la web"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Cerrar Video ✕</span>
          </button>
        </div>

        {/* Video Box: Vertical aspect-ratio [9/16] if shorts, horizontal 16:9 aspect-video if not. Autoplay with audio starts with mute=0. */}
        <div className={`w-full bg-black relative border-b border-slate-800/60 shadow-inner overflow-hidden shrink-0 ${
          isShorts ? 'aspect-[9/16] max-h-[50vh] sm:max-h-[60vh]' : 'aspect-video'
        }`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video de Entrada"
          />
        </div>

        {/* Bottom Bar Controls / Actions */}
        <div className="w-full p-4 sm:p-5 bg-slate-950/80 flex flex-col items-stretch gap-4 border-t border-slate-800/40 shrink-0">
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {title || '¿Estás Listo para Solidarizarte?'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {subtitle || 'Conoce más de nuestra iniciativa en marcha por 1 Tonelada.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 sm:py-3.5 bg-gradient-to-r from-[#008CBA] to-indigo-600 hover:from-[#007095] hover:to-indigo-700 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white/10"
            >
              <Globe className="w-4 h-4 animate-pulse text-sky-300" />
              <span>{btnText || 'Ingresar a la Web de la Campaña ➔'}</span>
            </button>
            
            <button
              onClick={handleClose}
              className="px-4 py-3 sm:py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>Cerrar e Investigar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
