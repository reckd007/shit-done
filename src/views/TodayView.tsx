import React, { useEffect, useMemo, useRef } from 'react';
import { Medicine, DoseLog, DoseStatus, ScheduledDoseItem, AppLanguage } from '../types/medicine';
import { DateScroller } from '../components/DateScroller';
import { DoseCard } from '../components/DoseCard';
import { Plus, CheckCircle2, AlertTriangle, Sparkles, Sun, Sunset, Moon, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTranslation } from '../utils/translations';

interface TodayViewProps {
  medicines: Medicine[];
  logs: DoseLog[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onTakeDose: (medicineId: string, time: string) => void;
  onUndoDose: (medicineId: string, time: string) => void;
  onSkipDose: (medicineId: string, time: string, reason?: string) => void;
  onSnoozeDose: (medicine: Medicine, time: string) => void;
  onOpenAddModal: () => void;
  onEditMedicine: (medicine: Medicine) => void;
  onOpenRefillModal: (medicine: Medicine) => void;
  onViewPhoto?: (medicine: Medicine) => void;
  language?: AppLanguage;
}

export const TodayView: React.FC<TodayViewProps> = ({
  medicines,
  logs,
  selectedDate,
  onSelectDate,
  onTakeDose,
  onUndoDose,
  onSkipDose,
  onSnoozeDose,
  onOpenAddModal,
  onEditMedicine,
  onOpenRefillModal,
  onViewPhoto,
  language = 'en',
}) => {
  const confettiFiredRef = useRef<string | null>(null);
  const t = getTranslation(language);

  // Build scheduled doses for selectedDate
  const scheduledDoses: ScheduledDoseItem[] = useMemo(() => {
    const list: ScheduledDoseItem[] = [];
    const activeMeds = medicines.filter(m => m.isActive && m.startDate <= selectedDate);

    activeMeds.forEach(med => {
      med.scheduleTimes.forEach(time => {
        const doseKey = `${med.id}_${selectedDate}_${time}`;
        const log = logs.find(
          l => l.date === selectedDate && l.medicineId === med.id && l.scheduledTime === time
        );

        const status: DoseStatus = log ? log.status : 'pending';

        // Categorize into time window
        const hour = parseInt(time.split(':')[0], 10);
        let timeWindow: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
        if (hour >= 12 && hour < 17) {
          timeWindow = 'afternoon';
        } else if (hour >= 17 && hour < 21) {
          timeWindow = 'evening';
        } else if (hour >= 21 || hour < 6) {
          timeWindow = 'night';
        }

        list.push({
          id: doseKey,
          medicine: med,
          date: selectedDate,
          scheduledTime: time,
          status,
          loggedAt: log?.loggedAt,
          timeWindow,
        });
      });
    });

    // Sort by scheduledTime
    return list.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [medicines, logs, selectedDate]);

  // Statistics for selected date
  const totalCount = scheduledDoses.length;
  const takenCount = scheduledDoses.filter(d => d.status === 'taken').length;
  const skippedCount = scheduledDoses.filter(d => d.status === 'skipped').length;
  const percentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
  const isAllComplete = totalCount > 0 && takenCount + skippedCount === totalCount;

  // Trigger celebration confetti when 100% taken
  useEffect(() => {
    if (isAllComplete && takenCount > 0 && confettiFiredRef.current !== selectedDate) {
      confettiFiredRef.current = selectedDate;
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#10b981', '#f59e0b', '#6366f1'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isAllComplete, takenCount, selectedDate]);

  // Check low stock medicines
  const lowStockMeds = useMemo(() => {
    return medicines.filter(m => m.isActive && m.stockTotal <= m.stockLowAlertThreshold);
  }, [medicines]);

  // Group doses by time windows
  const morningDoses = scheduledDoses.filter(d => d.timeWindow === 'morning');
  const afternoonDoses = scheduledDoses.filter(d => d.timeWindow === 'afternoon');
  const eveningDoses = scheduledDoses.filter(d => d.timeWindow === 'evening');
  const nightDoses = scheduledDoses.filter(d => d.timeWindow === 'night');

  return (
    <div className="flex-1 pb-24 space-y-4">
      {/* Date Scroller */}
      <DateScroller
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        logs={logs}
        medicines={medicines}
        language={language}
      />

      <div className="px-4 space-y-4">
        {/* Daily Progress Summary Card */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-lg shadow-sky-600/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs font-semibold text-sky-200 tracking-wider uppercase">
                {t.dailyIntake}
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight mt-0.5 tabular-nums">
                {takenCount} / {totalCount} {t.ofTaken}
              </h2>
              <p className="text-xs text-sky-100 mt-1">
                {isAllComplete
                  ? t.allTakenMessage
                  : `${totalCount - takenCount - skippedCount} ${t.dosesRemaining}`}
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-sky-900/40"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white transition-all duration-500 ease-out"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black tabular-nums">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Low Stock Warning Alert Banner (if applicable) */}
        {lowStockMeds.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-bold">{t.refillAlert}:</span> {lowStockMeds.map(m => m.name).join(', ')} {t.runningLow}.
              </div>
            </div>
            <button
              onClick={() => onOpenRefillModal(lowStockMeds[0])}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
            >
              {t.refill}
            </button>
          </div>
        )}

        {/* Empty state if no medicines scheduled */}
        {totalCount === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.noMedsToday}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 mb-4">
              {t.addFirstMed}
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMed}</span>
            </button>
          </div>
        )}

        {/* Morning Section */}
        {morningDoses.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>{t.morning}</span>
              <span className="text-slate-400 font-normal">· {t.morningTime}</span>
            </div>
            <div className="space-y-2.5">
              {morningDoses.map(dose => (
                <DoseCard
                  key={dose.id}
                  doseKey={dose.id}
                  medicine={dose.medicine}
                  scheduledTime={dose.scheduledTime}
                  dateStr={selectedDate}
                  status={dose.status}
                  loggedAt={dose.loggedAt}
                  onTake={onTakeDose}
                  onUndo={onUndoDose}
                  onSkip={onSkipDose}
                  onSnooze={onSnoozeDose}
                  onEditMedicine={onEditMedicine}
                  onViewPhoto={onViewPhoto}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Section */}
        {afternoonDoses.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Sun className="w-4 h-4 text-sky-500" />
              <span>{t.afternoon}</span>
              <span className="text-slate-400 font-normal">· {t.afternoonTime}</span>
            </div>
            <div className="space-y-2.5">
              {afternoonDoses.map(dose => (
                <DoseCard
                  key={dose.id}
                  doseKey={dose.id}
                  medicine={dose.medicine}
                  scheduledTime={dose.scheduledTime}
                  dateStr={selectedDate}
                  status={dose.status}
                  loggedAt={dose.loggedAt}
                  onTake={onTakeDose}
                  onUndo={onUndoDose}
                  onSkip={onSkipDose}
                  onSnooze={onSnoozeDose}
                  onEditMedicine={onEditMedicine}
                  onViewPhoto={onViewPhoto}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Evening Section */}
        {eveningDoses.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Sunset className="w-4 h-4 text-orange-500" />
              <span>{t.evening}</span>
              <span className="text-slate-400 font-normal">· {t.eveningTime}</span>
            </div>
            <div className="space-y-2.5">
              {eveningDoses.map(dose => (
                <DoseCard
                  key={dose.id}
                  doseKey={dose.id}
                  medicine={dose.medicine}
                  scheduledTime={dose.scheduledTime}
                  dateStr={selectedDate}
                  status={dose.status}
                  loggedAt={dose.loggedAt}
                  onTake={onTakeDose}
                  onUndo={onUndoDose}
                  onSkip={onSkipDose}
                  onSnooze={onSnoozeDose}
                  onEditMedicine={onEditMedicine}
                  onViewPhoto={onViewPhoto}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Night Section */}
        {nightDoses.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>{t.night}</span>
              <span className="text-slate-400 font-normal">· {t.nightTime}</span>
            </div>
            <div className="space-y-2.5">
              {nightDoses.map(dose => (
                <DoseCard
                  key={dose.id}
                  doseKey={dose.id}
                  medicine={dose.medicine}
                  scheduledTime={dose.scheduledTime}
                  dateStr={selectedDate}
                  status={dose.status}
                  loggedAt={dose.loggedAt}
                  onTake={onTakeDose}
                  onUndo={onUndoDose}
                  onSkip={onSkipDose}
                  onSnooze={onSnoozeDose}
                  onEditMedicine={onEditMedicine}
                  onViewPhoto={onViewPhoto}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Floating Button (Material 3 Android FAB) */}
      <button
        onClick={onOpenAddModal}
        className="fixed bottom-20 right-6 rtl:right-auto rtl:left-6 z-30 w-14 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-600 dark:hover:bg-sky-500 flex items-center justify-center shadow-xl shadow-slate-900/25 active:scale-95 transition-all group"
        title={t.addMed}
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </div>
  );
};
