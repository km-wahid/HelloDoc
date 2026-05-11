import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Sparkles, 
  Apple, 
  Activity, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  Loader2,
  Calendar,
  Utensils,
  Dumbbell,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PregnancyProgress, Language, StoredAssessment } from '../../types';
import { maternalService } from '../../services/maternalService';

interface MaternalCompanionProps {
  onBack: () => void;
  language?: Language;
  latestAssessment?: StoredAssessment | null;
}

export function MaternalCompanion({ onBack, language = 'EN', latestAssessment }: MaternalCompanionProps) {
  const [progress, setProgress] = useState<PregnancyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isAskingAI, setIsAskingAI] = useState(false);

  const week = latestAssessment?.data.pregnancyWeeks || 12;

  useEffect(() => {
    async function loadInsights() {
      const insights = await maternalService.getWeeklyInsights(week, language);
      setProgress(insights);
      setIsLoading(false);
    }
    loadInsights();
  }, [week, language]);

  const handleAskAI = async () => {
    if (!chatQuestion.trim()) return;
    
    const question = chatQuestion;
    setChatQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);
    setIsAskingAI(true);

    try {
      const response = await maternalService.askMaternalAI(question, { week, healthData: latestAssessment?.data }, language);
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm experiencing a connectivity issue." }]);
    } finally {
      setIsAskingAI(false);
    }
  };

  const t = {
    EN: {
      week: "Week",
      babySize: "Baby Size",
      guidance: "Weekly Guidance",
      nutrition: "Nutrition Guide",
      exercise: "Safe Activity",
      warnings: "Risk Indicators",
      reminders: "Medication & Vaccines",
      askAI: "Ask Maternal AI",
      placeholder: "Ask about symptoms, food, or baby growth...",
      progress: "Pregnancy Progress"
    },
    BN: {
      week: "সপ্তাহ",
      babySize: "শিশুটির আকার",
      guidance: "সাপ্তাহিক নির্দেশিকা",
      nutrition: "পুষ্টি নির্দেশিকা",
      exercise: "নিরাপদ ব্যায়াম",
      warnings: "ঝুঁকির লক্ষণ",
      reminders: "ঔষধ এবং টিকা",
      askAI: "AI মাতৃত্ব সাহায্যকারী",
      placeholder: "লক্ষণ, খাবার বা শিশুর বৃদ্ধি সম্পর্কে জিজ্ঞাসা করুন...",
      progress: "গর্ভাবস্থার অগ্রগতি"
    }
  }[language];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-black text-[10px] uppercase tracking-widest">Generating Maternal Protocol...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-4 group">
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
               <Baby size={24} className="text-white" />
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface">{t.progress}</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="card px-6 py-4 bg-primary text-white border-none flex flex-col items-center justify-center min-w-[140px] shadow-xl shadow-primary/20">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.week}</span>
             <span className="text-4xl font-black tracking-tighter">{week}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Weekly Insights */}
        <div className="lg:col-span-8 space-y-10">
           {/* Baby Size Visualization */}
           <div className="card bg-on-surface text-white border-none p-10 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center relative backdrop-blur-xl">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Baby size={80} className="text-primary fill-primary/20" />
                    </motion.div>
                    <div className="absolute -bottom-4 bg-white text-on-surface px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {progress?.babySizeDesc}
                    </div>
                 </div>
                 <div className="space-y-6 flex-grow">
                    <div className="flex items-center gap-3">
                       <Sparkles size={20} className="text-primary" />
                       <h3 className="text-xl font-bold">{t.babySize}</h3>
                    </div>
                    <p className="text-xl font-medium leading-relaxed text-white/80">
                       {progress?.babyGrowth}
                    </p>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
           </div>

           {/* Detailed Guides */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GuideList title={t.guidance} items={progress?.guidance || []} icon={<Calendar size={20} />} color="primary" />
              <GuideList title={t.nutrition} items={progress?.nutrition || []} icon={<Utensils size={20} />} color="secondary" />
              <GuideList title={t.exercise} items={progress?.exercise || []} icon={<Dumbbell size={20} />} color="primary" />
              <GuideList title={t.reminders} items={[...(progress?.medicineReminders || []), ...(progress?.vaccinationReminders || [])]} icon={<Activity size={20} />} color="secondary" />
              <GuideList title={t.warnings} items={progress?.warnings || []} icon={<AlertTriangle size={20} />} color="red-500" />
           </div>
        </div>

        {/* AI Chat & Stats */}
        <div className="lg:col-span-4 space-y-10">
           {/* Maternal AI Chat */}
           <div className="card bg-surface border-outline p-6 flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 border-b border-outline pb-4">
                 <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <MessageSquare size={16} />
                 </div>
                 <h3 className="font-black text-sm uppercase tracking-widest">{t.askAI}</h3>
              </div>

              <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-hide">
                 {chatHistory.length === 0 && (
                   <div className="text-center py-10 space-y-4">
                      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto opacity-50">
                         <Sparkles size={20} className="text-primary" />
                      </div>
                      <p className="text-xs font-medium text-on-surface-variant px-6">
                        {language === 'EN' 
                          ? "I can help with nutrition, common symptoms, and baby's growth. Ask me anything!"
                          : "আমি পুষ্টি, সাধারণ লক্ষণ এবং শিশুর বৃদ্ধি নিয়ে সাহায্য করতে পারি। আমাকে যেকোনো কিছু জিজ্ঞাসা করুন!"
                        }
                      </p>
                   </div>
                 )}
                 {chatHistory.map((msg, idx) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={idx} 
                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                     <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                       msg.role === 'user' 
                         ? 'bg-primary text-white shadow-lg' 
                         : 'bg-background border border-outline text-on-surface'
                     }`}>
                        {msg.text}
                     </div>
                   </motion.div>
                 ))}
                 {isAskingAI && (
                   <div className="flex justify-start">
                     <div className="bg-background border border-outline p-4 rounded-2xl">
                        <Loader2 size={16} className="text-primary animate-spin" />
                     </div>
                   </div>
                 )}
              </div>

              <div className="relative mt-auto">
                 <input 
                   type="text"
                   value={chatQuestion}
                   onChange={(e) => setChatQuestion(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                   placeholder={t.placeholder}
                   className="w-full h-14 pl-5 pr-14 rounded-2xl bg-background border border-outline focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-xs"
                 />
                 <button 
                   onClick={handleAskAI}
                   disabled={isAskingAI}
                   className="absolute right-2 top-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                 >
                   <Send size={16} />
                 </button>
              </div>
           </div>

           {/* Vital Status Indicators */}
           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Risk Monitoring</h3>
              <StatusCard label="Maternal Heart Rate" value="78 BPM" status="Normal" color="secondary" />
              <StatusCard label="Blood Pressure" value="115/75" status="Optimal" color="primary" />
              <StatusCard label="Gestational Weight" value={latestAssessment?.data.weight + " kg"} status="In Range" color="secondary" />
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function GuideList({ title, items, icon, color }: { title: string, items: string[], icon: React.ReactNode, color: string }) {
  return (
    <div className={`card border-outline bg-${color}/5 flex flex-col h-full`}>
      <div className="flex items-center gap-3 mb-6">
         <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
            {icon}
         </div>
         <h4 className="font-black text-sm uppercase tracking-widest">{title}</h4>
      </div>
      <div className="space-y-4">
         {items.map((item, idx) => (
           <div key={idx} className="flex gap-3 items-start group">
              <ChevronRight size={14} className={`mt-0.5 text-${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">{item}</p>
           </div>
         ))}
      </div>
    </div>
  );
}

function StatusCard({ label, value, status, color }: { label: string, value: string, status: string, color: string }) {
  return (
    <div className="card p-5 bg-background border border-outline flex items-center justify-between group hover:border-primary transition-all">
       <div className="space-y-1">
          <p className="text-[10px] font-black tracking-widest text-on-surface-variant uppercase">{label}</p>
          <p className="text-xl font-black text-on-surface">{value}</p>
       </div>
       <div className={`px-3 py-1 rounded-lg bg-${color}/10 text-${color} text-[10px] font-black uppercase tracking-widest`}>
          {status}
       </div>
    </div>
  );
}
