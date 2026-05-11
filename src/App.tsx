/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Screen, HealthAssessment, Doctor, UserRole } from './types';
import { MOCK_DOCTORS } from './constants';
import { Header, BottomNav } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { AssessmentForm } from './components/assessment/AssessmentForm';
import { AssessmentResults } from './components/assessment/AssessmentResults';
import { DoctorSearch } from './components/search/DoctorSearch';
import { DoctorProfile } from './components/search/DoctorProfile';
import { Consultation } from './components/consultation/Consultation';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { Login } from './components/profile/Login';
import { AnimatePresence, motion } from 'motion/react';
import { Wifi, WifiOff, RefreshCcw, UserPlus } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assessmentData, setAssessmentData] = useState<HealthAssessment | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isWorkerMode, setIsWorkerMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

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
    setUserRole(role);
    setIsAuthenticated(true);
    navigate('dashboard');
  };

  const handleCompleteAssessment = (data: HealthAssessment) => {
    setAssessmentData(data);
    navigate('results');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate('doctor-profile');
  };

  const handleStartConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate('consultation');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentScreen('login');
  };

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

      {showNav && <Header currentScreen={currentScreen} setScreen={navigate} onLogout={handleLogout} />}
      
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
                  onBookConsult={() => navigate('search')} 
                  onStartConsultation={() => handleStartConsultation(MOCK_DOCTORS[0])}
                  userRole={userRole || 'patient'}
                  isWorkerMode={isWorkerMode}
                  setIsWorkerMode={setIsWorkerMode}
                  isOnline={isOnline}
                />
              )}
              
              {currentScreen === 'assessment' && (
                <AssessmentForm 
                  onBack={() => navigate('dashboard')} 
                  onComplete={handleCompleteAssessment} 
                />
              )}

              {currentScreen === 'results' && (
                <AssessmentResults 
                  onBook={() => navigate('search')} 
                />
              )}

              {currentScreen === 'search' && (
                <DoctorSearch onSelectDoctor={handleSelectDoctor} />
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
                <ProfileSettings onBack={() => navigate('dashboard')} onLogout={handleLogout} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && <BottomNav currentScreen={currentScreen} setScreen={navigate} />}
    </div>
  );
}

