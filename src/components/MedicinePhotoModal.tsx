import React from 'react';
import { Medicine, AppLanguage } from '../types/medicine';
import { X, Pill, Clock, Edit2 } from 'lucide-react';
import { getTranslation, getFoodInstructionLabel } from '../utils/translations';

interface MedicinePhotoModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  onEdit?: (medicine: Medicine) => void;
  language?: AppLanguage;
}

export const MedicinePhotoModal: React.FC<MedicinePhotoModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onEdit,
  language = 'en',
}) => {
  if (!isOpen || !medicine) return null;
  const t = getTranslation(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {medicine.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{medicine.dosage}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo Display */}
        <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
          {medicine.imageUrl ? (
            <img
              src={medicine.imageUrl}
              alt={medicine.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">{t.noPhotoAvailable}</p>
            </div>
          )}
        </div>

        {/* Details & Metadata */}
        <div className="p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>{t.scheduleTimes}:</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              {medicine.scheduleTimes.join(', ')}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>{t.instructionsLabel}:</span>
            <span className="font-semibold text-slate-900 dark:text-white capitalize">
              {getFoodInstructionLabel(medicine.instructions, language)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>{t.currentStock}:</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
              {medicine.stockTotal} {medicine.unit}
            </span>
          </div>
          {medicine.notes && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t.doctorNotes}:</span> {medicine.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {t.close}
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(medicine);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.editRetakePhoto}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
