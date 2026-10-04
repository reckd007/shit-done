import React, { useState } from 'react';
import { Medicine, AppLanguage } from '../types/medicine';
import { X, PackagePlus } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTranslation } from '../utils/translations';

interface RefillModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  onRefill: (medicineId: string, addedCount: number) => void;
  language?: AppLanguage;
}

export const RefillModal: React.FC<RefillModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onRefill,
  language = 'en',
}) => {
  const [refillAmount, setRefillAmount] = useState<number>(30);
  const t = getTranslation(language);

  if (!isOpen || !medicine) return null;

  const handleRefill = (e: React.FormEvent) => {
    e.preventDefault();
    if (refillAmount <= 0) return;
    sound.playTap();
    onRefill(medicine.id, refillAmount);
    onClose();
  };

  const quickAdds = [15, 30, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.refillStock}</h3>
              <p className="text-xs text-slate-500">{medicine.name} ({medicine.dosage})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleRefill} className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.currentStock}</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {medicine.stockTotal} <span className="text-xs font-normal text-slate-500">{medicine.unit}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.addQuantity} ({medicine.unit})
            </label>
            <input
              type="number"
              min="1"
              value={refillAmount}
              onChange={e => setRefillAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-lg font-bold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickAdds.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setRefillAmount(amt)}
                className={`py-2 rounded-xl text-xs font-semibold border transition ${
                  refillAmount === amt
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                +{amt}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition"
            >
              {t.updateStock} ({medicine.stockTotal + refillAmount})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
