import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryMedium } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  showFrame: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, showFrame }) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showFrame) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
        <div className="w-full max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-xl flex flex-col relative transition-colors">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 py-6 px-4 flex items-center justify-center">
      {/* Android Device Outer Bezel */}
      <div className="w-full max-w-[420px] h-[880px] bg-slate-900 dark:bg-slate-950 rounded-[48px] p-3.5 shadow-2xl shadow-slate-900/30 border-4 border-slate-700/60 relative flex flex-col overflow-hidden">
        {/* Android Punch Hole Camera */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50" />
        </div>

        {/* Android Status Bar */}
        <div className="h-7 w-full flex items-center justify-between px-6 text-slate-800 dark:text-slate-200 text-xs font-semibold select-none z-40 bg-white/95 dark:bg-slate-900/95">
          <span className="font-mono text-[11px] tabular-nums">{time}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Phone Display */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar">
          {children}
        </div>

        {/* Android Home Navigation Bar Pill */}
        <div className="h-4 w-full bg-white dark:bg-slate-900 flex items-center justify-center z-40">
          <div className="w-28 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
