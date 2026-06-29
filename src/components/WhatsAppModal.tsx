import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { WhatsAppMessage } from '../types';
import { WhatsAppLiveFeed } from './WhatsAppLiveFeed';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: WhatsAppMessage[];
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, messages }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-fade-in-up">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-transparent z-10 flex flex-col max-h-full">
        {/* Close button placed outside/above for better UI */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-md"
            aria-label="Cerrar chat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* We reuse the existing WhatsAppLiveFeed component. It handles its own styling. */}
        <div className="flex-1 overflow-hidden rounded-[2rem]">
          <WhatsAppLiveFeed messages={messages} />
        </div>
      </div>
    </div>
  );
};
