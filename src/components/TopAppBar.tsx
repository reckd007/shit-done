import React from 'react';
import { Pill, Bell, BellOff, Smartphone, Monitor, Sun, Moon, Laptop, Languages } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeMode, AppLanguage } from '../types/medicine';
import { getTranslation } from '../utils/translations';

interface TopAppBarProps {
  streak: number;
  notificationsEnabled: boolean;
  onOpenNotifications: () => void;
  showAndroidFrame: boolean;
  onToggleFrame: () => void;
  themeMode: ThemeMode;
  isDark: boolean;
  onCycleTheme: () => void;
  language: AppLanguage;
  onCycleLanguage: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  streak,
  notificationsEnabled,
  onOpenNotifications,
  showAndroidFrame,
  onToggleFrame,
  themeMode,
  isDark,
  onCycleTheme,
  language,
  onCycleLanguage,
}) => {
  const t = getTranslation(language);

  const getThemeTitle = () => {
    if (themeMode === 'system') {
      return `Theme: Auto (System ${isDark ? 'Dark' : 'Light'}) · Click to change`;
    }
    return `Theme: ${themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'} · Click to change`;
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'hi':
        return 'हिन्दी';
      case 'ur':
        return 'اردو';
      default:
        return 'EN';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-sm shadow-sky-500/20">
            <Pill className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              {t.brandName}
            </h1>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Indicator */}
          {streak > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold tabular-nums"
              title={`${streak} ${t.streakBadge}`}
            >
              <span>🔥</span>
              <span>{streak}{t.streakBadge}</span>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={onCycleLanguage}
            title={`Language: ${getLanguageLabel()} · Click to change (English, हिन्दी, اردو)`}
            className="px-2 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 text-xs font-bold border border-slate-200/80 dark:border-slate-700"
          >
            <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-[11px] leading-none">{getLanguageLabel()}</span>
          </button>

          {/* Theme Quick Toggle (System / Light / Dark) */}
          <button
            onClick={onCycleTheme}
            title={getThemeTitle()}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative flex items-center justify-center"
          >
            {themeMode === 'system' ? (
              <div className="relative">
                <Laptop className="w-4 h-4" />
                <span className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ring-1 ring-white dark:ring-slate-900 ${isDark ? 'bg-indigo-400' : 'bg-amber-400'}`} />
              </div>
            ) : themeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Frame View Toggle (phone mockup vs full viewport) */}
          <button
            onClick={onToggleFrame}
            title={showAndroidFrame ? 'Switch to Full Screen View' : 'Preview in Android Phone Frame'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:flex items-center justify-center"
          >
            {showAndroidFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Notification Quick Status */}
          <button
            onClick={onOpenNotifications}
            title={notificationsEnabled ? 'Notifications active' : 'Enable notifications'}
            className={`p-2 rounded-xl transition relative ${
              notificationsEnabled
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
              </>
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>

          {/* In-App PWA Install */}
          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};
