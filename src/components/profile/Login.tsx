import React, { useState } from 'react';
import { 
  Stethoscope, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Activity,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = () => {
    if (!selectedRole) return;
    setIsAuthenticating(true);
    // Simulate biometric/protocol sync
    setTimeout(() => {
      onLogin(selectedRole);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-white flex items-center justify-center overflow-hidden selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl px-6 relative z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6"
          >
            <Activity size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Nexus Health Systems v4.0</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Biometric Access
          </h1>
          <p className="text-white/40 font-bold text-lg max-w-sm mx-auto leading-relaxed">
            Initialize your clinical session using authenticated protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <RoleCard 
            selected={selectedRole === 'patient'}
            onClick={() => setSelectedRole('patient')}
            icon={<User size={24} />}
            role="Patient"
            desc="Access personalized AI diagnostic insights and health monitoring."
            accent="bg-primary"
          />
          <RoleCard 
            selected={selectedRole === 'doctor'}
            onClick={() => setSelectedRole('doctor')}
            icon={<Stethoscope size={24} />}
            role="Physician"
            desc="Enter the clinical cockpit for high-fidelity telehealth operations."
            accent="bg-secondary"
          />
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleLogin}
            disabled={!selectedRole || isAuthenticating}
            className={`w-full h-20 rounded-3xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all relative overflow-hidden group ${
              selectedRole 
                ? 'bg-white text-black shadow-2xl shadow-white/10' 
                : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
            }`}
          >
            {isAuthenticating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Syncing Identity...</span>
              </div>
            ) : (
              <>
                <ShieldCheck size={20} className={selectedRole ? 'text-primary' : ''} />
                <span>Initialize Session</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
            
            {selectedRole && (
              <motion.div 
                layoutId="glow"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
            )}
          </button>

          <div className="flex items-center justify-center gap-8 pt-4">
             <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-help group">
                <Cpu size={14} className="group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Quantum Secured</span>
             </div>
             <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-help group">
                <Globe size={14} className="group-hover:text-secondary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Node: Dhaka</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Interface Accents */}
      <div className="absolute top-10 left-10 w-24 h-24 border-l border-t border-white/5 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-r border-b border-white/5 pointer-events-none" />
    </div>
  );
}

function RoleCard({ selected, onClick, icon, role, desc, accent }: { 
  selected: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  role: string, 
  desc: string,
  accent: string
}) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-8 rounded-[40px] text-left border transition-all duration-500 group overflow-hidden ${
        selected 
          ? 'bg-white/5 border-white/20 shadow-2xl scale-[1.02]' 
          : 'bg-[#0A0A0A] border-white/5 border-dashed hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 ${
        selected ? `${accent} text-white shadow-lg` : 'bg-white/5 text-white/40'
      }`}>
        {icon}
      </div>
      <div className="space-y-3 relative z-10">
        <h3 className="text-xl font-black uppercase tracking-widest">{role}</h3>
        <p className={`text-xs font-bold leading-relaxed transition-colors ${
          selected ? 'text-white/60' : 'text-white/20'
        }`}>
          {desc}
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute top-4 right-4 w-2 h-2 rounded-full ${accent} shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] animate-pulse`}
          />
        )}
      </AnimatePresence>

      {/* Micro-grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    </button>
  );
}
