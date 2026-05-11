import React, { useState } from 'react';
import { 
  Download, 
  ArrowRight, 
  CheckCircle, 
  FlaskConical, 
  Stethoscope, 
  Heart, 
  Activity, 
  Brain,
  Zap,
  Leaf,
  Moon,
  ChevronRight,
  ShieldAlert,
  Info,
  Globe,
  Apple
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResultsProps {
  onBook: () => void;
}

export function AssessmentResults({ onBook }: ResultsProps) {
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const content = {
    EN: {
      title: "Diagnostic Analysis",
      subtitle: "AI Health Score",
      reasoning: "AI Reasoning & Explainability",
      tests: "Suggested Medical Tests",
      nutrition: "Localized Nutrition Guidance",
      riskHead: "Clinical Risk Matrix"
    },
    BN: {
      title: "ডায়াগনস্টিক বিশ্লেষণ",
      subtitle: "AI স্বাস্থ্য স্কোর",
      reasoning: "AI যুক্তি এবং ব্যাখ্যা",
      tests: "প্রস্তাবিত চিকিৎসা পরীক্ষা",
      nutrition: "স্থানীয় পুষ্টি নির্দেশিকা",
      riskHead: "ক্লিনিক্যাল রিস্ক ম্যাট্রিক্স"
    }
  };

  const t = content[language];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-1 border-b border-outline pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
               className="flex items-center gap-2 px-3 py-1 bg-surface border border-outline rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
             >
               <Globe size={12} />
               {language === 'EN' ? 'Switch to Bangla' : 'English এ যান'}
             </button>
             <span className="text-[10px] font-black text-secondary tracking-widest uppercase bg-secondary/10 px-2 py-0.5 rounded">Protocol: Precise</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface">{t.title}</h1>
          <p className="text-on-surface-variant text-lg font-medium">Computed on May 11, 2026 • AI Model v4.2</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center gap-3 bg-surface border border-outline text-on-surface px-6 py-4 rounded-2xl font-black text-sm hover:bg-outline/10 transition-all shadow-sm group active:scale-95">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Clinical Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Vital Score */}
        <div className="lg:col-span-4 card bg-surface border-outline p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant mb-12">{t.subtitle}</h3>
          <div className="relative w-56 h-56 flex items-center justify-center mb-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-background" cx="112" cy="112" fill="transparent" r="96" stroke="currentColor" strokeWidth="16"></circle>
              <motion.circle 
                initial={{ strokeDashoffset: 603 }}
                animate={{ strokeDashoffset: 108 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                className="text-primary" cx="112" cy="112" fill="transparent" r="96" stroke="currentColor" strokeDasharray="603" strokeWidth="16" strokeLinecap="round"
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full mx-8 my-8 shadow-inner border border-outline/30">
              <span className="text-7xl font-black text-on-surface tracking-tighter">82</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Optimal Status</span>
            </div>
          </div>
          <p className="text-base text-on-surface-variant leading-relaxed font-medium">
            Your physiological integrity is ranked in the <span className="text-primary font-bold">top 12%</span> of active users. Diagnostic variance is nominal.
          </p>
          <div className="absolute top-0 right-0 p-4">
             <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          </div>
        </div>

        {/* Explainability / AI Logic */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="card bg-on-surface text-white p-8 border-none relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3 border-r border-white/10 pr-8">
                    <div className="flex items-center gap-3 mb-4">
                       <Zap size={20} className="text-primary" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">{t.reasoning}</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="opacity-60">CONFIDENCE LEVEL</span>
                          <span className="text-primary">96.8%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '96.8%' }} transition={{ duration: 1 }} className="h-full bg-primary" />
                       </div>
                    </div>
                 </div>
                 <div className="flex-grow space-y-4">
                    <p className="text-base font-bold italic leading-relaxed text-white/90">
                       "My logic identifies a high metabolic stability but traces a potential gestational variance. This recommendation is based on correlating your <span className="text-primary">Family History</span> with current <span className="text-primary">Height/Weight metrics</span>. Probability of insulin resistance is sub-clinical (7%)."
                    </p>
                    <div className="flex gap-4">
                       <div className="flex-grow p-4 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Diagnostic Anchor</p>
                          <p className="text-xs font-bold text-white/80 uppercase">Circadian Pattern Variance</p>
                       </div>
                       <div className="flex-grow p-4 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Warning Indicator</p>
                          <p className="text-xs font-bold text-secondary uppercase">Hydration Deficit Detected</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RiskCard 
                title="Maternal Stability" 
                risk="High" 
                percent={88} 
                icon={<ShieldAlert size={20} />} 
                isModerate
                desc="Quantum monitoring for gestational hypertension. BP targets are 115/75 (Stable)." 
              />
              <RiskCard 
                title="Obesity Risk Index" 
                risk="Minimal" 
                percent={12} 
                icon={<Activity size={20} />} 
                desc="BMI is within optimal percentile (22.5). Body composition stability is 94%." 
              />
           </div>
        </div>

        {/* Global/Bilingual Clinical Grid */}
        <div className="lg:col-span-12 space-y-10 mt-10">
           <div className="flex items-center gap-6 px-1">
             <h2 className="text-sm font-black uppercase tracking-[0.3em] text-on-surface">{t.riskHead}</h2>
             <div className="h-px flex-grow bg-outline" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <MiniDiagnostic label="Diabetes Risk" value="Low" trend="stable" />
              <MiniDiagnostic label="Hypertension" value="Minimal" trend="down" />
              <MiniDiagnostic label="Stress Impact" value="Moderate" trend="up" />
              <MiniDiagnostic label="Nutritional Balance" value="Optimal" trend="stable" />
           </div>
        </div>

        {/* Localized Guidance */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card border-outline bg-secondary/5 self-start space-y-8">
               <div className="flex items-center justify-between border-b border-outline pb-6">
                  <div className="flex items-center gap-3">
                     <Apple size={20} className="text-secondary" />
                     <h3 className="text-lg font-black tracking-tight">{t.nutrition}</h3>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 bg-secondary text-white rounded-full">Bangladesh Source</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NutritionItem label="Sajne Dnata (Drumstick)" desc="High iron for maternal health & blood pressure." />
                  <NutritionItem label="Moshur Dal (Lentils)" desc="Essential protein for fetal development & BMI." />
                  <NutritionItem label="Doy (Homemade Yogurt)" desc="Probiotic support for digestive equilibrium." />
                  <NutritionItem label="Lal Shak" desc="Critical calcium and vitamin A source." />
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3 px-1">
                  <FlaskConical size={20} className="text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">{t.tests}</h3>
               </div>
               <div className="space-y-3">
                  {['Gestational Glucose Scan', 'Iron Panel (Ferritin)', 'Complete Blood Count (CBC)'].map(test => (
                    <div key={test} className="p-4 bg-surface border border-outline rounded-2xl flex items-center justify-between group hover:border-primary transition-all">
                       <span className="text-sm font-bold text-on-surface">{test}</span>
                       <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                          Why? <Info size={10} />
                       </button>
                    </div>
                  ))}
               </div>
               
               <div className="pt-6">
                  <div className="flex items-center gap-3 px-1 mb-6">
                    <Stethoscope size={20} className="text-secondary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Suggested Specialists</h3>
                  </div>
                  <div className="flex gap-4">
                     {['Obstetrician', 'Clinical Dietitian'].map(spec => (
                        <div key={spec} className="px-6 py-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl text-xs font-black uppercase tracking-widest">
                           {spec}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
        </div>

        {/* Next Step Banner */}
        <div className="lg:col-span-12 card bg-on-surface text-white border-none p-12 overflow-hidden relative shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-secondary text-on-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Priority Action</span>
                  <p className="text-white/60 font-medium">Clinical Recommendation Hub</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Preventive Metabolic Sync</h3>
                <p className="text-lg text-white/70 max-w-2xl leading-relaxed font-medium">
                  Based on your <span className="text-white font-bold">Metabolic Observation</span> status, we recommend scheduling a deep-panel diagnostic within 14 days to stabilize long-term data.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ActionStep icon={<FlaskConical />} title="HbA1c Clinical Panel" />
                <ActionStep icon={<Stethoscope />} title="Endocrine Optimization" />
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-center">
              <button 
                onClick={onBook}
                className="w-full bg-white text-on-surface px-10 py-6 rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex flex-col items-center gap-1 group"
              >
                Book Sync Session
                <span className="text-[10px] font-bold text-on-surface/50">First available tomorrow</span>
              </button>
            </div>
          </div>
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        {/* Improvement Plan */}
        <div className="lg:col-span-12 space-y-10">
          <div className="flex items-center gap-6 px-1">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-on-surface">Targeted Optimization Plan</h2>
            <div className="h-px flex-grow bg-outline" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlanCard 
              category="Nutrition" 
              title="Phytonutrient Integration"
              desc="Increase high-fiber legumes. Aim for glucose-stabilizing evening meals."
              goal="8/10 Scale"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDlhVA0XjAWNSPi7cA8UJVCKaq1LtCeu6zFLXTyKAEphURiUy95N8BPxPHkhbo1GqdjLugjABk9Y9L7Cl3Zrluc8fCQ_9bGRkuoypOY1zx3na-Ji_bb0OONqTiUESNzzSDvYIf7LQuW4rKVZq1bdOvcmzM-EPNNs2KhxJEAVIy8e7NUCBn8i4TnMkUctVt823DWJfFczrQZrBBd7u62ta3iC5WY39yIOnhCuhBE6qMAd6OUL5BLtyfQxk-5mSpm7igoDbUNeAhe23A"
              color="bg-secondary"
            />
            <PlanCard 
              category="Circadian" 
              title="Sleep-Sync Optimization"
              desc="Target 11:15 PM bedtime. Implement 30-min zero-screen buffer before sleep."
              goal="7.5h Quantified"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCks9j5TBp3FtZZnI0fPzQYISqdJe2tN2UNz7Sb0Wq45doPbUhaRf8wxpwV6SlqYVzCv0zWoReNM904RiG1S-j6VbO3OU66IpawRwsurWrlYNq4wK_BUjaQqY1vGsrvRUN1j3hpcaWrJai82sr9_wf7teLJHWHR9HnfH9ini29xf-ZA4gBS0_orEhh-w7Qtjh5HGw7bwuRGJTDzV-qedJoVbYFBsEZUAcX5omQ9e9s-jLLsKg0nvlHYm0ohvjQvHrXhrqoQhy_I6g0"
              color="bg-primary"
            />
            <PlanCard 
              category="Biokinetic" 
              title="Low-Intensity Loading"
              desc="Daily morning fasted walking for 22 mins. Focus on steady-state heart rate."
              goal="6k Steps"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBHl_w6RdkYESvkyIG0H_T165ZwAHEINH92EQLF17LpgtUULB2z4RFZlxp-6V7To40HgmSXWYY9rKz0FsIuIriUOEgwDnUk59HAQP9CKeidydRFt_BL-TdxyDsd4lpStrxybjqSjQA5wwPf_zM31bxa1QZBrH5ITICMYjM9EexOYB_wxfE3nT_tgRsCWm3CydGADN7GRa3XPrAIDdanItHi0cxKXF0sO5NeLYBV8EQCkJy0jzeO2yQMy0Qq4V2ohnJnAFKkkIVcSuE"
              color="bg-on-surface"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MiniDiagnostic({ label, value, trend }: { label: string, value: string, trend: 'up' | 'down' | 'stable' }) {
  return (
    <div className="p-6 bg-surface border border-outline rounded-[2rem] space-y-4 group hover:bg-background transition-all">
       <div className="flex justify-between items-start">
         <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40">{label}</span>
         <div className={`w-2 h-2 rounded-full ${trend === 'up' ? 'bg-red-500' : trend === 'down' ? 'bg-blue-500' : 'bg-secondary'}`} />
       </div>
       <div className="flex items-baseline gap-2">
         <span className="text-lg font-black tracking-tight">{value}</span>
         <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">{trend}</span>
       </div>
    </div>
  );
}

function NutritionItem({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
        <h4 className="text-sm font-black tracking-tight text-on-surface">{label}</h4>
      </div>
      <p className="text-xs font-medium text-on-surface-variant leading-relaxed ml-3.5 italic">{desc}</p>
    </div>
  );
}

function RiskCard({ title, risk, percent, icon, desc, isModerate }: { 
  title: string, risk: string, percent: number, icon: React.ReactNode, desc: string, isModerate?: boolean 
}) {
  return (
    <div className="card bg-surface border-outline p-8 flex flex-col group hover:border-on-surface-variant/30 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
          isModerate ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20' : 'bg-background text-primary border border-outline'
        }`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full border ${
          isModerate 
            ? 'bg-secondary/5 border-secondary text-secondary' 
            : 'bg-background border-outline text-on-surface-variant opacity-60'
        }`}>
          {risk.toUpperCase()}
        </span>
      </div>
      <div className="space-y-2 mb-8">
        <h4 className="text-xl font-bold tracking-tight text-on-surface">{title}</h4>
        <div className="flex items-center gap-4">
          <div className="h-1.5 flex-1 bg-background rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: 1 }}
              className={`h-full ${isModerate ? 'bg-secondary' : 'bg-primary'}`}
            />
          </div>
          <span className="text-[10px] font-black text-on-surface-variant">{percent}%</span>
        </div>
      </div>
      <p className="text-sm text-on-surface-variant font-medium leading-relaxed italic opacity-70 mb-8 flex-grow">
        "{desc}"
      </p>
      <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group/btn hover:text-on-surface transition-colors">
        Deep Analysis <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

function ActionStep({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="font-bold text-sm text-white/90">{title}</p>
    </div>
  );
}

function PlanCard({ category, title, desc, goal, image, color }: { 
  category: string, title: string, desc: string, goal: string, image: string, color: string 
}) {
  return (
    <div className="card bg-surface border-outline p-0 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
      <div className="h-56 relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${color}`} />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">{category}</span>
        </div>
      </div>
      <div className="p-8 space-y-6 flex flex-col flex-grow">
        <div className="space-y-2">
          <h4 className="text-xl font-bold tracking-tight text-on-surface">{title}</h4>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{desc}</p>
        </div>
        <div className="pt-6 border-t border-outline flex justify-between items-center mt-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Optimization Goal</span>
          <span className="text-sm font-bold text-primary">{goal}</span>
        </div>
      </div>
    </div>
  );
}
