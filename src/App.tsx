/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Medicine, DoseLog, UserSettings, AppLanguage } from './types/medicine';
import {
  getStoredMedicines,
  saveStoredMedicines,
  getStoredDoseLogs,
  saveStoredDoseLogs,
  getStoredSettings,
  saveStoredSettings,
  getTodayKey,
  calculateAdherenceStreak,
} from './utils/storage';
import { useMedicineReminders } from './hooks/useMedicineReminders';
import { useTheme } from './hooks/useTheme';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NotificationPromptBanner } from './components/NotificationPromptBanner';
import { AddEditMedicineModal } from './components/AddEditMedicineModal';
import { RefillModal } from './components/RefillModal';
import { ExportModal } from './components/ExportModal';
import { MedicinePhotoModal } from './components/MedicinePhotoModal';
import { TodayView } from './views/TodayView';
import { CabinetView } from './views/CabinetView';
import { RemindersView } from './views/RemindersView';
import { InsightsView } from './views/InsightsView';

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>(() => getStoredMedicines());
  const [logs, setLogs] = useState<DoseLog[]>(() => getStoredDoseLogs());
  const [settings, setSettings] = useState<UserSettings>(() => getStoredSettings());
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayKey());

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<Medicine | null>(null);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [refillTargetMed, setRefillTargetMed] = useState<Medicine | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [viewingPhotoMed, setViewingPhotoMed] = useState<Medicine | null>(null);

  // Sync state to local storage
  useEffect(() => {
    saveStoredMedicines(medicines);
  }, [medicines]);

  useEffect(() => {
    saveStoredDoseLogs(logs);
  }, [logs]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Action: Take dose
  const handleTakeDose = useCallback((medicineId: string, time: string) => {
    const today = getTodayKey();
    const doseLogId = `log-${today}-${medicineId}-${time.replace(':', '')}`;

    setLogs(prev => {
      const existing = prev.find(l => l.date === today && l.medicineId === medicineId && l.scheduledTime === time);
      if (existing) {
        return prev.map(l =>
          l.id === existing.id
            ? { ...l, status: 'taken' as const, loggedAt: Date.now() }
            : l
        );
      }
      return [
        ...prev,
        {
          id: doseLogId,
          medicineId,
          date: today,
          scheduledTime: time,
          status: 'taken' as const,
          loggedAt: Date.now(),
        },
      ];
    });

    // Decrement stock by 1
    setMedicines(prev =>
      prev.map(m => (m.id === medicineId ? { ...m, stockTotal: Math.max(0, m.stockTotal - 1) } : m))
    );
  }, []);

  // Action: Undo dose status
  const handleUndoDose = useCallback((medicineId: string, time: string) => {
    const today = getTodayKey();

    setLogs(prev => {
      const existing = prev.find(l => l.date === today && l.medicineId === medicineId && l.scheduledTime === time);
      if (existing && existing.status === 'taken') {
        // Restore stock by 1
        setMedicines(meds =>
          meds.map(m => (m.id === medicineId ? { ...m, stockTotal: m.stockTotal + 1 } : m))
        );
      }
      return prev.filter(l => !(l.date === today && l.medicineId === medicineId && l.scheduledTime === time));
    });
  }, []);

  // Action: Skip dose
  const handleSkipDose = useCallback((medicineId: string, time: string, reason?: string) => {
    const today = getTodayKey();
    const doseLogId = `log-skip-${today}-${medicineId}-${time.replace(':', '')}`;

    setLogs(prev => {
      const filtered = prev.filter(
        l => !(l.date === today && l.medicineId === medicineId && l.scheduledTime === time)
      );
      return [
        ...filtered,
        {
          id: doseLogId,
          medicineId,
          date: today,
          scheduledTime: time,
          status: 'skipped' as const,
          loggedAt: Date.now(),
          skippedReason: reason,
        },
      ];
    });
  }, []);

  // Action: Add / Update medicine
  const handleSaveMedicine = useCallback((medData: Omit<Medicine, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      setMedicines(prev =>
        prev.map(m =>
          m.id === existingId
            ? { ...m, ...medData }
            : m
        )
      );
    } else {
      const newMed: Medicine = {
        ...medData,
        id: `med-${Date.now()}`,
        createdAt: Date.now(),
      };
      setMedicines(prev => [newMed, ...prev]);
    }
  }, []);

  // Action: Delete medicine
  const handleDeleteMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  }, []);

  // Action: Toggle medicine active/pause
  const handleToggleActive = useCallback((id: string) => {
    setMedicines(prev =>
      prev.map(m => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  }, []);

  // Action: Refill medicine stock
  const handleRefillStock = useCallback((medicineId: string, addedCount: number) => {
    setMedicines(prev =>
      prev.map(m => (m.id === medicineId ? { ...m, stockTotal: m.stockTotal + addedCount } : m))
    );
  }, []);

  // Action: Update settings
  const handleUpdateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Reminder watcher hook
  const {
    activeReminders,
    dismissReminder,
    snoozeReminder,
    takeFromReminder,
    testNotification,
    requestPermission,
  } = useMedicineReminders({
    medicines,
    logs,
    settings,
    onTakeDose: handleTakeDose,
    onUpdateSettings: handleUpdateSettings,
  });

  const handleSnoozeDose = useCallback(
    (med: Medicine, time: string) => {
      snoozeReminder(
        {
          id: `manual_snooze_${Date.now()}`,
          medicineId: med.id,
          medicineName: med.name,
          dosage: med.dosage,
          time,
          instructions: med.instructions,
          color: med.color,
          timestamp: Date.now(),
        },
        settings.snoozeMinutes
      );
    },
    [snoozeReminder, settings.snoozeMinutes]
  );

  // Computations for headers & badges
  const streak = calculateAdherenceStreak(logs, medicines);
  const todayKey = getTodayKey();

  const todayActiveMeds = medicines.filter(m => m.isActive && m.startDate <= todayKey);
  let todayTotalDoses = 0;
  todayActiveMeds.forEach(m => (todayTotalDoses += m.scheduleTimes.length));
  const todayTaken = logs.filter(l => l.date === todayKey && l.status === 'taken').length;
  const todaySkipped = logs.filter(l => l.date === todayKey && l.status === 'skipped').length;
  const pendingDoseCount = Math.max(0, todayTotalDoses - todayTaken - todaySkipped);

  const lowStockCount = medicines.filter(
    m => m.isActive && m.stockTotal <= m.stockLowAlertThreshold
  ).length;

  // Theme hook: automatically tracks OS preference when themeMode is 'system'
  const { isDark, systemPrefersDark, themeMode, cycleTheme } = useTheme(
    settings.themeMode || 'system',
    mode => handleUpdateSettings({ themeMode: mode })
  );

  const cycleLanguage = useCallback(() => {
    const langs: AppLanguage[] = ['en', 'hi', 'ur'];
    const current = settings.language || 'en';
    const nextIdx = (langs.indexOf(current) + 1) % langs.length;
    handleUpdateSettings({ language: langs[nextIdx] });
  }, [settings.language, handleUpdateSettings]);

  return (
    <AndroidFrame showFrame={settings.showAndroidFrame}>
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Floating System / In-App Notification Alerts */}
      <NotificationPromptBanner
        reminders={activeReminders}
        onTake={takeFromReminder}
        onSnooze={snoozeReminder}
        onDismiss={dismissReminder}
      />

      {/* Top Application Bar */}
      <TopAppBar
        streak={streak}
        notificationsEnabled={settings.notificationPermission === 'granted'}
        onOpenNotifications={() => setCurrentTab('reminders')}
        showAndroidFrame={settings.showAndroidFrame}
        onToggleFrame={() =>
          handleUpdateSettings({ showAndroidFrame: !settings.showAndroidFrame })
        }
        themeMode={themeMode}
        isDark={isDark}
        onCycleTheme={cycleTheme}
        language={settings.language || 'en'}
        onCycleLanguage={cycleLanguage}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {currentTab === 'today' && (
          <TodayView
            medicines={medicines}
            logs={logs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onTakeDose={handleTakeDose}
            onUndoDose={handleUndoDose}
            onSkipDose={handleSkipDose}
            onSnoozeDose={handleSnoozeDose}
            onOpenAddModal={() => {
              setMedicineToEdit(null);
              setAddModalOpen(true);
            }}
            onEditMedicine={med => {
              setMedicineToEdit(med);
              setAddModalOpen(true);
            }}
            onOpenRefillModal={med => {
              setRefillTargetMed(med);
              setRefillModalOpen(true);
            }}
            onViewPhoto={med => setViewingPhotoMed(med)}
          />
        )}

        {currentTab === 'cabinet' && (
          <CabinetView
            medicines={medicines}
            onOpenAddModal={() => {
              setMedicineToEdit(null);
              setAddModalOpen(true);
            }}
            onEditMedicine={med => {
              setMedicineToEdit(med);
              setAddModalOpen(true);
            }}
            onToggleActive={handleToggleActive}
            onOpenRefillModal={med => {
              setRefillTargetMed(med);
              setRefillModalOpen(true);
            }}
            onViewPhoto={med => setViewingPhotoMed(med)}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersView
            medicines={medicines}
            settings={settings}
            isDark={isDark}
            systemPrefersDark={systemPrefersDark}
            onUpdateSettings={handleUpdateSettings}
            onRequestPermission={requestPermission}
            onTestNotification={testNotification}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsView
            medicines={medicines}
            logs={logs}
            onOpenExportModal={() => setExportModalOpen(true)}
            onSelectDate={date => {
              setSelectedDate(date);
              setCurrentTab('today');
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        pendingDoseCount={pendingDoseCount}
        lowStockCount={lowStockCount}
      />

      {/* Modals & Bottom Sheets */}
      <AddEditMedicineModal
        isOpen={addModalOpen}
        medicineToEdit={medicineToEdit}
        onClose={() => {
          setAddModalOpen(false);
          setMedicineToEdit(null);
        }}
        onSave={handleSaveMedicine}
        onDelete={handleDeleteMedicine}
      />

      <RefillModal
        isOpen={refillModalOpen}
        medicine={refillTargetMed}
        onClose={() => {
          setRefillModalOpen(false);
          setRefillTargetMed(null);
        }}
        onRefill={handleRefillStock}
      />

      <ExportModal
        isOpen={exportModalOpen}
        medicines={medicines}
        logs={logs}
        onClose={() => setExportModalOpen(false)}
      />

      {/* Full Medicine Photo Inspection Lightbox */}
      <MedicinePhotoModal
        isOpen={!!viewingPhotoMed}
        medicine={viewingPhotoMed}
        onClose={() => setViewingPhotoMed(null)}
        onEdit={med => {
          setMedicineToEdit(med);
          setAddModalOpen(true);
        }}
      />
    </AndroidFrame>
  );
}
