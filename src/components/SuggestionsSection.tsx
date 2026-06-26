import React, { useState } from 'react';
import { SuggestionItem } from '../types';
import { MessageSquarePlus, Send, CheckCircle2, User, Mail, Tag, MessageCircle } from 'lucide-react';

interface SuggestionsSectionProps {
  suggestions: SuggestionItem[];
  onSuggestionSubmitted?: () => void;
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ suggestions, onSuggestionSubmitted }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'sugerencia' | 'informacion' | 'logistica'>('sugerencia');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !message.trim()) {
      setErrorMsg('Por favor complete su nombre y mensaje.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          email,
          type,
          message
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setUserName('');
        setEmail('');
        setMessage('');
        if (onSuggestionSubmitted) onSuggestionSubmitted();
        setTimeout(() => setSubmittedSuccess(false), 6000);
      } else {
        setErrorMsg('No se pudo enviar el mensaje. Intente de nuevo.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="sugerencias" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 text-[#1A202C]">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#008CBA] mb-2 block flex items-center gap-1.5">
              <MessageSquarePlus className="w-4 h-4 text-[#008CBA]" />
              Canal Ciudadano y Diáspora
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#1A202C]">
              INFORMACIÓN Y <br /> SUGERENCIAS
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium mt-4 leading-relaxed">
              ¿Tiene contactos logísticos en España, aerolíneas solidarias, almacenes o desea hacer una sugerencia operativa para agilizar el transporte de las toneladas? Escríbanos directamente a la coordinación administrativa.
            </p>

            <div className="mt-8 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Compromiso de Transparencia
              </h4>
              <p className="text-xs text-slate-600 leading-normal font-medium">
                Todas las sugerencias son revisadas diariamente por el Administrador en la consola central para optimizar la recolección en Madrid, Barcelona, Valencia y el resto de sedes.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#F4F7F9] p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-900 mb-6">
              Enviar Propuesta o Sugerencia
            </h3>

            {submittedSuccess && (
              <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h5 className="font-black text-sm uppercase">¡Recibido con éxito!</h5>
                  <p className="text-xs font-medium">Su sugerencia ha sido enviada al panel del Administrador.</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-900 rounded-2xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Nombre / Organización *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza (Voluntario)"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#008CBA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="contacto@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#008CBA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Tipo de Aporte *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#008CBA] cursor-pointer"
                >
                  <option value="sugerencia">💡 Sugerencia General de Mejora</option>
                  <option value="informacion">ℹ️ Información / Datos Útiles</option>
                  <option value="logistica">✈️ Propuesta de Logística / Centro de Acopio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                  Mensaje o Descripción *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detalle su información o propuesta para la coordinación de la campaña..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#008CBA]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#008CBA] hover:bg-[#007299] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Enviando...' : 'Enviar a Administración'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
