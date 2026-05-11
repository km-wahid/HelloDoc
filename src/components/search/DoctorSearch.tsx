import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Briefcase, 
  Video, 
  Calendar,
  ShieldCheck,
  MessageSquareMore,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Doctor } from '../../types';
import { MOCK_DOCTORS } from '../../constants';

export function DoctorSearch({ onSelectDoctor }: { onSelectDoctor: (doctor: Doctor) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-12 pb-20">
      {/* Welcome & Search Section */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface">Find your specialist</h1>
          <p className="text-on-surface-variant text-lg font-medium mt-2">Connect with verified medical professionals instantly.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search by name, specialization, or hospital..."
            className="w-full h-18 pl-18 pr-6 rounded-2xl bg-surface border border-outline hover:border-on-surface-variant/30 focus:border-primary outline-none transition-all font-medium text-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-2 shadow-sm">Popular Filters</span>
          {['All Specialties', 'Pediatrics', 'Cardiology', 'Dermatology', 'Psychiatry'].map(tag => (
            <button key={tag} className="px-5 py-2 rounded-xl bg-surface border border-outline text-xs font-bold text-on-surface-variant hover:border-primary hover:text-primary transition-all">
              {tag}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Doctor List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold">Recommended for you <span className="text-on-surface-variant font-medium">(24)</span></h2>
            <button className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-lg">
              <Filter size={14} />
              Refine Results
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_DOCTORS.map(doc => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => onSelectDoctor(doc)}
                className="card flex flex-col md:flex-row gap-8 p-8 hover:border-primary transition-all cursor-pointer group"
              >
                <div className="relative flex-shrink-0 w-full md:w-48 aspect-square rounded-2xl overflow-hidden shadow-inner bg-background">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg ${doc.isOnline ? 'bg-secondary text-white' : 'bg-on-surface-variant text-white'}`}>
                    <div className={`w-1 h-1 rounded-full ${doc.isOnline ? 'bg-white animate-pulse' : 'bg-white/50'}`} />
                    {doc.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                          {doc.name}
                          <CheckCircle2 size={20} className="text-primary" />
                        </h3>
                        <p className="text-on-surface-variant font-bold text-sm mt-1">{doc.specialty} • {doc.qualifications}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-background px-3 py-1.5 rounded-xl border border-outline">
                        <Star size={14} className="text-amber-500 fill-current" />
                        <span className="text-xs font-black">{doc.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Experience</p>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <Briefcase size={16} />
                          <span className="text-sm font-bold">{doc.experience}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Hospital</p>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <MapPin size={16} />
                          <span className="text-sm font-bold">{doc.hospital}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-outline flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-60">Availability</p>
                      <div className="flex items-center gap-2 text-primary">
                        <Clock size={16} />
                        <p className="text-sm font-black">{doc.nextAvailable}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDoctor(doc);
                        }}
                        className="p-4 bg-background border border-outline rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Video size={20} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDoctor(doc);
                        }}
                        className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm"
                      >
                        Book Consult
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="card space-y-8 bg-surface/50 border-dashed">
            <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline pb-4">Our Commitment</h4>
            <div className="space-y-8">
              <SidebarItem icon={<ShieldCheck className="text-primary" />} title="Verified Professionals" desc="All doctors undergo rigorous background and credential verification." />
              <SidebarItem icon={<ShieldCheck className="text-primary" />} title="Private & Secure" desc="End-to-end encrypted consultations powered by WebRTC protocols." />
              <SidebarItem icon={<MessageSquareMore className="text-primary" />} title="Instant Support" desc="24/7 technical and care coordinators available at one click." />
            </div>
          </div>

          <div className="card space-y-8">
            <div className="flex justify-between items-center border-b border-outline pb-4">
              <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Patient Feedback</h4>
              <button className="text-[10px] font-black text-primary underline">Read all</button>
            </div>
            <div className="space-y-6">
              <ReviewCard name="Rahim Ahmed" text="The AI checkup pinpointed exactly what my doctor confirmed later. Saved me so much anxiety!" rating={5} />
              <ReviewCard name="Sultana Begum" text="Booking was seamless. Dr. Sarah is very professional and the video call was crystal clear." rating={5} />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-on-surface to-zinc-800 text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold tracking-tight">Need urgent help?</h4>
                <p className="text-white/60 text-sm font-medium leading-relaxed">Join our prioritization queue for critical symptoms.</p>
              </div>
              <button className="w-full py-4 bg-primary text-white font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
                Join Waiting Room
              </button>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex-shrink-0 w-10 h-10 bg-background border border-outline rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-on-surface">{title}</p>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ReviewCard({ name, text, rating }: { name: string, text: string, rating: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black">{name}</span>
        <div className="flex gap-0.5 text-amber-500 scale-75 origin-right">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? 'fill-current' : 'text-outline'} />
          ))}
        </div>
      </div>
      <p className="text-xs text-on-surface-variant font-medium italic leading-relaxed">"{text}"</p>
    </div>
  );
}
