import React, { useState } from 'react';
import { Medicine, DoseStatus, FoodInstruction, AppLanguage } from '../types/medicine';
import { Check, RotateCcw, Clock, MoreVertical, XCircle, AlertTriangle, Camera } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTranslation, getFoodInstructionLabel } from '../utils/translations';

interface DoseCardProps {
  doseKey: string;
  medicine: Medicine;
  scheduledTime: string;
  dateStr: string;
  status: DoseStatus;
  loggedAt?: number;
  onTake: (medicineId: string, time: string) => void;
  onUndo: (medicineId: string, time: string) => void;
  onSkip: (medicineId: string, time: string, reason?: string) => void;
  onSnooze: (medicine: Medicine, time: string) => void;
  onEditMedicine: (med: Medicine) => void;
  onViewPhoto?: (medicine: Medicine) => void;
  language?: AppLanguage;
}

export const DoseCard: React.FC<DoseCardProps> = ({
  medicine,
  scheduledTime,
  status,
  loggedAt,
  onTake,
  onUndo,
  onSkip,
  onSnooze,
  onEditMedicine,
  onViewPhoto,
  language = 'en',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const t = getTranslation(language);

  const getFoodLabel = (inst: FoodInstruction) => {
    return getFoodInstructionLabel(inst, language);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80',
          dot: 'bg-emerald-500',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80',
          dot: 'bg-amber-500',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80',
          dot: 'bg-indigo-500',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80',
          dot: 'bg-rose-500',
        };
      case 'teal':
        return {
          bg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/80',
          dot: 'bg-teal-500',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/80',
          dot: 'bg-purple-500',
        };
      default:
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/80',
          dot: 'bg-sky-500',
        };
    }
  };

  const colors = getColorClasses(medicine.color);
  const isTaken = status === 'taken';
  const isSkipped = status === 'skipped';
  const isPending = status === 'pending';
  const isLowStock = medicine.stockTotal <= medicine.stockLowAlertThreshold;

  const handleTakeClick = () => {
    sound.playDoseTakenSound();
    onTake(medicine.id, scheduledTime);
  };

  const handleUndoClick = () => {
    sound.playTap();
    onUndo(medicine.id, scheduledTime);
  };

  const handleSkipClick = () => {
    sound.playTap();
    onSkip(medicine.id, scheduledTime);
    setShowMenu(false);
  };

  const handleSnoozeClick = () => {
    sound.playTap();
    onSnooze(medicine, scheduledTime);
    setShowMenu(false);
  };

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-200 border relative ${
        isTaken
          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60 shadow-sm'
          : isSkipped
          ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-70'
          : 'bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Med details */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {medicine.imageUrl ? (
            <button
              type="button"
              onClick={() => (onViewPhoto ? onViewPhoto(medicine) : onEditMedicine(medicine))}
              className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs relative group focus:outline-none focus:ring-2 focus:ring-sky-500"
              title="Click to view medicine photo"
            >
              <img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </button>
          ) : (
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border font-bold text-sm ${colors.bg}`}
            >
              {medicine.form === 'capsule' ? '💊' : medicine.form === 'liquid' ? '💧' : medicine.form === 'inhaler' ? '💨' : medicine.form === 'drops' ? '👁️' : '⚪'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-base font-bold truncate leading-tight ${
                  isTaken
                    ? 'text-emerald-900 dark:text-emerald-200'
                    : isSkipped
                    ? 'line-through text-slate-500 dark:text-slate-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {medicine.name}
              </h3>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                {medicine.dosage}
              </span>
            </div>

            {/* Instruction & Schedule Metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {scheduledTime}
              </span>
              <span aria-hidden="true">·</span>
              <span>{getFoodLabel(medicine.instructions)}</span>
              {medicine.notes && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate max-w-[140px] text-slate-400" title={medicine.notes}>
                    {medicine.notes}
                  </span>
                </>
              )}
            </div>

            {/* Low stock pill warning */}
            {isLowStock && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                <span>{t.lowStockLabel}: {medicine.stockTotal} {medicine.unit} {t.leftUnit}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isPending && (
            <button
              onClick={handleTakeClick}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-600 dark:hover:bg-sky-700 font-semibold text-xs transition active:scale-95 shadow-sm min-w-[76px] justify-center"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{t.take}</span>
            </button>
          )}

          {isTaken && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{t.taken}</span>
                {loggedAt && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono ml-0.5">
                    {new Date(loggedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <button
                onClick={handleUndoClick}
                title={t.undo}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isSkipped && (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                {t.skipped}
              </span>
              <button
                onClick={handleUndoClick}
                title={t.undo}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[44px] min-w-[36px] flex items-center justify-center"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 rtl:right-auto rtl:left-0 top-10 z-30 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 text-xs animate-in fade-in zoom-in-95">
                  {isPending && (
                    <>
                      <button
                        onClick={handleSnoozeClick}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.snooze15}</span>
                      </button>
                      <button
                        onClick={handleSkipClick}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.skipThisDose}</span>
                      </button>
                    </>
                  )}
                  {medicine.imageUrl && onViewPhoto && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onViewPhoto(medicine);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Camera className="w-3.5 h-3.5 text-sky-500" />
                      <span>{t.viewPhoto}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditMedicine(medicine);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>{t.editPrescription}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
