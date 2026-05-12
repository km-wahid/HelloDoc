import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Loader2,
  Trash2,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../../services/aiService';
import { Language, StoredAssessment } from '../../types';

interface AIChatProps {
  onBack: () => void;
  language: Language;
  latestAssessment: StoredAssessment | null;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export function AIChat({ onBack, language, latestAssessment }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: userMessage }] };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.chat(userMessage, messages, language, latestAssessment);
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error: unknown) {
      console.error(error);
      const fallbackText = error instanceof Error ? error.message : 'AI request failed. Please try again.';
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: fallbackText }] };
      setMessages(prev => [...prev, modelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const t = {
    EN: {
      title: "AI Health Assistant",
      subtitle: "Ask me anything about your health",
      placeholder: "Type your health concern...",
      warning: "AI advice is for information only. Consult a doctor for medical issues.",
      clear: "Clear Chat"
    },
    BN: {
      title: "AI স্বাস্থ্য সহকারী",
      subtitle: "আপনার স্বাস্থ্য সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন",
      placeholder: "আপনার স্বাস্থ্য সমস্যা লিখুন...",
      warning: "AI পরামর্শ শুধুমাত্র তথ্যের জন্য। চিকিৎসকের পরামর্শ নিন।",
      clear: "চ্যাট মুছুন"
    }
  }[language];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-outline bg-surface rounded-t-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-widest">{t.title}</h2>
              <p className="text-[10px] font-bold text-on-surface-variant">{t.subtitle}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 hover:bg-red-500/10 text-on-surface-variant hover:text-red-500 rounded-full transition-all"
          title={t.clear}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Warning Bar */}
      <div className="bg-primary/5 px-6 py-2 flex items-center gap-2 border-b border-outline">
        <AlertCircle size={14} className="text-primary shrink-0" />
        <p className="text-[10px] font-medium text-on-surface-variant">{t.warning}</p>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide bg-background/50"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center border-4 border-outline/20">
               <MessageCircle size={40} className="text-primary" />
            </div>
            <div className="space-y-2">
               <p className="font-black text-sm uppercase tracking-widest">Starting conversation...</p>
               <p className="text-xs font-medium max-w-[240px]">Ask about symptoms, lifestyle, or explain your medical reports.</p>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-secondary text-white rounded-tr-none' 
                  : 'bg-white border border-outline text-on-surface rounded-tl-none'
              }`}>
                {msg.parts[0].text}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-outline flex items-center gap-3">
                <Loader2 size={16} className="text-primary animate-spin" />
                <span className="text-xs font-bold text-on-surface-variant animate-pulse">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-surface border-t border-outline rounded-b-3xl">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="w-full h-14 pl-6 pr-14 rounded-2xl bg-background border border-outline focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
           <Sparkles size={12} className="text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest">Powered by Gemini AI Clinical Engine</span>
        </div>
      </div>
    </motion.div>
  );
}
