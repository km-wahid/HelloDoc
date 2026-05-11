import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Save, 
  Camera,
  LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileSettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileSettings({ onBack, onLogout }: ProfileSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+880 1712-345678',
    password: '••••••••',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center justify-between border-b border-outline pb-10 px-1">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-surface border border-outline flex items-center justify-center text-on-surface hover:bg-background transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-on-surface">Settings</h1>
            <p className="text-on-surface-variant font-medium">Manage your clinical profile and credentials</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-secondary/10 text-secondary rounded-full">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card bg-surface border-outline p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-black shadow-2xl relative overflow-hidden ring-4 ring-background">
                SJ
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-on-surface text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary transition-all group-hover:scale-110 active:scale-95">
                <Camera size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-1">
              <h3 className="text-lg font-bold">Sarah Jenkins</h3>
              <p className="text-xs font-medium text-on-surface-variant">Member since Jan 2024</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { label: 'Personal Information', active: true },
                { label: 'Security & Auth', active: false },
                { label: 'Connected Devices', active: false },
                { label: 'Notification Protocols', active: false },
              ].map(item => (
                <button 
                  key={item.label}
                  className={`w-full text-left px-6 py-4 rounded-xl text-sm font-bold transition-all ${
                    item.active 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-on-surface-variant hover:bg-background'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              Terminate Session
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="card bg-surface border-outline p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
            
            <div className="space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline pb-4 flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  Personal Coordinates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-14 bg-background border border-outline rounded-2xl px-6 font-bold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-14 bg-background border border-outline rounded-2xl pl-14 pr-6 font-bold focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-14 bg-background border border-outline rounded-2xl pl-14 pr-6 font-bold focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline pb-4 flex items-center gap-2">
                  <Lock size={14} className="text-secondary" />
                  Access Protocols
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      className="w-full h-14 bg-background border border-outline rounded-2xl px-6 font-bold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Confirm Identity</label>
                    <input 
                      type="password" 
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full h-14 bg-background border border-outline rounded-2xl px-6 font-bold focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={isSaving}
                className={`w-full h-16 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl ${
                  saveStatus === 'success' 
                    ? 'bg-secondary text-white shadow-secondary/20' 
                    : 'bg-primary text-white shadow-primary/20 hover:scale-[1.01] active:scale-[0.98]'
                }`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : saveStatus === 'success' ? (
                  <>
                    <ShieldCheck size={20} />
                    Profile Hardened
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Synchronize Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
