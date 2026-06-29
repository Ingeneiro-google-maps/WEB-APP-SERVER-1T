import React, { useEffect, useRef } from 'react';
import { WhatsAppMessage } from '../types';
import { MessageCircle, CheckCheck, Users, ExternalLink } from 'lucide-react';

interface WhatsAppLiveFeedProps {
  messages: WhatsAppMessage[];
}

export const WhatsAppLiveFeed: React.FC<WhatsAppLiveFeedProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const defaultMessages: WhatsAppMessage[] = [
    {
      id: 'default-1',
      senderName: 'Sistema',
      text: 'Aún no hay mensajes en el grupo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ];

  const displayMessages = messages && messages.length > 0 ? messages : defaultMessages;

  return (
    <section id="whatsapp" className="scroll-mt-32 mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#25D366]/5 to-transparent -z-10 rounded-3xl" />
      
      <div className="bg-slate-900 border border-[#25D366]/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[600px] max-w-4xl mx-auto relative backdrop-blur-sm">
        
        {/* Header (Elegant Glassmorphism) */}
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-5 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/20 transform -rotate-3">
                <MessageCircle className="w-7 h-7 text-white transform rotate-3" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-xl text-white tracking-tight">Coordinación en Vivo</h2>
              <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5" />
                Grupo Oficial de Voluntarios
              </p>
            </div>
          </div>
          
          <a 
            href="https://chat.whatsapp.com/KB0NpYUOO3OEiJUgpRlcqW?mode=gi_t" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#25D366]/20 hover:-translate-y-0.5"
          >
            <span>Unirse al Grupo</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Chat Body */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6"
          style={{
            backgroundColor: '#0f172a', // slate-900
            backgroundImage: `radial-gradient(circle at center, #1e293b 0%, #0f172a 100%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundBlendMode: 'overlay',
          }}
        >
          {/* Date Badge */}
          <div className="flex justify-center my-4 sticky top-4 z-0">
            <span className="bg-slate-800/80 backdrop-blur-sm text-slate-300 text-xs font-bold px-4 py-1.5 rounded-full border border-slate-700/50 shadow-sm uppercase tracking-widest">
              Hoy
            </span>
          </div>

          {displayMessages.map((msg, index) => {
            const isOfficial = msg.isOfficial || msg.senderRole === 'Admin';
            const isLast = index === displayMessages.length - 1;
            
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isOfficial ? 'items-end' : 'items-start'} ${isLast ? 'animate-fade-in-up' : ''}`}
              >
                <div 
                  className={`relative max-w-[90%] md:max-w-[75%] px-5 py-3.5 shadow-xl ${
                    isOfficial 
                      ? 'bg-gradient-to-br from-[#128C7E] to-[#075E54] rounded-2xl rounded-tr-sm text-white' 
                      : 'bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm text-slate-200'
                  }`}
                >
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span 
                      className={`text-sm font-black tracking-wide ${
                        isOfficial ? 'text-emerald-100' : 'text-blue-400'
                      }`}
                    >
                      {msg.senderName}
                    </span>
                    {msg.senderRole && (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isOfficial ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {msg.senderRole}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm md:text-base break-words pr-10 leading-relaxed font-medium">
                    {msg.text}
                  </p>
                  
                  <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${isOfficial ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                      {msg.timestamp || '12:00'}
                    </span>
                    {isOfficial && (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer (Elegant Join Banner for Mobile) */}
        <div className="sm:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4 shrink-0">
           <a 
            href="https://chat.whatsapp.com/KB0NpYUOO3OEiJUgpRlcqW?mode=gi_t" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-[#25D366]/20"
          >
            <span>Unirse al Grupo Oficial</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
