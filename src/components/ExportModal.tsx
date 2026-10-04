import React, { useState } from 'react';
import { Medicine, DoseLog, AppLanguage } from '../types/medicine';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface ExportModalProps {
  isOpen: boolean;
  medicines: Medicine[];
  logs: DoseLog[];
  onClose: () => void;
  language?: AppLanguage;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  medicines,
  logs,
  onClose,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);
  const t = getTranslation(language);

  if (!isOpen) return null;

  const generateReportText = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let text = `========================================\n`;
    text += `DOSETRACK - PATIENT MEDICATION REPORT\n`;
    text += `Generated on: ${today}\n`;
    text += `========================================\n\n`;

    text += `CURRENT ACTIVE MEDICATIONS (${medicines.length}):\n`;
    text += `----------------------------------------\n`;
    medicines.forEach((m, idx) => {
      text += `${idx + 1}. ${m.name} - ${m.dosage}\n`;
      text += `   Form: ${m.form.toUpperCase()} | Times: ${m.scheduleTimes.join(', ')}\n`;
      text += `   Instructions: ${m.instructions.replace('_', ' ')}\n`;
      text += `   Current Stock: ${m.stockTotal} ${m.unit}\n`;
      if (m.doctorName) text += `   Prescriber: ${m.doctorName}\n`;
      if (m.notes) text += `   Notes: ${m.notes}\n`;
      text += `\n`;
    });

    // Recent 7 days adherence
    text += `RECENT 7-DAY INTAKE ADHERENCE:\n`;
    text += `----------------------------------------\n`;
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      last7Days.push(`${y}-${m}-${day}`);
    }

    last7Days.forEach(dateStr => {
      const dayLogs = logs.filter(l => l.date === dateStr);
      const taken = dayLogs.filter(l => l.status === 'taken').length;
      const skipped = dayLogs.filter(l => l.status === 'skipped').length;
      text += `${dateStr}: ${taken} Taken, ${skipped} Skipped\n`;
    });

    return text;
  };

  const reportText = generateReportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.patientReport}</h3>
              <p className="text-xs text-slate-500">{t.reportSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {reportText}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printReport}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-600 dark:hover:bg-sky-700 text-xs font-bold transition shadow-sm active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.copiedToClipboard : t.copyText}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
