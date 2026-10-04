import React from 'react';
import { ReminderNotification } from '../types/medicine';
import { Pill, Check, Clock, X, Bell } from 'lucide-react';

interface NotificationPromptBannerProps {
  reminders: ReminderNotification[];
  onTake: (reminder: ReminderNotification) => void;
  onSnooze: (reminder: ReminderNotification, minutes: number) => void;
  onDismiss: (id: string) => void;
}

export const NotificationPromptBanner: React.FC<NotificationPromptBannerProps> = ({
  reminders,
  onTake,
  onSnooze,
  onDismiss,
}) => {
  if (reminders.length === 0) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 px-3 max-w-md mx-auto space-y-2 pointer-events-none">
      {reminders.map(rem => (
        <div
          key={rem.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {rem.imageUrl ? (
                <img
                  src={rem.imageUrl}
                  alt={rem.medicineName}
                  className="w-10 h-10 rounded-xl object-cover border border-sky-400/40 shadow-xs flex-shrink-0 mt-0.5"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Pill className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <Bell className="w-3 h-3" /> Dose Due Now
                  </span>
                  <span className="text-slate-400 text-xs">· {rem.time}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {rem.medicineName} <span className="font-normal text-slate-300">({rem.dosage})</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 capitalize">
                  {rem.instructions.replace('_', ' ')}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(rem.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => onTake(rem)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition active:scale-95 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark as Taken</span>
            </button>
            <button
              onClick={() => onSnooze(rem, 15)}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition active:scale-95 border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Snooze 15m</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
