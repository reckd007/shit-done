import React, { useState } from 'react';
import { Medicine, DoseLog, AppLanguage } from '../types/medicine';
import { formatDateKey, getTodayKey, calculateAdherenceStreak } from '../utils/storage';
import { Activity, Flame, CheckCircle, XCircle, Share2, Calendar, FileText, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTranslation } from '../utils/translations';

interface InsightsViewProps {
  medicines: Medicine[];
  logs: DoseLog[];
  onOpenExportModal: () => void;
  onSelectDate: (date: string) => void;
  language?: AppLanguage;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  medicines,
  logs,
  onOpenExportModal,
  onSelectDate,
  language = 'en',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'taken' | 'skipped'>('all');
  const t = getTranslation(language);

  const streak = calculateAdherenceStreak(logs, medicines);

  // Past 7 days adherence data for weekly bar chart
  const weeklyData = React.useMemo(() => {
    const list: { dateStr: string; label: string; taken: number; total: number; pct: number }[] = [];
    const base = new Date();
    const locale = language === 'hi' ? 'hi-IN' : language === 'ur' ? 'ur-PK' : 'en-US';

    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const dateStr = formatDateKey(d);
      const label = d.toLocaleDateString(locale, { weekday: 'narrow' });

      const dayMeds = medicines.filter(m => m.isActive && m.startDate <= dateStr);
      let total = 0;
      dayMeds.forEach(m => (total += m.scheduleTimes.length));

      const dayLogs = logs.filter(l => l.date === dateStr);
      const taken = dayLogs.filter(l => l.status === 'taken').length;
      const pct = total > 0 ? Math.min(100, Math.round((taken / total) * 100)) : 0;

      list.push({ dateStr, label, taken, total, pct });
    }
    return list;
  }, [medicines, logs, language]);

  // Overall statistics for all logged items
  const totalTaken = logs.filter(l => l.status === 'taken').length;
  const totalSkipped = logs.filter(l => l.status === 'skipped').length;
  const totalLogged = totalTaken + totalSkipped;
  const overallRate = totalLogged > 0 ? Math.round((totalTaken / totalLogged) * 100) : 100;

  // Filtered recent log records
  const recentLogs = [...logs]
    .sort((a, b) => (b.loggedAt || 0) - (a.loggedAt || 0))
    .filter(l => {
      if (filterType === 'all') return true;
      return l.status === filterType;
    })
    .slice(0, 30);

  return (
    <div className="flex-1 pb-24 px-4 pt-3 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{t.historyTitle}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.historySubtitle}</p>
        </div>
        <button
          onClick={() => {
            sound.playTap();
            onOpenExportModal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-600 dark:hover:bg-sky-700 text-xs font-bold shadow-sm transition active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span>{t.doctorReport}</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center">
          <div className="flex items-center justify-center text-amber-500 mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
            {streak}{t.streakBadge}
          </span>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
            {t.streak}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center">
          <div className="flex items-center justify-center text-emerald-500 mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
            {overallRate}%
          </span>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
            {t.adherence}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center">
          <div className="flex items-center justify-center text-sky-500 mb-1">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalTaken}
          </span>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
            {t.allTimeTaken}
          </p>
        </div>
      </div>

      {/* Weekly Adherence Bar Graph */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.sevenDayTrend}
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
            7 {t.streakBadge}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1">
          {weeklyData.map(d => (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate(d.dateStr)}
              className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
              title={`${d.dateStr}: ${d.taken}/${d.total} (${d.pct}%)`}
            >
              <span className="text-[10px] font-bold text-slate-500 tabular-nums opacity-0 group-hover:opacity-100 transition">
                {d.pct}%
              </span>
              <div className="w-full max-w-[28px] h-20 bg-slate-100 dark:bg-slate-700/60 rounded-xl relative overflow-hidden flex items-end">
                <div
                  className={`w-full rounded-xl transition-all duration-300 ${
                    d.pct >= 100
                      ? 'bg-emerald-500'
                      : d.pct >= 50
                      ? 'bg-sky-500'
                      : d.pct > 0
                      ? 'bg-amber-400'
                      : 'bg-transparent'
                  }`}
                  style={{ height: `${Math.max(d.pct, 4)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {d.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.recentActivity}
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'taken', 'skipped'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition ${
                  filterType === type
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {type === 'all' ? t.allTypes : type === 'taken' ? t.taken : t.skipped}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
          {recentLogs.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">{t.noScheduledDoses}</p>
          ) : (
            recentLogs.map(log => {
              const med = medicines.find(m => m.id === log.medicineId);
              const isTaken = log.status === 'taken';

              return (
                <div key={log.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isTaken
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {isTaken ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {med ? med.name : 'Medication'} <span className="font-normal text-slate-500">({med?.dosage})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        {log.date} · {log.scheduledTime}
                        {log.skippedReason && ` · ${log.skippedReason}`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-semibold capitalize text-[11px] px-2 py-0.5 rounded-md ${
                      isTaken
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'text-slate-600 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {isTaken ? t.taken : t.skipped}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
