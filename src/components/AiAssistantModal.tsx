import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, User, ShieldCheck } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  campaignTitle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `¡Hola! Soy el Asistente Humanitario IA de "${campaignTitle}". Estoy conectado en tiempo real al inventario Excel de Google Drive. ¿En qué ciudad te encuentras o qué duda logística tienes sobre el sismo en Venezuela?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'He recibido tu mensaje. Gracias por tu apoyo a Venezuela.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Estamos experimentando alta demanda en la red de emergencia. Por favor intenta en unos segundos.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A202C]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[600px] flex flex-col border border-slate-200 shadow-2xl overflow-hidden text-[#1A202C]">
        
        {/* Header */}
        <div className="bg-[#008CBA] text-white p-6 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg uppercase tracking-tight">ASISTENTE LOGÍSTICO IA</h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">Gemini</span>
              </div>
              <p className="text-xs text-sky-100 font-medium">Asesoría de Emergencia 24/7 • Por 1 T</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white rounded-xl transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F4F7F9]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                m.sender === 'user' ? 'bg-[#1A202C]' : 'bg-[#008CBA]'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed font-medium shadow-2xs ${
                m.sender === 'user' 
                  ? 'bg-[#1A202C] text-white rounded-tr-xs' 
                  : 'bg-white text-[#1A202C] border border-slate-200 rounded-tl-xs'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#008CBA] animate-pulse pl-11">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analizando datos de centros y almacén...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Escribe tu pregunta (Ej: ¿Dónde donar en Valencia?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#008CBA] focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-[#008CBA] hover:bg-[#007399] disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
