import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  Video, 
  FileText, 
  AlertCircle, 
  Calendar,
  ChevronRight,
  Zap,
  Leaf,
  Moon,
  Users,
  ShieldAlert,
  Save,
  RefreshCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Baby,
  Bot
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole, Language, StoredAssessment } from '../../types';

interface DashboardProps {
  onStartAssessment: () => void;
  onViewLatestAssessment: () => void;
  onViewAssistant: () => void;
  onViewMaternal: () => void;
  onBookConsult: () => void;
  onStartConsultation: () => void;
  userRole: UserRole;
  isWorkerMode: boolean;
  setIsWorkerMode: (val: boolean) => void;
  isOnline: boolean;
  language?: Language;
  latestAssessment?: StoredAssessment | null;
}

export function Dashboard({ 
  onStartAssessment, 
  onViewLatestAssessment,
  onViewAssistant,
  onViewMaternal,
  onBookConsult, 
  onStartConsultation,
  userRole,
  isWorkerMode,
  setIsWorkerMode,
  isOnline,
  language = 'EN',
  latestAssessment
}: DashboardProps) {
  const isDoctor = userRole === 'doctor';
  const isPregnant = latestAssessment?.data.isPregnant;

  const t = {
    EN: {
      patientWelcome: "Welcome back, Sarah",
      doctorWelcome: "Clinical Cockpit • Dr. Sarah Rahman",
      workerWelcome: "Village Assistant: Char Fasson",
      patientSub: "Tuesday, May 14 • Your stats are stable",
      workerSub: "District: Bhola • Tracking 42 Families",
      startCheckup: "Start Checkup",
      logPatient: "Log Patient Data",
      workerMode: "Worker Assistant",
      personalMode: "Personal Mode",
      statusStable: "Stable",
      heartRate: "Heart Rate",
      sleepScore: "Sleep Score",
      hydration: "Hydration",
      upcomingApps: "Upcoming Appointments",
      viewSchedule: "View Schedule",
      labResults: "Recent Lab Results",
      aiSummary: "AI Health Summary",
      doctorSch: "Schedule Surgery",
      doctorOnline: "Go Online"
    },
    BN: {
      patientWelcome: "স্বাগতম, সারাহ",
      doctorWelcome: "ক্লিনিক্যাল ককপিট • ডাঃ সারাহ রহমান",
      workerWelcome: "ভিলেজ অ্যাসিস্ট্যান্ট: চর ফ্যাশন",
      patientSub: "মঙ্গলবার, ১৪ মে • আপনার অবস্থা স্থিতিশীল",
      workerSub: "জেলা: ভোলা • ৪২টি পরিবারের ট্র্যাকিং",
      startCheckup: "চেকআপ শুরু করুন",
      logPatient: "রোগীর তথ্য লগ করুন",
      workerMode: "কর্মী সহকারী",
      personalMode: "ব্যক্তিগত মোড",
      statusStable: "স্থিতিশীল",
      heartRate: "হৃদস্পন্দন",
      sleepScore: "ঘুমের স্কোর",
      hydration: "হাইড্রেশন",
      upcomingApps: "আসন্ন অ্যাপয়েন্টমেন্ট",
      viewSchedule: "সূচী দেখুন",
      labResults: "সাম্প্রতিক ল্যাব রিপোর্ট",
      aiSummary: "AI স্বাস্থ্য সারাংশ",
      doctorSch: "সার্জারি সূচী",
      doctorOnline: "অনলাইনে যান"
    }
  }[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  if (isDoctor) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-10"
      >
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl text-on-surface font-black tracking-tighter">
              {t.doctorWelcome}
            </h1>
            <p className="text-on-surface-variant font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Nexus Health Network • {language === 'BN' ? 'ঢাকা সেন্ট্রাল হাসপাতাল' : 'Dhaka Central Hospital'}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-surface border border-outline text-on-surface rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-outline/10 active:scale-95 transition-all">
              {t.doctorSch}
            </button>
            <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              {t.doctorOnline}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkerStatCard label="Patients Today" value="12" sub="4 slots left" icon={<Users size={16} />} />
          <WorkerStatCard label="Avg Response Time" value="4.2m" sub="98th Percentile" icon={<Zap size={16} className="text-secondary" />} />
          <WorkerStatCard label="Surgery Success" value="100%" sub="This Quarter" icon={<TrendingUp size={16} className="text-primary" />} />
          <WorkerStatAlert label="Critical Alerts" value="2" sub="Action Required" icon={<ShieldAlert size={16} className="text-error" />} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Active Queue */}
           <div className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface opacity-60">Patient Queue</h3>
                <span className="text-[10px] font-black uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full">3 Waiting</span>
              </div>
              <div className="space-y-4">
                 <PatientQueueItem 
                   name="Arif Ahmed" 
                   status="Waiting • 8m ago" 
                   reason="Chest Pain Diagnosis" 
                   priority="High"
                   image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100"
                   onClick={onStartConsultation}
                 />
                 <PatientQueueItem 
                   name="Fatima Khatun" 
                   status="Confirmed • 2:30 PM" 
                   reason="Maternal Follow-up" 
                   priority="Normal"
                   image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
                   onClick={() => {}}
                 />
                 <PatientQueueItem 
                   name="Moinul Hoque" 
                   status="Confirmed • 3:15 PM" 
                   reason="Post-Surgery Review" 
                   priority="Critical"
                   image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100"
                   onClick={() => {}}
                 />
              </div>
           </div>

           {/* Clinical Tasks */}
           <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface opacity-60 px-1">Internal Tasks</h3>
              <div className="card border-outline bg-surface p-8 space-y-6 shadow-xl">
                 <div className="space-y-4">
                    <TaskItem label="Review Lab for #9921" completed={false} />
                    <TaskItem label="Approve #4402 Discharge" completed={true} />
                    <TaskItem label="Sign Patient Bio-Auth" completed={false} />
                    <TaskItem label="Pharmacy Sync: Sector 4" completed={false} />
                 </div>
                 <button className="w-full py-4 bg-outline/10 text-on-surface-variant rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-outline/20 transition-all">
                    Open Admin Tool
                 </button>
              </div>

              <div className="card bg-secondary text-white border-none p-6 space-y-4">
                 <div className="flex items-center gap-3">
                    <RefreshCcw size={20} className="animate-spin-slow" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Network Status</h4>
                 </div>
                 <p className="text-xs font-medium text-white/70 italic leading-relaxed">
                   "AI Copilot is synchronized with Global Medical Database (v11.4). Predictive diagnostics enabled for all triage items."
                 </p>
              </div>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl text-on-surface font-bold tracking-tighter">
            {isWorkerMode ? t.workerWelcome : t.patientWelcome}
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
            {isWorkerMode ? t.workerSub : t.patientSub}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsWorkerMode(!isWorkerMode)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              isWorkerMode 
                ? 'bg-secondary text-white border-secondary' 
                : 'bg-surface border-outline text-on-surface hover:bg-outline/10'
            }`}
          >
            {isWorkerMode ? t.personalMode : t.workerMode}
          </button>
          <button 
            onClick={onStartAssessment}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isWorkerMode ? t.logPatient : t.startCheckup}
          </button>
        </div>
      </header>

      {isWorkerMode && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <WorkerStatCard label="Patients Registered" value="142" sub="8 pending sync" icon={<Users size={16} />} />
          <WorkerStatCard label="Maternal Visits" value="28" sub="Highly Stable" icon={<Zap size={16} className="text-secondary" />} />
          <WorkerStatCard label="Vaccination Coverage" value="94%" sub="+2% this month" icon={<TrendingUp size={16} className="text-primary" />} />
          <WorkerStatAlert label="Outbreak Alert" value="Dengue High" sub="Village Sector B" icon={<ShieldAlert size={16} className="text-error" />} />
        </motion.section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Card 1: Heart Rate */}
        <motion.div variants={itemVariants} className="card flex flex-col gap-4 group cursor-pointer hover:border-primary/30">
          <div className="flex justify-between items-center text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {t.heartRate}
            </span>
            <span className="px-2 py-0.5 bg-secondary-container text-secondary rounded-md">{t.statusStable}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light text-on-surface">72</span>
            <span className="text-sm font-semibold text-on-surface-variant">BPM</span>
          </div>
          <div className="flex items-end gap-1 h-8 mt-auto">
            {[40, 60, 50, 80, 70, 65, 75, 60].map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-sm transition-all duration-500 ${i > 5 ? 'bg-primary' : 'bg-outline'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Stat Card 2: Sleep */}
        <motion.div variants={itemVariants} className="card flex flex-col gap-4 group cursor-pointer hover:border-primary/30">
          <div className="flex justify-between items-center text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Moon size={14} className="text-primary" />
              {t.sleepScore}
            </span>
            <span className="px-2 py-0.5 bg-secondary-container text-secondary rounded-md">+12%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light text-on-surface">84</span>
            <span className="text-sm font-semibold text-on-surface-variant">pts</span>
          </div>
          <div className="w-full bg-outline h-1.5 rounded-full mt-auto overflow-hidden">
            <div className="bg-primary h-full w-[84%] rounded-full" />
          </div>
        </motion.div>

        {/* Stat Card 3: Hydration */}
        <motion.div variants={itemVariants} className="card flex flex-col gap-4 group cursor-pointer hover:border-primary/30">
          <div className="flex justify-between items-center text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Activity size={14} className="text-tertiary" />
              {t.hydration}
            </span>
            <span className="px-2 py-0.5 bg-error-container text-error rounded-md">{language === 'BN' ? 'কম' : 'Low'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light text-on-surface">1.2</span>
            <span className="text-sm font-semibold text-on-surface-variant">L</span>
          </div>
          <div className="w-full bg-outline h-1.5 rounded-full mt-auto overflow-hidden">
            <div className="bg-tertiary h-full w-[45%] rounded-full" />
          </div>
        </motion.div>

        {/* Appointments Section */}
        <motion.section variants={itemVariants} className="card col-span-1 md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">{t.upcomingApps}</h3>
            <button className="text-xs font-bold text-primary hover:underline">{t.viewSchedule}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppointmentItem 
              name="Dr. Sarah Rahman" 
              specialty="Cardiology • Checkup" 
              time="Today • 04:30 PM" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCwmtR2_EAYE6-HUZiG-V-CE8Ed0yQkYyfb5jKbM3DCepV3hLv4JaloZwh35XckrBx2yhW8cUR86xSjpYWTLwM14FGi1U3x35jrOZHUr8HIo8WfHC-BWDNRQogccuWE_v_w3CoAbzxK78cGLbqXUb0AffT502YHJJaT4lpmAB4hK5pLIy7CKQ07iX7f1dgCfwOV1myYDWYyC6qMPCwzgng_2v80dn_X_j5zDCDrX9PrZucffJBiskm_pQz59y6Dn9-VrWC9bJXlGCw"
              type="video"
              onClick={onStartConsultation}
            />
            <AppointmentItem 
              name="Dr. Karim Ullah" 
              specialty="General • Consult" 
              time="May 19 • 2:30 PM" 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuADeqm8A7wPD9x8hzxWnNuyATwi0SQh5h_RvieKXyhvC-hXucP3hWnrAgm-MEKghz6U0GOM3eIVfkt4EaXk0Nmo2PpS-vEowagwEe46d1SHB0l8_nWw61nIElqCzGJUcdIDF0XlQEx7vCUb3bZDX5GGNPAJo1I9BY3H734p09X9ieYCbiSXv-2SWHOM1Jpd6osgXTIUZEfhsz2sYtk-fWSjKP7Oco7tixVqAMCUYS0KotD2PEWYX4mxZ1MrSUwnTkB3bIArQMn0SeU"
              type="clinic"
              onClick={() => {}}
            />
          </div>
        </motion.section>

        {/* Recent Lab Results */}
        <motion.section variants={itemVariants} className="card space-y-6">
          <h3 className="text-lg font-bold">{t.labResults}</h3>
          <div className="space-y-1">
            <ResultRow name={language === 'BN' ? 'কমপ্লিট ব্লাড কাউন্ট' : 'Complete Blood Count'} status={language === 'BN' ? 'স্বাভাবিক' : 'Normal'} />
            <ResultRow name={language === 'BN' ? 'লিপিড প্যানেল' : 'Lipid Panel'} status={language === 'BN' ? 'স্বাভাবিক' : 'Normal'} />
            <ResultRow name={language === 'BN' ? 'থাইরয়েড (TSH)' : 'Thyroid (TSH)'} status={language === 'BN' ? 'অপেক্ষমান' : 'Pending'} isPending />
            <ResultRow name={language === 'BN' ? 'ভিটামিন ডি' : 'Vitamin D'} status={language === 'BN' ? 'অনুকূল' : 'Optimal'} />
          </div>
        </motion.section>

        {isPregnant && (
          <motion.section 
            variants={itemVariants} 
            className="card bg-secondary text-white border-none shadow-xl overflow-hidden relative group cursor-pointer"
            onClick={onViewMaternal}
          >
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Baby size={24} className="text-white" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-bold tracking-tight">Maternal Companion</h3>
                 <p className="text-white/60 text-xs font-medium">Tracking Week {latestAssessment?.data.pregnancyWeeks}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest pt-4">
                 Open Insights
                 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-20 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
          </motion.section>
        )}

        {/* Global AI Assistant Action */}
        <motion.section 
          variants={itemVariants} 
          className="card bg-on-surface text-white border-none shadow-xl overflow-hidden relative group cursor-pointer"
          onClick={onViewAssistant}
        >
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
               <Bot size={24} className="text-white" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-bold tracking-tight">{language === 'BN' ? 'AI স্বাস্থ্য সহকারী' : 'Clinical AI Assistant'}</h3>
               <p className="text-white/60 text-xs font-medium">{language === 'BN' ? 'স্বাস্হ্য নিয়ে সরাসরি চ্যাট করুন' : 'Direct clinical chat support'}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest pt-4 text-primary">
               Start Chat
               <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        </motion.section>

      {/* AI Health Summary */}
      <motion.section variants={itemVariants} className="card col-span-1 md:col-span-3 bg-on-surface text-white border-none shadow-xl overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
              <Zap size={32} className="text-white fill-white/20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight">AI Health Portrait</h3>
              <p className="text-white/40 text-sm font-medium">
                {latestAssessment 
                  ? `Last analyzed on ${latestAssessment.createdAt?.toDate ? latestAssessment.createdAt.toDate().toLocaleDateString() : 'recently'}` 
                  : 'Diagnostic analysis pending synchronization'}
              </p>
            </div>
          </div>
          <div className="md:col-span-4 flex gap-3">
             {latestAssessment ? (
               <button 
                 onClick={onViewLatestAssessment}
                 className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
               >
                 View Comprehensive Report
                 <ChevronRight size={18} />
               </button>
             ) : (
               <button 
                 onClick={onStartAssessment}
                 className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-3"
               >
                 Run New Diagnostic
                 <ArrowRight size={18} />
               </button>
             )}
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      </motion.section>
      </div>
    </motion.div>
  );
}

function PatientQueueItem({ name, status, reason, priority, image, onClick }: { 
  name: string, status: string, reason: string, priority: string, image: string, onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className="p-5 flex items-center gap-6 bg-surface border border-outline rounded-3xl hover:border-primary transition-all group cursor-pointer"
    >
       <div className="w-14 h-14 rounded-2xl overflow-hidden border border-outline shadow-sm flex-shrink-0">
          <img src={image} alt={name} className="w-full h-full object-cover" />
       </div>
       <div className="flex-grow space-y-1">
          <div className="flex items-center gap-2">
             <h4 className="text-sm font-black text-on-surface uppercase tracking-tight">{name}</h4>
             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
               priority === 'Critical' ? 'bg-error text-white' : 
               priority === 'High' ? 'bg-secondary text-white' : 'bg-outline text-on-surface'
             }`}>
                {priority} Priority
             </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant italic">{reason}</p>
       </div>
       <div className="text-right">
          <div className="flex items-center gap-1.5 text-primary justify-end">
             <Clock size={12} />
             <span className="text-[10px] font-black uppercase tracking-widest">{status.split(' • ')[1]}</span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mt-1">{status.split(' • ')[0]}</p>
       </div>
    </div>
  );
}

function TaskItem({ label, completed }: { label: string, completed: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
      completed ? 'bg-secondary/5 border-secondary/20' : 'bg-background border-outline hover:border-primary'
    }`}>
       <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${completed ? 'bg-secondary' : 'bg-outline animate-pulse'}`} />
          <span className={`text-xs font-bold ${completed ? 'text-secondary line-through' : 'text-on-surface'}`}>{label}</span>
       </div>
       {completed && <CheckCircle2 size={14} className="text-secondary" />}
    </div>
  );
}

function WorkerStatCard({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="card border-outline bg-surface p-6 space-y-4">
       <div className="flex justify-between items-start">
         <div className="w-8 h-8 rounded-lg bg-background border border-outline flex items-center justify-center text-primary">
            {icon}
         </div>
         <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">{label}</span>
       </div>
       <div>
         <p className="text-2xl font-black text-on-surface">{value}</p>
         <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">{sub}</p>
       </div>
    </div>
  );
}

function WorkerStatAlert({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="card border-error/20 bg-error/5 p-6 space-y-4">
       <div className="flex justify-between items-start">
         <div className="w-8 h-8 rounded-lg bg-error text-white flex items-center justify-center">
            {icon}
         </div>
         <span className="text-[8px] font-black uppercase tracking-widest text-error/60">{label}</span>
       </div>
       <div>
         <p className="text-2xl font-black text-error">{value}</p>
         <p className="text-[10px] font-bold text-error/40 uppercase tracking-widest mt-1">{sub}</p>
       </div>
    </div>
  );
}
function AppointmentItem({ name, specialty, time, image, type, onClick }: { 
  name: string, specialty: string, time: string, image: string, type: 'video' | 'clinic', onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-outline hover:border-primary transition-all group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden border border-outline flex-shrink-0 shadow-sm">
        <img src={image} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{name}</h4>
        <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{specialty}</p>
      </div>
      <div className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black flex flex-col items-center leading-none ${type === 'video' ? 'bg-primary text-white shadow-md' : 'bg-outline text-on-surface'}`}>
        <span>{time.split(' • ')[0]}</span>
        <span className="mt-1 opacity-80">{time.split(' • ')[1]}</span>
      </div>
    </div>
  );
}

function ResultRow({ name, status, isPending }: { name: string, status: string, isPending?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline last:border-0 group">
      <span className="text-sm font-medium text-on-surface group-hover:translate-x-1 transition-transform">{name}</span>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
        isPending 
          ? 'text-primary' 
          : 'bg-background text-on-surface'
      }`}>
        {status}
      </span>
    </div>
  );
}
