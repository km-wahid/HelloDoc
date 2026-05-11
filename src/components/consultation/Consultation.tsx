import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  MessageSquare, 
  PhoneOff, 
  MoreHorizontal, 
  User,
  Activity,
  Heart,
  Thermometer,
  ShieldCheck,
  Expand,
  X,
  ArrowRight,
  Clock,
  MonitorUp,
  MonitorOff,
  FileText,
  Save,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Doctor } from '../../types';
import React, { useState, useEffect } from 'react';

interface ConsultationProps {
  doctor: Doctor;
  onEnd: () => void;
}

export function Consultation({ doctor, onEnd }: ConsultationProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<'intelligence' | 'notes'>('intelligence');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const [messages, setMessages] = useState<{ role: 'user' | 'doctor', text: string }[]>([]);
  const [aiInsights, setAiInsights] = useState<{ type: 'risk' | 'pattern' | 'suggestion', text: string, confidence: number }[]>([
    { type: 'pattern', text: 'Detected respiratory rhythmic variance', confidence: 92 },
    { type: 'suggestion', text: 'Inquire about recent nocturnal dyspnea', confidence: 88 }
  ]);
  const [inputText, setInputText] = useState('');
  const [callStatus, setCallStatus] = useState<'connecting' | 'active'>('connecting');

  useEffect(() => {
    const timer = setTimeout(() => setCallStatus('active'), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callStatus !== 'active') return;
    
    // Simulate periodic AI insights
    const insightTimer = setInterval(() => {
      const newInsights = [
        { type: 'pattern', text: 'Correlating SpO2 dips with speech patterns', confidence: 94 },
        { type: 'risk', text: 'Mild tachycardia detected during exertion', confidence: 85 },
        { type: 'suggestion', text: 'Assess family history of cardiovascular stress', confidence: 91 }
      ];
      const randomInsight = newInsights[Math.floor(Math.random() * newInsights.length)];
      setAiInsights(prev => [randomInsight, ...prev.slice(0, 2)]);
    }, 8000);

    return () => clearInterval(insightTimer);
  }, [callStatus]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { role: 'user', text: inputText }]);
    setInputText('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'doctor', text: "Analyzing your symptoms based on the live feed. Please continue." }]);
    }, 1500);
  };

  const handleSaveNotes = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-primary/30">
      {/* Main Perspective Area */}
      <div className="flex-grow relative flex items-center justify-center bg-black overflow-hidden group">
        <AnimatePresence mode="wait">
          {callStatus === 'connecting' ? (
            <motion.div 
              key="connecting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center gap-10"
            >
              <div className="relative group/avatar">
                <div className="w-40 h-40 rounded-full border border-white/10 p-2 animate-[spin_10s_linear_infinite]">
                  <div className="w-full h-full rounded-full border-t-2 border-primary" />
                </div>
                <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl border-2 border-white/20">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tighter">Establishing Link</h2>
                <div className="flex flex-col items-center gap-2">
                   <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em]">Protocol: Encrypted HD</p>
                   <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full h-full relative"
            >
              <div className="w-full h-full flex items-center justify-center bg-[#080808]">
                 <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              {/* Self View Floating Island */}
              <motion.div 
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="absolute top-10 right-10 w-44 md:w-64 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-3xl border border-white/10 bg-zinc-900 group/self cursor-grab active:cursor-grabbing"
              >
                {!isVideoOff ? (
                  <div className="w-full h-full relative">
                    <User size={64} className="absolute inset-0 m-auto text-zinc-800" />
                    <div className="absolute bottom-5 left-5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(var(--color-secondary),0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Monitor Active</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-950">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
                      <CameraOff size={24} className="text-zinc-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Source Off</span>
                  </div>
                )}
              </motion.div>

              {/* Identity HUD */}
              <div className="absolute bottom-32 left-10 space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">{doctor.name}</h3>
                  <div className="px-4 py-1.5 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Session</span>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-white/40 font-bold text-xs">
                  <div className="flex items-center gap-2 border-r border-white/10 pr-8">
                    <Clock size={16} className="text-primary" />
                    <span className="tabular-nums">00:12:45 ELAPSED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-secondary" />
                    <span className="uppercase tracking-widest">Quantum Secured Link</span>
                  </div>
                  {isScreenSharing && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30"
                    >
                      <MonitorUp size={14} className="animate-pulse" />
                      <span className="uppercase tracking-widest text-[10px] font-black">Screen Broadcast Active</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Control Deck */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-5 bg-surface/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl transition-all hover:bg-surface/20">
          <ControlButton 
            active={isMuted} 
            onClick={() => setIsMuted(!isMuted)} 
            icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />} 
            isDestructive={isMuted}
          />
          <ControlButton 
            active={isVideoOff} 
            onClick={() => setIsVideoOff(!isVideoOff)} 
            icon={isVideoOff ? <CameraOff size={22} /> : <Camera size={22} />} 
            isDestructive={isVideoOff}
          />
          <ControlButton 
            active={isScreenSharing} 
            onClick={() => setIsScreenSharing(!isScreenSharing)} 
            icon={isScreenSharing ? <MonitorOff size={22} /> : <MonitorUp size={22} />} 
            isPrimary={isScreenSharing}
          />
          <div className="w-px h-10 bg-white/10 mx-2" />
          <ControlButton 
            active={false} 
            onClick={() => {}} 
            icon={<MoreHorizontal size={22} />} 
          />
          <ControlButton 
            active={showChat} 
            onClick={() => setShowChat(!showChat)} 
            icon={<MessageSquare size={22} />} 
            isPrimary={showChat}
          />
          <button 
            onClick={onEnd}
            className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-90 group"
          >
            <PhoneOff size={28} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Analytics & Communication Wing */}
      <AnimatePresence>
        {showChat && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full lg:w-[460px] bg-[#0A0A0A] border-l border-white/10 flex flex-col z-50 h-full shadow-3xl"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-6">
                <button 
                  onClick={() => setSidePanelTab('intelligence')}
                  className={`relative pb-8 -mb-8 transition-colors ${sidePanelTab === 'intelligence' ? 'text-white' : 'text-white/20'}`}
                >
                  <div className="space-y-1 text-left">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Protocol</h3>
                    <p className="font-bold text-lg">Intelligence</p>
                  </div>
                  {sidePanelTab === 'intelligence' && (
                    <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                  )}
                </button>
                <button 
                  onClick={() => setSidePanelTab('notes')}
                  className={`relative pb-8 -mb-8 transition-colors ${sidePanelTab === 'notes' ? 'text-white' : 'text-white/20'}`}
                >
                  <div className="space-y-1 text-left">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Diagnostic</h3>
                    <p className="font-bold text-lg">Clinical Notes</p>
                  </div>
                  {sidePanelTab === 'notes' && (
                    <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                  )}
                </button>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-full transition-all border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-10 scrollbar-none">
              <AnimatePresence mode="wait">
                {sidePanelTab === 'intelligence' ? (
                  <motion.div 
                    key="intelligence"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-12"
                  >
                    {/* Telemetry Dashboard */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                          <Activity size={14} />
                          Live Biometric Feed
                        </h4>
                        <span className="text-[10px] font-bold text-secondary animate-pulse uppercase tracking-[0.2em]">Syncing</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <VitalGauge label="Heart Rate" value="78" unit="BPM" accent="text-red-500" />
                        <VitalGauge label="SpO2 Level" value="98" unit="%" accent="text-blue-500" />
                        <VitalGauge label="Ambient Temp" value="98.6" unit="°F" accent="text-amber-500" />
                        <VitalGauge label="BP Sync" value="120/80" unit="SYS/DIA" accent="text-purple-500" />
                      </div>
                    </div>

                    {/* AI Clinical Insights */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                          <Cpu size={14} />
                          Clinical AI Reasoning
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-secondary" />
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">v4.2.1-stable</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                          {aiInsights.map((insight, idx) => (
                            <motion.div
                              key={insight.text}
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className={`p-4 rounded-2xl border ${
                                insight.type === 'risk' 
                                  ? 'bg-red-500/10 border-red-500/20' 
                                  : insight.type === 'pattern' 
                                    ? 'bg-primary/10 border-primary/20' 
                                    : 'bg-white/[0.03] border-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                  insight.type === 'risk' ? 'bg-red-500 text-white' : 
                                  insight.type === 'pattern' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'
                                }`}>
                                  {insight.type}
                                </span>
                                <span className="text-[8px] font-bold text-white/40">{insight.confidence}% Match</span>
                              </div>
                              <p className="text-xs font-bold text-white/90 leading-relaxed">{insight.text}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Intelligence Chat */}
                    <div className="space-y-6 flex flex-col h-[520px]">
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1 border-l-2 border-primary">Encrypted Diagnostic Chat</h4>
                      <div className="flex-grow overflow-y-auto space-y-6 p-6 bg-white/[0.02] rounded-3xl border border-white/5 shadow-inner scrollbar-thin">
                        {messages.map((msg, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                              msg.role === 'user' 
                              ? 'bg-primary text-white shadow-xl shadow-primary/20 rounded-tr-none' 
                              : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                          </motion.div>
                        ))}
                        {messages.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                            <MessageSquare size={48} />
                            <p className="text-xs font-bold uppercase tracking-widest">Protocol Idle</p>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSendMessage} className="relative group">
                        <input 
                          type="text" 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Enter message..." 
                          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all text-sm font-bold placeholder:text-white/20"
                        />
                        <button className="absolute right-3 top-2.5 w-12 h-12 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          <ArrowRight size={20} />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="notes"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                          <FileText size={14} />
                          Clinical Observation Log
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Auto-Sync Active</span>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <textarea 
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Document medical observations, prescriptions, and follow-up plans..."
                          className="w-full h-[600px] bg-white/[0.02] border border-white/10 rounded-3xl p-8 focus:outline-none focus:border-secondary focus:bg-white/[0.04] transition-all text-sm font-medium leading-relaxed resize-none scrollbar-thin placeholder:text-white/10"
                        />
                        <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                          <FileText size={40} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handleSaveNotes}
                        disabled={isSaving || !notes.trim()}
                        className={`flex-grow h-16 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all ${
                          saveStatus === 'success' 
                            ? 'bg-secondary text-white' 
                            : 'bg-white text-black hover:bg-white/90 active:scale-95 disabled:opacity-50 disabled:active:scale-100'
                        }`}
                      >
                        {isSaving ? (
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : saveStatus === 'success' ? (
                          <>
                            <CheckCircle2 size={18} />
                            Log Synced
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save to Patient Record
                          </>
                        )}
                      </button>
                      <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all">
                        <Clock size={20} />
                      </button>
                    </div>

                    <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/20">
                      <p className="text-[10px] font-bold text-secondary/60 leading-relaxed">
                        NOTICE: All notes are encrypted and attached to patient ID #PX-2024-9982. 
                        Clinical integrity is maintained via quantum blockchain verification.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlButton({ active, onClick, icon, isDestructive, isPrimary }: { 
  active: boolean, onClick: () => void, icon: React.ReactNode, isDestructive?: boolean, isPrimary?: boolean 
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        isDestructive && active 
          ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' 
          : isPrimary && active
            ? 'bg-primary text-white shadow-xl shadow-primary/30'
            : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}

function VitalGauge({ label, value, unit, accent }: { label: string, value: string, unit: string, accent: string }) {
  return (
    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4 group transition-all hover:bg-white/[0.06] hover:border-white/10">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-black ${accent}`}>{value}</span>
          <span className="text-[10px] font-bold text-white/20">{unit}</span>
        </div>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full opacity-50 ${accent.replace('text-', 'bg-')}`} style={{ width: '65%' }} />
      </div>
    </div>
  );
}
