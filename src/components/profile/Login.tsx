import React, { useState } from 'react';
import { 
  Stethoscope, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Activity,
  Globe,
  Mail,
  Lock,
  UserPlus,
  KeyRound,
  RefreshCcw,
  ArrowLeft,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

type AuthMode = 'login' | 'register' | 'recovery';

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleDirectDemoLogin = async (role: 'patient' | 'doctor') => {
    setError(null);
    setIsAuthenticating(true);
    try {
      const profile = await authService.loginWithDemo(role);
      onLogin(profile.role);
    } catch (err: any) {
      setError(err.message || 'Direct demo login failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    try {
      if (mode === 'login') {
        if (!selectedRole || !email || !password) {
          throw new Error('Please enter all credentials and select your role.');
        }
        const profile = await authService.login(email, password);
        if (profile.role !== selectedRole) {
          await authService.logout();
          throw new Error(`Unauthorized role. You are registered as a ${profile.role}.`);
        }
        onLogin(profile.role);
      } else if (mode === 'register') {
        if (!selectedRole || !email || !password || !name) {
          throw new Error('Please provide all details for registration.');
        }
        const profile = await authService.register(email, password, name, selectedRole);
        onLogin(profile.role);
      } else if (mode === 'recovery') {
        if (!email) {
          throw new Error('Please enter your email to recover access.');
        }
        await authService.resetPassword(email);
        setRecoverySent(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected protocol error occurred.');
    } finally {
      setIsAuthenticating(false);
    }
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
        className="w-full max-w-xl px-4 md:px-6 relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-4"
          >
            <Activity size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Nexus Health Systems v4.0</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {mode === 'login' ? 'Biometric Access' : mode === 'register' ? 'Clinical Enrollment' : 'Identity Recovery'}
          </h1>
          <p className="text-white/40 font-bold text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            {mode === 'login' 
              ? 'Initialize your clinical session using authenticated protocols.' 
              : mode === 'register' 
              ? 'Create your decentralized health identity on the Nexus node.'
              : 'Restore access to your secure diagnostic terminal.'}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500"
            >
              <AlertTriangle size={18} className="shrink-0" />
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
             <button 
                type="button"
                onClick={async () => {
                   setError(null);
                   setIsAuthenticating(true);
                   try {
                     const profile = await authService.loginWithGoogle();
                     onLogin(profile.role);
                   } catch (err: any) {
                     setError(err.message || "Google sync failed.");
                   } finally {
                     setIsAuthenticating(false);
                   }
                }}
                disabled={isAuthenticating}
                className="w-full h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white/60 hover:bg-white/10 hover:text-white transition-all group"
             >
                {isAuthenticating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Continue with Google</span>
                  </>
                )}
             </button>

             <div className="flex items-center gap-4 px-2">
                <div className="h-px flex-grow bg-white/5" />
                <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">or Clinical ID</span>
                <div className="h-px flex-grow bg-white/5" />
              </div>

              {mode === 'login' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDirectDemoLogin('patient')}
                    disabled={isAuthenticating}
                    className="h-12 rounded-2xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    Direct Patient Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDirectDemoLogin('doctor')}
                    disabled={isAuthenticating}
                    className="h-12 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    Direct Doctor Login
                  </button>
                </div>
              )}
           </div>

          <AnimatePresence mode="wait">
            {(mode === 'login' || mode === 'register') && (
              <motion.div 
                key="roles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 gap-4"
              >
                <RoleCard 
                  selected={selectedRole === 'patient'}
                  onClick={() => setSelectedRole('patient')}
                  icon={<User size={20} />}
                  role="Patient"
                  accent="bg-primary"
                />
                <RoleCard 
                  selected={selectedRole === 'doctor'}
                  onClick={() => setSelectedRole('doctor')}
                  icon={<Stethoscope size={20} />}
                  role="Physician"
                  accent="bg-secondary"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div 
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AuthInput 
                    icon={<User size={18} />} 
                    placeholder="Full Clinical Name" 
                    value={name} 
                    onChange={setName}
                    type="text"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {mode !== 'recovery' || !recoverySent ? (
               <>
                <AuthInput 
                  icon={<Mail size={18} />} 
                  placeholder="Clinical Identity (Email)" 
                  value={email} 
                  onChange={setEmail}
                  type="email"
                />
                
                {mode !== 'recovery' && (
                  <AuthInput 
                    icon={<Lock size={18} />} 
                    placeholder="Access Key (Password)" 
                    value={password} 
                    onChange={setPassword}
                    type="password"
                  />
                )}
               </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-[40px] bg-secondary/10 border border-secondary/20 text-center space-y-4"
              >
                <RefreshCcw size={32} className="mx-auto text-secondary animate-spin-slow" />
                <h3 className="text-xl font-black uppercase tracking-widest text-secondary">Protocol Initiated</h3>
                <p className="text-sm font-medium text-white/60">An identity restoration link has been dispatched to your verified node.</p>
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  Return to Access Point
                </button>
              </motion.div>
            )}
          </div>

          {!recoverySent && (
            <div className="space-y-6">
              <button 
                type="submit"
                disabled={isAuthenticating || (mode === 'login' && !selectedRole)}
                className={`w-full h-16 md:h-20 rounded-3xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all relative overflow-hidden group ${
                  (mode === 'login' ? selectedRole : true) && (email || name)
                    ? 'bg-white text-black shadow-2xl shadow-white/10' 
                    : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                }`}
              >
                {isAuthenticating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck size={20} className={selectedRole ? 'text-primary' : ''} />
                    <span>{mode === 'login' ? 'Sync Identity' : mode === 'register' ? 'Deploy Identity' : 'Request Unlock'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-6">
                  {mode === 'login' ? (
                    <button 
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <UserPlus size={14} />
                      Enrollment
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={14} />
                      Access Node
                    </button>
                  )}
                  {mode !== 'recovery' && (
                    <button 
                      type="button"
                      onClick={() => setMode('recovery')}
                      className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <KeyRound size={14} />
                      Recovery
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-4 opacity-10">
                   <Cpu size={12} />
                   <Globe size={12} />
                </div>
              </div>
            </div>
          )}
        </form>
      </motion.div>

      {/* Interface Accents */}
      <div className="absolute top-10 left-10 w-24 h-24 border-l border-t border-white/5 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-r border-b border-white/5 pointer-events-none" />
    </div>
  );
}

function RoleCard({ selected, onClick, icon, role, accent }: { 
  selected: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  role: string, 
  accent: string
}) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`relative p-4 md:p-6 rounded-[32px] text-left border transition-all duration-500 group overflow-hidden ${
        selected 
          ? 'bg-white/5 border-white/20 shadow-xl' 
          : 'bg-white/[0.02] border-white/5 border-dashed hover:border-white/10'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-500 ${
        selected ? `${accent} text-white shadow-lg` : 'bg-white/5 text-white/40'
      }`}>
        {icon}
      </div>
      <h3 className="text-xs font-black uppercase tracking-widest">{role}</h3>
      {selected && (
        <motion.div 
          layoutId="role-indicator"
          className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${accent} animate-pulse`}
        />
      )}
    </button>
  );
}

function AuthInput({ icon, placeholder, value, onChange, type }: { 
  icon: React.ReactNode, 
  placeholder: string, 
  value: string, 
  onChange: (val: string) => void,
  type: string
}) {
  return (
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
        {icon}
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-16 md:h-20 bg-white/[0.03] border border-white/5 rounded-3xl pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
      />
    </div>
  );
}
