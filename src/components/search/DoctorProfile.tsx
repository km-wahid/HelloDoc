import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Video, 
  Phone,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Doctor } from '../../types';

interface DoctorProfileProps {
  doctor: Doctor;
  onBack: () => void;
  onBook: () => void;
}

export function DoctorProfile({ doctor, onBack, onBook }: DoctorProfileProps) {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const dates = [
    { day: 'Mon', date: '12 May' },
    { day: 'Tue', date: '13 May' },
    { day: 'Wed', date: '14 May' },
    { day: 'Thu', date: '15 May' },
    { day: 'Fri', date: '16 May' },
  ];

  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM'];
  const afternoonSlots = ['02:00 PM', '03:30 PM', '04:00 PM', '05:30 PM'];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all font-bold group bg-surface px-4 py-2 rounded-xl border border-outline shadow-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        <div className="flex gap-2">
          <button className="p-3 bg-surface border border-outline rounded-xl text-on-surface-variant hover:text-primary transition-all shadow-sm">
            <MessageSquare size={20} />
          </button>
          <button className="p-3 bg-surface border border-outline rounded-xl text-on-surface-variant hover:text-primary transition-all shadow-sm">
            <Video size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Info */}
        <div className="lg:col-span-8 space-y-10">
          <section className="flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0 w-full md:w-56 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-white">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-grow space-y-8 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface">
                    {doctor.name}
                  </h1>
                  <CheckCircle2 size={28} className="text-primary" />
                </div>
                <p className="text-xl text-on-surface-variant font-medium">
                  {doctor.specialty} • {doctor.qualifications}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatBox icon={<Briefcase />} label="Experience" value={doctor.experience} />
                <StatBox icon={<Star />} label="Rating" value={`${doctor.rating} (${doctor.reviewCount}+)`} />
                <StatBox icon={<MapPin />} label="Based At" value={doctor.hospital.split(' ')[0]} />
                <StatBox icon={<GraduationCap />} label="Status" value="Verified" isVerified />
              </div>
            </div>
          </section>

          <section className="space-y-10 pt-10 border-t border-outline">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Profile Description</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
                {doctor.name} is a renowned {doctor.specialty} specializing in diagnostic complexity and patient-first care. 
                With over {doctor.experience.split('+')[0]} years in clinical practice, they focus on preventive methodologies 
                and advanced digital monitoring to ensure holistic patient recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="card space-y-6">
                <h3 className="text-sm font-black flex items-center gap-2 text-on-surface uppercase tracking-widest">
                  <GraduationCap size={18} className="text-primary" />
                  Education
                </h3>
                <ul className="space-y-4">
                  <EducationItem title="MBBS, MD Cardiology" subtitle="Dhaka Medical College & Hospital" />
                  <EducationItem title="Residency & Fellowship" subtitle="Global Health Institute, London" />
                </ul>
              </div>
              <div className="card space-y-6">
                <h3 className="text-sm font-black flex items-center gap-2 text-on-surface uppercase tracking-widest">
                  <Award size={18} className="text-primary" />
                  Achievements
                </h3>
                <ul className="space-y-4">
                  <EducationItem title="Excellence in Care 2024" subtitle="National Health Council" />
                  <EducationItem title="Chief Researcher" subtitle="Modern Medicine Journal" />
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Booking Sidebar */}
        <aside className="lg:col-span-4">
          <section className="card bg-surface border-outline p-8 shadow-2xl sticky top-32 space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Reserve Appointment</h2>
              <p className="text-sm font-medium text-on-surface-variant">Choose a slot for your video consultation.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
                {dates.map((d, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedDate(i)}
                    className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                      selectedDate === i 
                        ? 'bg-primary border-primary text-white shadow-lg' 
                        : 'bg-background border-outline text-on-surface-variant hover:border-on-surface-variant'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.day}</span>
                    <span className="text-xl font-black">{d.date.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold">{d.date.split(' ')[1]}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1 border-l-2 border-primary">Morning Available</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {morningSlots.map(slot => (
                      <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl border font-bold text-xs transition-all ${
                          selectedSlot === slot 
                            ? 'bg-primary text-white border-primary shadow-md' 
                            : 'bg-background border-outline text-on-surface-variant hover:border-primary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1 border-l-2 border-primary">Afternoon Available</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {afternoonSlots.map(slot => (
                      <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl border font-bold text-xs transition-all ${
                          selectedSlot === slot 
                            ? 'bg-primary text-white border-primary shadow-md' 
                            : 'bg-background border-outline text-on-surface-variant hover:border-primary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-outline space-y-6">
              <div className="flex justify-between items-center px-1">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Total Fee</p>
                  <p className="text-sm font-medium text-on-surface-variant">Video consultation</p>
                </div>
                <span className="text-3xl font-black text-on-surface">$45.00</span>
              </div>
              <button 
                disabled={!selectedSlot}
                onClick={onBook}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 shadow-xl ${
                  selectedSlot 
                    ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95' 
                    : 'bg-outline text-white/50 cursor-not-allowed'
                }`}
              >
                Confirm & Pay
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, isVerified }: { icon: React.ReactNode, label: string, value: string, isVerified?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-on-surface-variant opacity-60">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-base font-bold ${isVerified ? 'text-secondary' : 'text-on-surface'}`}>{value}</p>
    </div>
  );
}

function EducationItem({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="space-y-1 group">
      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{title}</p>
      <p className="text-xs text-on-surface-variant font-medium">{subtitle}</p>
    </div>
  );
}
