import React, { useState } from 'react';
import { Medicine, UserSettings, ThemeMode, AppLanguage } from '../types/medicine';
import { Bell, Volume2, Vibrate, Clock, PlayCircle, ShieldCheck, AlertCircle, Sparkles, Sun, Moon, Laptop, Palette, Languages } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTranslation } from '../utils/translations';

interface RemindersViewProps {
  medicines: Medicine[];
  settings: UserSettings;
  isDark: boolean;
  systemPrefersDark: boolean;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onRequestPermission: () => Promise<NotificationPermission>;
  onTestNotification: (med?: Medicine) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  medicines,
  settings,
  isDark,
  systemPrefersDark,
  onUpdateSettings,
  onRequestPermission,
  onTestNotification,
}) => {
  const [testing, setTesting] = useState(false);
  const [permStatus, setPermStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const t = getTranslation(settings.language || 'en');

  const handleRequest = async () => {
    sound.playTap();
    const res = await onRequestPermission();
    setPermStatus(res);
  };

  const handleTest = () => {
    sound.playTap();
    setTesting(true);
    onTestNotification();
    setTimeout(() => setTesting(false), 2000);
  };

  const handleThemeSelect = (mode: ThemeMode) => {
    sound.playTap();
    onUpdateSettings({ themeMode: mode });
  };

  const handleLanguageSelect = (lang: AppLanguage) => {
    sound.playTap();
    onUpdateSettings({ language: lang });
  };

  // Compile upcoming scheduled reminders for today
  const activeMeds = medicines.filter(m => m.isActive);
  const scheduledList: { time: string; med: Medicine }[] = [];
  activeMeds.forEach(med => {
    med.scheduleTimes.forEach(t => {
      scheduledList.push({ time: t, med });
    });
  });
  scheduledList.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex-1 pb-24 px-4 pt-3 space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.settingsSubtitle}
        </p>
      </div>

      {/* Language Selection Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.languageTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.languageDesc}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 uppercase">
            {settings.language || 'en'}
          </span>
        </div>

        {/* 3-Way Segmented Language Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl">
          <button
            type="button"
            onClick={() => handleLanguageSelect('en')}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs transition active:scale-95 min-h-[46px] ${
              (settings.language || 'en') === 'en'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <span className="text-xs">English</span>
            <span className="text-[10px] opacity-75">English</span>
          </button>

          <button
            type="button"
            onClick={() => handleLanguageSelect('hi')}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs transition active:scale-95 min-h-[46px] ${
              settings.language === 'hi'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <span className="text-xs">हिन्दी</span>
            <span className="text-[10px] opacity-75">Hindi</span>
          </button>

          <button
            type="button"
            onClick={() => handleLanguageSelect('ur')}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs transition active:scale-95 min-h-[46px] ${
              settings.language === 'ur'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <span className="text-xs">اردو</span>
            <span className="text-[10px] opacity-75">Urdu</span>
          </button>
        </div>
      </div>

      {/* Appearance & Theme Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.themeTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {settings.themeMode === 'system'
                  ? `${t.autoTheme} (${systemPrefersDark ? t.darkTheme : t.lightTheme})`
                  : settings.themeMode === 'dark'
                  ? t.darkTheme
                  : t.lightTheme}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {isDark ? t.darkTheme : t.lightTheme}
          </span>
        </div>

        {/* 3-Way Segmented Theme Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl">
          <button
            type="button"
            onClick={() => handleThemeSelect('system')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition active:scale-95 min-h-[44px] ${
              settings.themeMode === 'system'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>{t.autoTheme}</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeSelect('light')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition active:scale-95 min-h-[44px] ${
              settings.themeMode === 'light'
                ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{t.lightTheme}</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeSelect('dark')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition active:scale-95 min-h-[44px] ${
              settings.themeMode === 'dark'
                ? 'bg-white dark:bg-slate-800 text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>{t.darkTheme}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
          {t.themeAutoExpl}
        </p>
      </div>

      {/* Permission Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                permStatus === 'granted'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
              }`}
            >
              {permStatus === 'granted' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.pushNotifications}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.status}: <span className="font-semibold capitalize">{permStatus}</span>
              </p>
            </div>
          </div>

          {permStatus !== 'granted' ? (
            <button
              onClick={handleRequest}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              {t.enable}
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {t.active}
            </span>
          )}
        </div>
      </div>

      {/* Test Notification Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-sky-100 dark:border-slate-700 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{t.testRemindersNow}</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t.testRemindersDesc}
          </p>
        </div>
        <button
          onClick={handleTest}
          disabled={testing}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-600 dark:hover:bg-sky-700 text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{testing ? t.testing : t.sendTest}</span>
        </button>
      </div>

      {/* Settings List */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {/* Sound Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.audioChime}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.audioChimeDesc}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onUpdateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.soundEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                settings.soundEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Vibration Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Vibrate className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.tactileVibration}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.tactileVibrationDesc}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.vibrationEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                settings.vibrationEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Snooze Duration Selector */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.snoozeDuration}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.snoozeDurationDesc}</p>
            </div>
          </div>
          <select
            value={settings.snoozeMinutes}
            onChange={e => onUpdateSettings({ snoozeMinutes: Number(e.target.value) })}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-sky-500"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>
      </div>

      {/* Scheduled Reminders Schedule */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t.activeTriggers} ({scheduledList.length})
        </h3>
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 p-2 divide-y divide-slate-100 dark:divide-slate-800">
          {scheduledList.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">{t.noScheduledDoses}</p>
          ) : (
            scheduledList.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-white px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700">
                    {item.time}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.med.name}
                    </h5>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                      {item.med.dosage} · {item.med.instructions.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <Bell className="w-3.5 h-3.5 text-sky-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
