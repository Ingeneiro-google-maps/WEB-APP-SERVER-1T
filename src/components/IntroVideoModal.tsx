import React, { useState, useEffect } from 'react';
import { X, Play, Volume2, Globe, Sparkles } from 'lucide-react';

interface IntroVideoModalProps {
  enabled: boolean;
  youtubeUrl: string;
  onClose: () => void;
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
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const videoId = getYoutubeId(youtubeUrl);

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md transition-all duration-700 animate-fade-in font-sans p-4 sm:p-8">
      {/* Immersive background glowing effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-4xl bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Top bar with tiny badge and close button */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008CBA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#008CBA]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase text-slate-300 tracking-[0.2em] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#008CBA]" />
              Video de Presentación Oficial de la Campaña 🇻🇪
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="Cerrar y acceder a la web"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Box - Covers approx. half the desktop screen or a beautiful fluid layout */}
        <div className="w-full aspect-video bg-black relative border-b border-slate-800/60 shadow-inner">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video de Entrada"
          />
        </div>

        {/* Bottom Bar Controls / Action to Close */}
        <div className="w-full p-6 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">¿Estás Listo para Solidarizarte?</h3>
            <p className="text-xs text-slate-400 mt-1">Conoce más de nuestra iniciativa en marcha por 1 Tonelada.</p>
          </div>
          
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#008CBA] to-indigo-600 hover:from-[#007095] hover:to-indigo-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>Ingresar a la Web de la Campaña ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
