import React, { useState } from 'react';
import { 
  Heart, 
  Moon, 
  History, 
  Accessibility, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck,
  Search,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HealthAssessment } from '../../types';

interface AssessmentFormProps {
  onBack: () => void;
  onComplete: (data: HealthAssessment) => void;
}

const STEPS = [
  { id: 'biometrics', label: 'Biometrics', icon: <Heart size={18} /> },
  { id: 'clinical', label: 'Clinical History', icon: <History size={18} /> },
  { id: 'lifestyle', label: 'Lifestyle', icon: <Moon size={18} /> },
  { id: 'maternal', label: 'Maternal', icon: <ShieldCheck size={18} /> },
  { id: 'symptoms', label: 'Current State', icon: <Accessibility size={18} /> }
];

export function AssessmentForm({ onBack, onComplete }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<HealthAssessment>({
    name: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bloodGroup: '',
    existingDiseases: [],
    familyHistory: [],
    allergies: [],
    medicationHistory: '',
    smokingStatus: 'Non-smoker',
    sleepPattern: '',
    foodHabits: '',
    waterIntake: '',
    physicalActivity: 'Moderate',
    stressLevel: 'Medium',
    isPregnant: false,
    symptoms: []
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface">Health Diagnostics</h1>
          <p className="text-on-surface-variant text-lg font-medium max-w-xl">
            Provide precise clinical data for our AI to generate your personalized risk profile.
          </p>
        </div>
        <div className="flex bg-surface p-1 rounded-xl border border-outline shadow-sm gap-1">
          {STEPS.map((step, idx) => (
            <button 
              key={step.id}
              onClick={() => idx < currentStep && setCurrentStep(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                idx === currentStep 
                  ? 'bg-primary text-white shadow-md' 
                  : idx < currentStep 
                    ? 'text-primary hover:bg-background' 
                    : 'text-on-surface-variant opacity-40 cursor-not-allowed'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${idx === currentStep ? 'bg-white' : 'bg-primary'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Area */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="card bg-surface border-outline p-10 shadow-2xl min-h-[460px] flex flex-col"
            >
              <div className="flex-grow">
                {currentStep === 0 && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-outline pb-6">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Biological Profile</h2>
                        <p className="text-sm font-medium text-on-surface-variant">Foundational biometric data for AI calibration.</p>
                      </div>
                      <HelpCircle size={20} className="text-on-surface-variant opacity-40" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput 
                        label="Full Name" 
                        type="text" 
                        placeholder="Legal Name"
                        value={formData.name}
                        onChange={(v) => setFormData({...formData, name: v})}
                      />
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Biological Gender</label>
                        <select 
                          className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-bold text-lg cursor-pointer"
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <FormInput 
                        label="Age" 
                        type="number" 
                        placeholder="Years"
                        value={formData.age}
                        onChange={(v) => setFormData({...formData, age: v})}
                      />
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Blood Group</label>
                        <select 
                          className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-bold text-lg cursor-pointer"
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                        >
                          <option value="">Select Category</option>
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                      <FormInput 
                        label="Weight (kg)" 
                        type="number" 
                        placeholder="Kilograms"
                        value={formData.weight}
                        onChange={(v) => setFormData({...formData, weight: v})}
                      />
                      <FormInput 
                        label="Height (cm)" 
                        type="number" 
                        placeholder="Centimeters"
                        value={formData.height}
                        onChange={(v) => setFormData({...formData, height: v})}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-outline pb-6">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Clinical Record</h2>
                        <p className="text-sm font-medium text-on-surface-variant">Past diagnoses and genetic risk indicators.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Existing Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Diabetes', 'Hypertension', 'Asthma', 'Thyroid'].map(dis => (
                            <button 
                              key={dis}
                              onClick={() => {
                                const newItems = formData.existingDiseases.includes(dis)
                                  ? formData.existingDiseases.filter(d => d !== dis)
                                  : [...formData.existingDiseases, dis];
                                setFormData({...formData, existingDiseases: newItems});
                              }}
                              className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                                formData.existingDiseases.includes(dis) 
                                  ? 'bg-primary text-white border-primary' 
                                  : 'bg-background border-outline text-on-surface'
                              }`}
                            >
                              {dis}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Current Medications</label>
                        <input 
                          type="text" 
                          placeholder="List current drugs..."
                          value={formData.medicationHistory}
                          onChange={(e) => setFormData({...formData, medicationHistory: e.target.value})}
                          className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-bold text-lg"
                        />
                      </div>
                    </div>
                    <textarea 
                      className="w-full min-h-[160px] p-6 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-medium text-base leading-relaxed"
                      placeholder="Detail any family disease history or known allergies..."
                      onChange={(e) => setFormData({...formData, familyHistory: [e.target.value]})}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-outline pb-6">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Lifestyle Behavior</h2>
                        <p className="text-sm font-medium text-on-surface-variant">Daily routines affecting physiological homeostasis.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Smoking & Tobacco</label>
                        <select 
                          className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-bold text-lg"
                          value={formData.smokingStatus}
                          onChange={(e) => setFormData({...formData, smokingStatus: e.target.value as any})}
                        >
                          <option value="Non-smoker">Non-smoker</option>
                          <option value="Occasional">Occasional</option>
                          <option value="Active">Active</option>
                        </select>
                      </div>
                      <FormInput 
                        label="Sleep Pattern (Avg Hours)" 
                        type="number" 
                        placeholder="Hours per night"
                        value={formData.sleepPattern}
                        onChange={(v) => setFormData({...formData, sleepPattern: v})}
                      />
                      <FormInput 
                        label="Water Intake (Liters/Day)" 
                        type="number" 
                        placeholder="Liters"
                        value={formData.waterIntake}
                        onChange={(v) => setFormData({...formData, waterIntake: v})}
                      />
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Physical Activity</label>
                        <select 
                          className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-bold text-lg"
                          value={formData.physicalActivity}
                          onChange={(e) => setFormData({...formData, physicalActivity: e.target.value as any})}
                        >
                          <option value="Sedentary">Sedentary</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Active">Active</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Stress Level</label>
                        <select 
                          className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary outline-none transition-all font-bold text-lg"
                          value={formData.stressLevel}
                          onChange={(e) => setFormData({...formData, stressLevel: e.target.value as any})}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <FormInput 
                        label="Food Habits" 
                        type="text" 
                        placeholder="e.g. Vegetarian, High Protein..."
                        value={formData.foodHabits}
                        onChange={(v) => setFormData({...formData, foodHabits: v})}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-outline pb-6">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Maternal Health</h2>
                        <p className="text-sm font-medium text-on-surface-variant">Pregnancy data for specialized AI risk tracking.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <ChoiceCard 
                        title="Pregnancy Status"
                        desc="Are you currently pregnant?"
                        icon={<ShieldCheck size={20} />}
                        selected={formData.isPregnant}
                        onClick={() => setFormData({...formData, isPregnant: !formData.isPregnant})}
                      />
                      {formData.isPregnant && (
                        <FormInput 
                          label="Pregnancy Duration (Weeks)" 
                          type="number" 
                          placeholder="Gestational weeks..."
                          value={formData.pregnancyWeeks?.toString() || ''}
                          onChange={(v) => setFormData({...formData, pregnancyWeeks: parseInt(v)})}
                        />
                      )}
                    </div>
                    <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/20 flex gap-4">
                      <Cpu size={24} className="text-secondary flex-shrink-0" />
                      <p className="text-[11px] font-bold text-secondary leading-relaxed uppercase tracking-widest">
                        AI: Monitoring for gestational hypertension and metabolic variance thresholds based on pregnancy data.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-outline pb-6">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Current State</h2>
                        <p className="text-sm font-medium text-on-surface-variant">Symptom localization for diagnostic weighting.</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-10">
                      <div className="flex-grow bg-background rounded-2xl min-h-[320px] flex items-center justify-center border-2 border-dashed border-outline relative overflow-hidden group">
                        <img 
                          src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000" 
                          alt="Physiology Map" 
                          className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 blur-[2px]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="px-6 py-3 bg-surface/90 backdrop-blur-md rounded-2xl shadow-2xl border border-outline font-black text-[10px] uppercase tracking-widest text-primary">
                            Interactive Body Map
                          </div>
                        </div>
                      </div>
                      <div className="md:w-72 space-y-2">
                        {['Head/Neural', 'Cardiothoracic', 'Gastrointestinal', 'Maternal Discomfort'].map(area => (
                          <button 
                            key={area}
                            onClick={() => {
                              const newSymp = formData.symptoms.includes(area)
                                ? formData.symptoms.filter(s => s !== area)
                                : [...formData.symptoms, area];
                              setFormData({...formData, symptoms: newSymp});
                            }}
                            className={`w-full p-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-between group active:scale-95 ${
                              formData.symptoms.includes(area)
                                ? 'bg-primary text-white border-primary'
                                : 'border-outline text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5'
                            }`}
                          >
                            <span>{area}</span>
                            <ArrowRight size={14} className={formData.symptoms.includes(area) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-10 pt-10 border-t border-outline">
                <button 
                  onClick={prevStep}
                  className="px-8 py-4 rounded-2xl bg-background text-on-surface font-black text-sm hover:bg-outline/50 transition-all flex items-center gap-2 group shadow-sm active:scale-95"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  {currentStep === 0 ? 'Diagnostic Exit' : 'Back'}
                </button>
                <button 
                  onClick={nextStep}
                  className="px-10 py-4 rounded-2xl bg-primary text-white font-black text-base hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group"
                >
                  {currentStep === STEPS.length - 1 ? 'Quantify Risks' : 'Continue'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="card bg-on-surface text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-transform">
                  <Cpu size={24} className="text-primary fill-primary/20" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">AI Reasoning</h3>
              </div>
              <p className="text-base font-medium leading-relaxed text-white/70 italic">
                "Based on current biometric inputs, I am balancing your age-weighted risk factors against global health datasets. High precision in weight metrics reduces error margins by <span className="text-primary font-black">1.2%</span>."
              </p>
              <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                <ShieldCheck size={18} className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified HIPAA Encrypted</span>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          </div>

          <div className="card space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline pb-4">Real-time Feedback</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-background border border-outline group hover:border-primary transition-all">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-on-surface">Data Completeness</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Step 1 metrics help refine the cardiovascular model.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-background border border-outline group hover:border-primary transition-all opacity-50">
                <div className="w-2 h-2 rounded-full bg-outline mt-1.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-on-surface">Risk Weighting</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Pending input from History (Step 3).</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormInput({ label, type, placeholder, value, onChange }: { 
  label: string, type: string, placeholder: string, value: string, onChange: (v: string) => void 
}) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-display">
        {label}
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-5 rounded-2xl bg-background border border-outline focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg placeholder:opacity-50"
      />
    </div>
  );
}

function ChoiceCard({ title, desc, icon, selected, onClick }: { 
  title: string, desc: string, icon: React.ReactNode, selected: boolean, onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 h-full relative overflow-hidden active:scale-95 ${
        selected 
          ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' 
          : 'border-outline bg-background hover:border-on-surface-variant/30'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        selected ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant shadow-sm border border-outline'
      }`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-base text-on-surface tracking-tight">{title}</h3>
        <p className="text-[10px] font-bold text-on-surface-variant mt-1 leading-relaxed opacity-80">{desc}</p>
      </div>
      {selected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />}
    </button>
  );
}
