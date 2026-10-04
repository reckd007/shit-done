import React, { useState } from 'react';
import { Medicine, AppLanguage } from '../types/medicine';
import { Search, Plus, PackagePlus, AlertTriangle, Clock, MoreVertical, Edit2, Pause, Play, Check, Camera } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTranslation, getFoodInstructionLabel } from '../utils/translations';

interface CabinetViewProps {
  medicines: Medicine[];
  onOpenAddModal: () => void;
  onEditMedicine: (med: Medicine) => void;
  onToggleActive: (id: string) => void;
  onOpenRefillModal: (med: Medicine) => void;
  onViewPhoto?: (med: Medicine) => void;
  language?: AppLanguage;
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  medicines,
  onOpenAddModal,
  onEditMedicine,
  onToggleActive,
  onOpenRefillModal,
  onViewPhoto,
  language = 'en',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterForm, setFilterForm] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const t = getTranslation(language);

  const filteredMeds = medicines.filter(med => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.notes && med.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (med.doctorName && med.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesForm = filterForm === 'all' || med.form === filterForm;
    return matchesSearch && matchesForm;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'indigo':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'teal':
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800';
      default:
        return 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800';
    }
  };

  return (
    <div className="flex-1 pb-24 px-4 pt-3 space-y-4">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{t.cabinetTitle}</h2>
          <p className="text-xs text-slate-500">
            {medicines.length} {t.prescriptionsRegistered}
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addMed}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
        />
      </div>

      {/* Form Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['all', 'tablet', 'capsule', 'liquid', 'drops', 'inhaler'].map(f => {
          let label = t.allTypes;
          if (f === 'tablet') label = t.tablet;
          else if (f === 'capsule') label = t.capsule;
          else if (f === 'liquid') label = t.liquid;
          else if (f === 'drops') label = t.drops;
          else if (f === 'inhaler') label = t.inhaler;

          return (
            <button
              key={f}
              onClick={() => setFilterForm(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                filterForm === f
                  ? 'bg-slate-900 text-white dark:bg-sky-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Medication Cards List */}
      <div className="space-y-3">
        {filteredMeds.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.noScheduledDoses}
            </p>
          </div>
        ) : (
          filteredMeds.map(med => {
            const isLowStock = med.stockTotal <= med.stockLowAlertThreshold;
            const colorClass = getColorClasses(med.color);

            return (
              <div
                key={med.id}
                className={`rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-sm transition relative ${
                  !med.isActive ? 'opacity-60 bg-slate-50 dark:bg-slate-900/60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {med.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => (onViewPhoto ? onViewPhoto(med) : onEditMedicine(med))}
                        className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs relative group focus:outline-none focus:ring-2 focus:ring-sky-500"
                        title="Click to view photo"
                      >
                        <img
                          src={med.imageUrl}
                          alt={med.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </button>
                    ) : (
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border font-bold text-sm ${colorClass}`}
                      >
                        {med.form === 'capsule'
                          ? '💊'
                          : med.form === 'liquid'
                          ? '💧'
                          : med.form === 'inhaler'
                          ? '💨'
                          : med.form === 'drops'
                          ? '👁️'
                          : '⚪'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {med.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                          {med.dosage}
                        </span>
                        {!med.isActive && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                            Paused
                          </span>
                        )}
                      </div>

                      {/* Daily Schedule Times */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                          {med.scheduleTimes.join(', ')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{med.instructions.replace('_', ' ')}</span>
                      </div>

                      {/* Doctor & Notes */}
                      {(med.doctorName || med.notes) && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {med.doctorName && <span className="font-medium text-slate-700 dark:text-slate-300">{med.doctorName} · </span>}
                          {med.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options Menu Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === med.id ? null : med.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === med.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 text-xs animate-in fade-in">
                          {med.imageUrl && onViewPhoto && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewPhoto(med);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <Camera className="w-3.5 h-3.5 text-sky-500" />
                              <span>View Photo</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditMedicine(med);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                            <span>Edit Details</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleActive(med.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {med.isActive ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-amber-500" />
                                <span>Pause Schedule</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Resume</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Inventory Meter & Refill CTA */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Stock:</span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isLowStock
                          ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {med.stockTotal} {med.unit}
                    </span>
                    {isLowStock && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> Low
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenRefillModal(med)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition active:scale-95"
                  >
                    <PackagePlus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Refill</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
