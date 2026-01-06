
import React from 'react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';

interface FloatingActionsProps {
  onOpenAI: () => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenAI }) => {
  return (
    <div className="fixed bottom-8 left-8 z-40 flex flex-col gap-4">
      <button 
        onClick={onOpenAI}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:shadow-primary/50 group animate-pulse"
        title="AI مساعد ذكي"
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      <a 
        href="https://wa.me/966532438253" 
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-12 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:shadow-[#25D366]/40 group"
        title="واتساب"
      >
        <MessageCircle size={28} />
      </a>

      <a 
        href="tel:+966532438253"
        className="w-16 h-12 rounded-full bg-white text-primary shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:shadow-white/20"
        title="اتصال"
      >
        <Phone size={28} />
      </a>
    </div>
  );
};

export default FloatingActions;
