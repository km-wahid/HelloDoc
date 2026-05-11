import { 
  Download, 
  CheckCircle, 
  FlaskConical, 
  Stethoscope, 
  Activity, 
  Zap,
  ShieldAlert,
  Info,
  Lightbulb
} from 'lucide-react';
import { motion } from 'motion/react';
import { StoredAssessment, Language } from '../../types';

interface ResultsProps {
  assessment: StoredAssessment;
  onBook: () => void;
  language?: Language;
  onClose: () => void;
}

export function AssessmentResults({ assessment, onBook, language = 'EN', onClose }: ResultsProps) {
  const { report, createdAt } = assessment;
  if (!report) return null;

  const content = {
    EN: {
      title: "Diagnostic Analysis",
      subtitle: "AI Health Score",
      reasoning: "AI Reasoning & Explainability",
      tests: "Suggested Medical Tests",
      specialists: "Suggested Specialists",
      lifestyle: "Lifestyle Improvement Plan",
      riskHead: "Clinical Risk Matrix"
    },
    BN: {
      title: "ডায়াগনস্টিক বিশ্লেষণ",
      subtitle: "AI স্বাস্থ্য স্কোর",
      reasoning: "AI যুক্তি এবং ব্যাখ্যা",
      tests: "প্রস্তাবিত চিকিৎসা পরীক্ষা",
      specialists: "বিশেষজ্ঞ পরামর্শ",
      lifestyle: "জীবনযাপন উন্নতি পরিকল্পনা",
      riskHead: "ক্লিনিক্যাল রিস্ক ম্যাট্রিক্স"
    }
  };

  const t = content[language];
  const dateStr = createdAt?.toDate ? createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-1 border-b border-outline pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-secondary tracking-widest uppercase bg-secondary/10 px-2 py-0.5 rounded">Protocol: Precise</span>
             <span className="text-[10px] font-black text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">Analysis Depth: GEN-3</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface">{t.title}</h1>
          <p className="text-on-surface-variant text-lg font-medium">Computed on {dateStr} • AI Clinical Engine</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center gap-3 bg-surface border border-outline text-on-surface px-6 py-4 rounded-2xl font-black text-sm hover:bg-outline/10 transition-all shadow-sm group active:scale-95">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Clinical Report
          </button>
          <button 
            onClick={onClose}
            className="flex items-center justify-center gap-3 bg-primary text-white px-6 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            Finished
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
                animate={{ strokeDashoffset: 603 - (603 * report.healthScore / 100) }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={report.healthScore > 75 ? 'text-secondary' : report.healthScore > 50 ? 'text-primary' : 'text-red-500'} 
                cx="112" cy="112" fill="transparent" r="96" stroke="currentColor" strokeDasharray="603" strokeWidth="16" strokeLinecap="round"
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full mx-8 my-8 shadow-inner border border-outline/30">
              <span className="text-7xl font-black text-on-surface tracking-tighter">{report.healthScore}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {report.healthScore > 80 ? 'Optimal' : report.healthScore > 60 ? 'Stable' : 'Risk Noted'}
              </span>
            </div>
          </div>
          <p className="text-base text-on-surface-variant leading-relaxed font-medium">
            Computed using multi-modal clinical mapping across <span className="text-primary font-bold">18 data points</span>.
          </p>
        </div>

        {/* AI Logic */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="card bg-on-surface text-white p-8 border-none relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Zap size={20} className="text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">{t.reasoning}</h4>
                 </div>
                 <p className="text-xl font-bold italic leading-relaxed text-white/90">
                    "{report.medicalReasoning}"
                 </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {report.risks.slice(0, 2).map((risk, idx) => (
                <div key={idx} className="card bg-surface border-outline p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${risk.level === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                      {risk.level === 'High' ? <ShieldAlert size={20} /> : <Activity size={20} />}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md ${risk.level === 'High' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                        {risk.level.toUpperCase()}
                      </span>
                      <span className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-tighter">
                        Confidence: {(risk.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg">{risk.category}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{risk.description}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Clinical Grid */}
        <div className="lg:col-span-12 space-y-8">
           <div className="flex items-center gap-6">
             <h2 className="text-sm font-black uppercase tracking-[0.3em] text-on-surface">{t.riskHead}</h2>
             <div className="h-px flex-grow bg-outline" />
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {report.risks.map((risk, idx) => (
                <div key={idx} className="p-5 bg-background border border-outline rounded-2xl flex flex-col gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/50">{risk.category}</span>
                  <span className={`text-sm font-black ${risk.level === 'High' ? 'text-red-500' : risk.level === 'Medium' ? 'text-primary' : 'text-secondary'}`}>
                    {risk.level}
                  </span>
                </div>
              ))}
           </div>
        </div>

        {/* Guidance and Actions */}
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card border-outline bg-primary/5 space-y-8">
               <div className="flex items-center gap-3">
                  <Lightbulb size={20} className="text-primary" />
                  <h3 className="text-lg font-black tracking-tight">{t.lifestyle}</h3>
               </div>
               <div className="space-y-4">
                  {report.lifestylePlan.map((plan, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                       <CheckCircle size={16} className="text-secondary mt-1 shrink-0" />
                       <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{plan}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant">{t.tests}</h3>
                  <div className="space-y-3">
                    {report.suggestedTests.map((test, idx) => (
                      <div key={idx} className="p-4 bg-surface border border-outline rounded-xl flex items-center justify-between">
                         <span className="text-sm font-bold">{test}</span>
                         <Info size={14} className="opacity-20" />
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant">{t.specialists}</h3>
                  <div className="flex flex-wrap gap-3">
                     {report.suggestedSpecialists.map((spec, idx) => (
                        <div key={idx} className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl text-xs font-black uppercase">
                           {spec}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
        </div>

        {/* Specialist Booking */}
        <div className="lg:col-span-12 card bg-on-surface text-white border-none p-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">AI-Validated Specialist Consultation</h3>
            <p className="text-white/60 max-w-xl">
              We highly recommend speaking with an expert to formalize your clinical next steps based on these findings.
            </p>
          </div>
          <button 
            onClick={onBook}
            className="whitespace-nowrap px-10 py-5 bg-white text-on-surface rounded-2xl font-black text-base hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            Consult Specialist Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
