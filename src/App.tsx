/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Screen, HealthAssessment, Doctor, UserRole, Language } from './types';
import { MOCK_DOCTORS } from './constants';
import { Header, BottomNav } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { AssessmentForm } from './components/assessment/AssessmentForm';
import { AssessmentResults } from './components/assessment/AssessmentResults';
import { MaternalCompanion } from './components/assessment/MaternalCompanion';
import { MentalHealthPage } from './pages/MentalHealthPage';
import { AIChat } from './components/assistant/AIChat';
import { DoctorSearch } from './components/search/DoctorSearch';
import { DoctorProfile } from './components/search/DoctorProfile';
import { Consultation } from './components/consultation/Consultation';
import { Records } from './components/records/Records';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { Login } from './components/profile/Login';
import { AnimatePresence, motion } from 'motion/react';
import { Wifi, WifiOff, RefreshCcw, UserPlus, Globe, Loader2, BrainCircuit } from 'lucide-react';
import { authService } from './services/authService';
import { assessmentService } from './services/assessmentService';
import { StoredAssessment } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [language, setLanguage] = useState<Language>('EN');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<StoredAssessment | null>(null);
  const [currentUser, setCurrentUser] = useState<{ uid: string; name: string; email: string } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isWorkerMode, setIsWorkerMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setCurrentUser({ uid: user.uid, name: user.name, email: user.email });
          const profile = await authService.getProfile(user.uid);
          if (profile?.role) {
            setUserRole(profile.role);
            setIsAuthenticated(true);
            
            // Sync clinical assessments
            const assessment = await assessmentService.getLatestAssessment();
            setLatestAssessment(assessment);

            if (currentScreen === 'login') setCurrentScreen('dashboard');
          } else {
            // Profile not created yet (might be in middle of registration)
            // or inconsistency. for now just stay on login
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setCurrentUser(null);
        setLatestAssessment(null);
        setCurrentScreen('login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentScreen]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (role: UserRole) => {
    // This is now handled by onAuthStateChanged, 
    // but we can keep it as a fallback or for immediate transition
    setUserRole(role);
    setIsAuthenticated(true);
    navigate('dashboard');
  };

  const handleCompleteAssessment = async (data: HealthAssessment) => {
    setIsAnalyzing(true);
    try {
      // 1. Save raw diagnostic data
      const assessmentId = await assessmentService.saveAssessment(data);
      
      // 2. Generate AI Clinical Report
      const report = await assessmentService.generateAIReport(data);
      
      // 3. Finalize and Store
      await assessmentService.updateAssessmentWithReport(assessmentId, report);
      
      // 4. Update local state and navigate
      const stored = await assessmentService.getLatestAssessment();
      setLatestAssessment(stored);
      navigate('results');
    } catch (error) {
      console.error("Diagnostic failure:", error);
      alert("AI Clinical Engine timed out. Please check connectivity.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate('doctor-profile');
  };

  const handleStartConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate('consultation');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-primary"
        >
          <Loader2 size={48} />
        </motion.div>
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Matrix...</p>
      </div>
    );
  }

  const showNav = currentScreen !== 'consultation' && isAuthenticated;
  const isImmersive = currentScreen === 'consultation' || currentScreen === 'assessment' || currentScreen === 'login';

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary-container selection:text-white">
      {/* Connectivity Banner */}
      {!isOnline && isAuthenticated && (
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="bg-error text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 flex items-center justify-center gap-2 z-[60]"
        >
          <WifiOff size={14} />
          Low Connectivity Mode • Local Storage Active
        </motion.div>
      )}

      {showNav && (
        <Header 
          currentScreen={currentScreen} 
          setScreen={navigate} 
          onLogout={handleLogout} 
          language={language}
          setLanguage={setLanguage}
          userName={currentUser?.name || undefined}
          userEmail={currentUser?.email || undefined}
        />
      )}
      
      <main className={`flex-grow ${isImmersive ? 'w-full' : 'pt-24 pb-32 px-4 md:px-16 max-w-[1440px] mx-auto w-full'}`}>
        {isWorkerMode && currentScreen === 'dashboard' && (
          <div className="mb-10 p-4 bg-secondary/5 border border-secondary/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center shadow-lg">
                <RefreshCcw size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Worker Assistant Mode</p>
                <p className="text-sm font-bold text-on-surface">Community Hub Active • 12 Patient Drafts Pending</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              <UserPlus size={16} />
              New Patient
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={isImmersive ? 'w-full h-full' : ''}
          >
            <div className={isImmersive ? (currentScreen === 'consultation' || currentScreen === 'login' ? '' : 'pt-24 pb-32 px-4 md:px-16 max-w-[1440px] mx-auto w-full') : ''}>
              {currentScreen === 'login' && (
                <Login onLogin={handleLogin} />
              )}

              {currentScreen === 'dashboard' && (
                <Dashboard 
                  onStartAssessment={() => navigate('assessment')} 
                  onViewLatestAssessment={() => navigate('results')}
                  onViewAssistant={() => navigate('ai-assistant')}
                  onViewMaternal={() => navigate('maternal')}
                  onBookConsult={() => navigate('search')} 
                  onStartConsultation={() => handleStartConsultation(MOCK_DOCTORS[0])}
                  userRole={userRole || 'patient'}
                  isWorkerMode={isWorkerMode}
                  setIsWorkerMode={setIsWorkerMode}
                  isOnline={isOnline}
                  language={language}
                  latestAssessment={latestAssessment}
                />
              )}
              
              {currentScreen === 'assessment' && (
                <AssessmentForm 
                  onBack={() => navigate('dashboard')} 
                  onComplete={handleCompleteAssessment} 
                  language={language}
                />
              )}

              {currentScreen === 'results' && latestAssessment && (
                <AssessmentResults 
                  assessment={latestAssessment}
                  onBook={() => navigate('search')} 
                  language={language}
                  onClose={() => navigate('dashboard')}
                />
              )}

              {currentScreen === 'maternal' && (
                <MaternalCompanion 
                  onBack={() => navigate('dashboard')}
                  language={language}
                  latestAssessment={latestAssessment}
                />
              )}

              {currentScreen === 'mental-health' && (
                <MentalHealthPage 
                  onNavigate={navigate}
                />
              )}

              {currentScreen === 'ai-assistant' && (
                <AIChat
                  onBack={() => navigate('dashboard')}
                  language={language}
                  latestAssessment={latestAssessment}
                />
              )}

              {currentScreen === 'search' && (
                <DoctorSearch onSelectDoctor={handleSelectDoctor} />
              )}

              {currentScreen === 'history' && (
                <Records />
              )}

              {currentScreen === 'doctor-profile' && selectedDoctor && (
                <DoctorProfile 
                  doctor={selectedDoctor} 
                  onBack={() => navigate('search')}
                  onBook={() => handleStartConsultation(selectedDoctor)}
                />
              )}

              {currentScreen === 'consultation' && selectedDoctor && (
                <Consultation 
                  doctor={selectedDoctor} 
                  onEnd={() => navigate('dashboard')}
                />
              )}

              {currentScreen === 'settings' && (
                <ProfileSettings 
                  onBack={() => navigate('dashboard')} 
                  onLogout={handleLogout} 
                  userProfile={{
                    name: currentUser?.name || 'User',
                    email: currentUser?.email || '',
                    uid: currentUser?.uid || ''
                  }}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && <BottomNav currentScreen={currentScreen} setScreen={navigate} />}

      {/* AI Analysis Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-on-surface flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-32 h-32 mb-12">
               <motion.div 
                 animate={{ 
                   scale: [1, 1.2, 1],
                   opacity: [0.3, 1, 0.3],
                 }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
               />
               <div className="absolute inset-0 flex items-center justify-center text-primary">
                 <motion.div
                   animate={{ 
                     rotateY: [0, 360],
                   }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 >
                   <BrainCircuit size={64} />
                 </motion.div>
               </div>
            </div>
            
            <div className="space-y-4 max-w-sm">
              <h2 className="text-2xl font-black text-white tracking-tight">AI Clinical Diagnostic</h2>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Gemini is mapping lifestyle patterns against clinical markers. Synchronizing metabolic risk matrix...
              </p>
              <div className="pt-8">
                 <div className="h-1.5 w-48 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <motion.div 
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
