
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AISmartAssistantProps {
  onClose: () => void;
}

const STORAGE_KEY = 'ai_chat_history';

const AISmartAssistant: React.FC<AISmartAssistantProps> = ({ onClose }) => {
  // استرجاع المحادثات المحفوظة من localStorage
  const getInitialMessages = (): Message[] => {
    if (typeof window === 'undefined') return [
      { role: 'assistant', content: 'مرحباً بك! أنا مساعدك الذكي في شركة القوة العاشرة. كيف يمكنني مساعدتك في مشروعك الهندسي اليوم؟' }
    ];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [
          { role: 'assistant', content: 'مرحباً بك! أنا مساعدك الذكي في شركة القوة العاشرة. كيف يمكنني مساعدتك في مشروعك الهندسي اليوم؟' }
        ];
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }

    return [
      { role: 'assistant', content: 'مرحباً بك! أنا مساعدك الذكي في شركة القوة العاشرة. كيف يمكنني مساعدتك في مشروعك الهندسي اليوم؟' }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // حفظ المحادثة في localStorage عند كل تغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // الأسئلة السريعة الشائعة
  const quickQuestions = [
    'ما هي خدماتكم في البناء والتشييد؟',
    'كيف يمكنني الحصول على عرض أسعار؟',
    'ما هي مدة تنفيذ المشاريع؟',
    'هل توفرون استشارات هندسية؟'
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // إرسال السؤال مباشرة
    setTimeout(() => {
      handleSendMessage(question);
    }, 100);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setInput('');
    setLoading(true);

    try {
      // إرسال الرسالة إلى Backend API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversation_history: null // يمكن إضافة سجل المحادثة لاحقاً
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم');
      }

      const data = await response.json();
      const aiText = data.response || "عذراً، لم أتمكن من معالجة الطلب حالياً.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "حدث خطأ أثناء التواصل مع خادم الذكاء الاصطناعي. يرجى المحاولة لاحقاً."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initialMessage = { role: 'assistant' as const, content: 'مرحباً بك! أنا مساعدك الذكي في شركة القوة العاشرة. كيف يمكنني مساعدتك في مشروعك الهندسي اليوم؟' };
    setMessages([initialMessage]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-center p-4 overflow-y-auto">
      <div className="bg-surface-dark border border-border-dark w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-primary p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">المستشار الذكي</h3>
              <p className="text-white/70 text-xs">مدعوم بتقنية Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              title="مسح المحادثة"
            >
              <Trash2 size={20} />
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* أزرار الأسئلة السريعة */}
        {messages.length <= 1 && (
          <div className="p-4 bg-primary/5 border-b border-border-dark">
            <p className="text-xs text-slate-400 mb-3 text-center">الأسئلة الشائعة</p>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={loading}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-right"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-grow p-6 h-[400px] overflow-y-auto space-y-4 hide-scrollbar bg-background-dark/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'
                  }`}>

                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-white text-gray-900 rounded-tr-none'
                  : 'bg-white/5 text-slate-200 backdrop-blur-md border border-white/10 rounded-tl-none'
                  }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="flex flex-row-reverse gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center"><Bot size={16} /></div>
                <div className="p-4 bg-surface-dark border border-border-dark rounded-2xl rounded-tl-none"><Loader2 size={16} className="animate-spin text-primary" /></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-surface-dark border-t border-border-dark">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              placeholder="كيف يمكننا خدمتك اليوم؟"
              className="w-full bg-background-dark/50 border border-border-dark rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary pr-14"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="absolute left-2 top-2 bottom-2 w-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Send size={18} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISmartAssistant;
