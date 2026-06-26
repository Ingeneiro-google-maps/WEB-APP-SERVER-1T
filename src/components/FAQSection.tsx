import React, { useState } from 'react';
import { FAQItem } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [activeTab, setActiveTab] = useState<string>('Todas');

  const categories = ['Todas', 'Donaciones', 'Logística', 'Transparencia', 'Voluntariado'];

  const filteredFaqs = faqs.filter(f => activeTab === 'Todas' || f.category === activeTab);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="bg-[#F4F7F9] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 text-[#1A202C]">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#008CBA] mb-2 block">
            Transparencia y Claridad
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#1A202C]">
            PREGUNTAS <span className="text-[#008CBA] italic">Y RESPUESTAS</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-medium mt-3">
            Resolvemos sus dudas operativas sobre el sistema de acopio y la emergencia del sismo en Venezuela.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                activeTab === cat
                  ? 'bg-[#008CBA] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-[#008CBA] shadow-lg' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 bg-[#008CBA]/10 text-[#008CBA] font-black text-[10px] tracking-wider uppercase rounded shrink-0 mt-0.5">
                      {faq.category}
                    </span>
                    <h3 className="font-black text-base sm:text-lg text-[#1A202C] uppercase tracking-tight leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-xl bg-slate-100 text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-[#008CBA] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 text-sm sm:text-base font-normal leading-relaxed border-t border-slate-100 animate-fade-in bg-slate-50/50">
                    <p className="italic font-medium text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Support Prompt */}
        <div className="mt-12 p-8 bg-white rounded-3xl border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left">
            <p className="font-black text-lg text-[#1A202C] uppercase tracking-tight flex items-center gap-2">
              <MessageCircleQuestion className="w-5 h-5 text-[#008CBA]" />
              <span>¿Tiene una pregunta logística urgente?</span>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Nuestro Asistente Virtual IA con tecnología Gemini está en línea 24/7 respondiendo inquietudes en tiempo real.
            </p>
          </div>
          <a
            href="#iniciativa"
            className="px-6 py-3 bg-[#1A202C] hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow transition"
          >
            Preguntar a la IA ONG
          </a>
        </div>

      </div>
    </section>
  );
};
