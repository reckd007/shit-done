import React from 'react';
import { CalendarCheck, Pill, Bell, Activity } from 'lucide-react';
import { sound } from '../utils/audio';
import { AppLanguage } from '../types/medicine';
import { getTranslation } from '../utils/translations';

export type NavTab = 'today' | 'cabinet' | 'reminders' | 'insights';

interface BottomNavBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingDoseCount: number;
  lowStockCount: number;
  language?: AppLanguage;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  pendingDoseCount,
  lowStockCount,
  language = 'en',
}) => {
  const t = getTranslation(language);

  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'today',
      label: t.today,
      icon: CalendarCheck,
      badge: pendingDoseCount > 0 ? pendingDoseCount : undefined,
    },
    {
      id: 'cabinet',
      label: t.cabinet,
      icon: Pill,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: 'reminders',
      label: t.reminders,
      icon: Bell,
    },
    {
      id: 'insights',
      label: t.history,
      icon: Activity,
    },
  ];

  const handleSelect = (id: NavTab) => {
    sound.playTap();
    onTabChange(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-1">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1.5 transition-colors relative group select-none ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-100 dark:bg-sky-950/80 scale-105'
                      : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105' : ''}`} />
                </div>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${
                      tab.id === 'cabinet' ? 'bg-rose-500' : 'bg-sky-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[11px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
