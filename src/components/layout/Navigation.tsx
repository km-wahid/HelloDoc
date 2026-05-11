import { 
  LayoutDashboard, 
  Stethoscope, 
  Search, 
  History, 
  Phone, 
  Bell, 
  UserCircle,
  LogOut
} from 'lucide-react';
import { Screen } from '../../types';

interface HeaderProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  onLogout?: () => void;
}

export function Header({ currentScreen, setScreen, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-20 bg-surface/80 backdrop-blur-md border-b border-outline transition-all duration-300">
      <div className="flex items-center gap-12">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setScreen('dashboard')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            H
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-on-surface">
            HelloDoc
          </span>
        </div>
        
        <nav className="hidden md:flex gap-1">
          {[
            { id: 'dashboard', label: 'Overview' },
            { id: 'assessment', label: 'Assessment' },
            { id: 'search', label: 'Consultants' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setScreen(item.id as Screen)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentScreen === item.id 
                  ? 'bg-background text-primary' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-background/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-outline">
          <span className="text-xs font-bold text-on-surface">English</span>
          <div className="w-px h-3 bg-outline" />
          <span className="text-xs font-medium text-on-surface-variant">বাংলা</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl text-on-surface-variant hover:bg-background hover:text-primary transition-all">
            <Bell size={20} />
          </button>
          <button 
            onClick={() => onLogout?.()}
            className="p-2.5 rounded-xl text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-all group"
            title="Logout"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <div 
            className="flex items-center gap-3 pl-2 border-l border-outline cursor-pointer group"
            onClick={() => setScreen('settings')}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-none group-hover:text-primary transition-colors">Sarah Jenkins</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">ID: #440291</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-background shadow-md group-hover:scale-105 transition-all">
              SJ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function BottomNav({ currentScreen, setScreen }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assessment', label: 'Care', icon: Stethoscope },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'history', label: 'Records', icon: History },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-surface/90 backdrop-blur-xl border border-outline rounded-2xl shadow-2xl px-2 py-2 flex justify-around items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id || (tab.id === 'assessment' && currentScreen === 'results');
        return (
          <button 
            key={tab.id}
            onClick={() => tab.id !== 'history' && setScreen(tab.id as Screen)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'text-primary' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
