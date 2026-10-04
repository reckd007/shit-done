import React, { useState, useRef, useEffect } from 'react';
import { Medicine, MedicineForm, AccentColor, FoodInstruction, AppLanguage } from '../types/medicine';
import { X, Plus, Trash2, Clock, Pill, AlertCircle, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { sound } from '../utils/audio';
import { compressImageFile } from '../utils/image';
import { CameraCaptureModal } from './CameraCaptureModal';
import { getTranslation, getFoodInstructionLabel, getMedicineFormLabel } from '../utils/translations';

interface AddEditMedicineModalProps {
  isOpen: boolean;
  medicineToEdit?: Medicine | null;
  onClose: () => void;
  onSave: (medicine: Omit<Medicine, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
  language?: AppLanguage;
}

const COMMON_MEDS = [
  { name: 'Metformin', dosage: '500 mg', form: 'tablet' as const, color: 'sky' as const, inst: 'with_food' as const },
  { name: 'Lisinopril', dosage: '10 mg', form: 'tablet' as const, color: 'emerald' as const, inst: 'anytime' as const },
  { name: 'Vitamin D3', dosage: '2000 IU', form: 'capsule' as const, color: 'amber' as const, inst: 'with_food' as const },
  { name: 'Atorvastatin', dosage: '20 mg', form: 'tablet' as const, color: 'indigo' as const, inst: 'anytime' as const },
  { name: 'Amoxicillin', dosage: '500 mg', form: 'capsule' as const, color: 'rose' as const, inst: 'with_food' as const },
  { name: 'Melatonin', dosage: '3 mg', form: 'tablet' as const, color: 'indigo' as const, inst: 'before_food' as const },
];

export const AddEditMedicineModal: React.FC<AddEditMedicineModalProps> = ({
  isOpen,
  medicineToEdit,
  onClose,
  onSave,
  onDelete,
  language = 'en',
}) => {
  const t = getTranslation(language);
  const [name, setName] = useState(medicineToEdit?.name || '');
  const [dosage, setDosage] = useState(medicineToEdit?.dosage || '');
  const [form, setForm] = useState<MedicineForm>(medicineToEdit?.form || 'tablet');
  const [color, setColor] = useState<AccentColor>(medicineToEdit?.color || 'sky');
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(
    medicineToEdit?.scheduleTimes || ['08:00']
  );
  const [instructions, setInstructions] = useState<FoodInstruction>(
    medicineToEdit?.instructions || 'with_food'
  );
  const [stockTotal, setStockTotal] = useState<number>(medicineToEdit?.stockTotal ?? 30);
  const [stockLowAlertThreshold, setStockLowAlertThreshold] = useState<number>(
    medicineToEdit?.stockLowAlertThreshold ?? 7
  );
  const [unit, setUnit] = useState<string>(medicineToEdit?.unit || 'pills');
  const [notes, setNotes] = useState<string>(medicineToEdit?.notes || '');
  const [doctorName, setDoctorName] = useState<string>(medicineToEdit?.doctorName || '');
  const [imageUrl, setImageUrl] = useState<string>(medicineToEdit?.imageUrl || '');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [newTimeInput, setNewTimeInput] = useState('12:00');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when medicineToEdit changes
  useEffect(() => {
    if (medicineToEdit) {
      setName(medicineToEdit.name);
      setDosage(medicineToEdit.dosage);
      setForm(medicineToEdit.form);
      setColor(medicineToEdit.color);
      setScheduleTimes(medicineToEdit.scheduleTimes);
      setInstructions(medicineToEdit.instructions);
      setStockTotal(medicineToEdit.stockTotal);
      setStockLowAlertThreshold(medicineToEdit.stockLowAlertThreshold);
      setUnit(medicineToEdit.unit);
      setNotes(medicineToEdit.notes || '');
      setDoctorName(medicineToEdit.doctorName || '');
      setImageUrl(medicineToEdit.imageUrl || '');
    } else {
      setImageUrl('');
    }
  }, [medicineToEdit]);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      sound.playTap();
      const compressed = await compressImageFile(file);
      setImageUrl(compressed);
      setError(null);
    } catch {
      setError('Could not process selected image file.');
    }
  };

  const handleAddTime = () => {
    if (!newTimeInput) return;
    if (scheduleTimes.includes(newTimeInput)) {
      setError('This time is already scheduled');
      return;
    }
    const updated = [...scheduleTimes, newTimeInput].sort();
    setScheduleTimes(updated);
    setError(null);
  };

  const handleRemoveTime = (timeToRemove: string) => {
    if (scheduleTimes.length === 1) {
      setError('Medication requires at least one daily dose time');
      return;
    }
    setScheduleTimes(scheduleTimes.filter(t => t !== timeToRemove));
  };

  const handleQuickSelect = (item: typeof COMMON_MEDS[0]) => {
    setName(item.name);
    setDosage(item.dosage);
    setForm(item.form);
    setColor(item.color);
    setInstructions(item.inst);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a medication name');
      return;
    }
    if (!dosage.trim()) {
      setError('Please specify dosage (e.g. 500 mg or 1 pill)');
      return;
    }
    if (scheduleTimes.length === 0) {
      setError('Please add at least one scheduled time');
      return;
    }

    sound.playTap();
    onSave(
      {
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        color,
        scheduleTimes,
        instructions,
        stockTotal: Number(stockTotal) || 0,
        stockLowAlertThreshold: Number(stockLowAlertThreshold) || 5,
        unit,
        notes: notes.trim() || undefined,
        doctorName: doctorName.trim() || undefined,
        imageUrl: imageUrl ? imageUrl : undefined,
        isActive: medicineToEdit?.isActive ?? true,
        startDate: medicineToEdit?.startDate || new Date().toISOString().split('T')[0],
      },
      medicineToEdit?.id
    );
    onClose();
  };

  const colors: AccentColor[] = ['sky', 'emerald', 'amber', 'indigo', 'rose', 'teal', 'purple'];
  const forms: MedicineForm[] = ['tablet', 'capsule', 'liquid', 'drops', 'inhaler', 'injection', 'cream'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Android Grab Handle */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {medicineToEdit ? t.editPrescription : t.addMed}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick suggestions when adding */}
          {!medicineToEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                {t.quickSuggestions}
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {COMMON_MEDS.map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleQuickSelect(item)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 transition"
                  >
                    + {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.medNameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.medNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.dosageLabel}
              </label>
              <input
                type="text"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder={t.dosagePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {/* Medicine Photo Capture / Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{t.medicinePhotoLabel}</span>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] text-rose-500 hover:text-rose-600 font-medium"
                >
                  {t.removePhoto}
                </button>
              )}
            </label>

            {imageUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <img
                  src={imageUrl}
                  alt="Medicine preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {t.photoAttached}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.willBeDisplayed}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <Camera className="w-3 h-3" />
                      <span>{t.retakePhoto}</span>
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:underline"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{t.changeFile}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-800/80 bg-sky-50/60 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100/60 dark:hover:bg-sky-950/50 transition active:scale-95 text-xs font-bold"
                >
                  <Camera className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{t.takePhoto}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition active:scale-95 text-xs font-semibold"
                  title={t.uploadPhoto}
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">{t.uploadPhoto}</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Form and Color */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.formLabel}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {forms.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setForm(f)}
                    className={`py-2 px-1 rounded-xl text-xs font-medium capitalize flex flex-col items-center gap-1 border transition ${
                      form === f
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{f === 'capsule' ? '💊' : f === 'liquid' ? '💧' : f === 'inhaler' ? '💨' : f === 'drops' ? '👁️' : '⚪'}</span>
                    <span className="text-[10px]">{getMedicineFormLabel(f, language)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t.colorTagLabel}
              </label>
              <div className="flex items-center gap-3">
                {colors.map(c => {
                  const bgClass =
                    c === 'sky'
                      ? 'bg-sky-500'
                      : c === 'emerald'
                      ? 'bg-emerald-500'
                      : c === 'amber'
                      ? 'bg-amber-500'
                      : c === 'indigo'
                      ? 'bg-indigo-500'
                      : c === 'rose'
                      ? 'bg-rose-500'
                      : c === 'teal'
                      ? 'bg-teal-500'
                      : 'bg-purple-500';

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full ${bgClass} transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-900 dark:ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule Times */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.scheduledTimesLabel}
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {scheduleTimes.map(tTime => (
                <div
                  key={tTime}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold tabular-nums"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tTime}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(tTime)}
                    className="hover:text-rose-500 ml-1 p-0.5"
                    title="Remove time"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newTimeInput}
                onChange={e => setNewTimeInput(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddTime}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addDoseTime}</span>
              </button>
            </div>
          </div>

          {/* Food Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.foodInstructionsLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'with_food' as const },
                { id: 'before_food' as const },
                { id: 'after_food' as const },
                { id: 'empty_stomach' as const },
                { id: 'anytime' as const },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setInstructions(opt.id as FoodInstruction)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition ${
                    instructions === opt.id
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {getFoodInstructionLabel(opt.id, language)}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Tracking */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t.inventoryAlertsLabel}
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t.currentStock}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockTotal}
                  onChange={e => setStockTotal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold tabular-nums text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t.lowAlertAtLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockLowAlertThreshold}
                  onChange={e => setStockLowAlertThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold tabular-nums text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t.unitLabel}
                </label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                >
                  <option value="pills">pills</option>
                  <option value="tablets">tablets</option>
                  <option value="capsules">capsules</option>
                  <option value="ml">ml</option>
                  <option value="drops">drops</option>
                  <option value="puffs">puffs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes & Doctor */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.doctorNameLabel}
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Sarah Mitchell"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.notesLabel}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            {medicineToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onDelete(medicineToEdit.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.delete}</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition"
              >
                {medicineToEdit ? t.saveChanges : t.addMed}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live Camera Scanner / Photo Snap Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        language={language}
        onCapture={dataUrl => {
          setImageUrl(dataUrl);
          setError(null);
        }}
      />
    </div>
  );
};
