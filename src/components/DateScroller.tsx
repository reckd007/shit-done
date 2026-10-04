import React, { useRef, useEffect } from 'react';
import { formatDateKey, getTodayKey } from '../utils/storage';
import { DoseLog, Medicine, AppLanguage } from '../types/medicine';
import { sound } from '../utils/audio';
import { getTranslation } from '../utils/translations';

interface DateScrollerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  logs: DoseLog[];
  medicines: Medicine[];
  language?: AppLanguage;
}

export const DateScroller: React.FC<DateScrollerProps> = ({
  selectedDate,
  onSelectDate,
  logs,
  medicines,
  language = 'en',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const todayKey = getTodayKey();
  const t = getTranslation(language);

  // Generate 14 days around today (6 days back, today, 7 days forward)
  const days = React.useMemo(() => {
    const list: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    const base = new Date();
    const locale = language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US';

    for (let offset = -6; offset <= 7; offset++) {
      const d = new Date(base);
      d.setDate(base.getDate() + offset);
      const dateStr = formatDateKey(d);
      const dayName = d.toLocaleDateString(locale, { weekday: 'short' });
      const dayNum = d.getDate();

      list.push({
        dateStr,
        dayName,
        dayNum,
        isToday: dateStr === todayKey,
      });
    }
    return list;
  }, [todayKey, language]);

  // Center selected day on initial load
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate]);

  const handleDateClick = (dateStr: string) => {
    sound.playTap();
    onSelectDate(dateStr);
  };

  return (
    <div className="py-2">
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map(d => {
          const isSelected = selectedDate === d.dateStr;

          // Calculate status indicator for this day
          const dayActiveMeds = medicines.filter(m => m.isActive && m.startDate <= d.dateStr);
          let totalDoses = 0;
          dayActiveMeds.forEach(m => (totalDoses += m.scheduleTimes.length));

          const dayLogs = logs.filter(l => l.date === d.dateStr);
          const takenCount = dayLogs.filter(l => l.status === 'taken').length;
          const skippedCount = dayLogs.filter(l => l.status === 'skipped').length;

          let dotColor = 'bg-transparent';
          if (totalDoses > 0) {
            if (takenCount >= totalDoses) {
              dotColor = 'bg-emerald-500';
            } else if (takenCount + skippedCount > 0) {
              dotColor = 'bg-amber-400';
            } else if (d.dateStr < todayKey) {
              dotColor = 'bg-rose-400';
            } else {
              dotColor = 'bg-slate-300 dark:bg-slate-700';
            }
          }

          return (
            <button
              key={d.dateStr}
              data-active={isSelected}
              onClick={() => handleDateClick(d.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[50px] py-2.5 px-1.5 rounded-2xl transition-all duration-150 relative select-none ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-sky-600 shadow-md shadow-slate-900/10 scale-105'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span
                className={`text-[11px] font-semibold tracking-tight uppercase ${
                  isSelected ? 'text-sky-300 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {d.dayName}
              </span>
              <span className="text-base font-bold tabular-nums mt-0.5">{d.dayNum}</span>

              {/* Status pill dot */}
              <div className="mt-1 flex items-center justify-center h-1.5 w-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : dotColor}`} />
              </div>

              {d.isToday && !isSelected && (
                <span className="absolute -bottom-1 text-[9px] font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                  {t.todayLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
