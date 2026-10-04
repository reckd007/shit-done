import { useEffect, useState, useCallback, useRef } from 'react';
import { Medicine, DoseLog, ReminderNotification, UserSettings } from '../types/medicine';
import { getTodayKey } from '../utils/storage';
import { triggerSystemNotification, requestNotificationPermission, getNotificationPermission } from '../utils/notifications';

interface UseMedicineRemindersProps {
  medicines: Medicine[];
  logs: DoseLog[];
  settings: UserSettings;
  onTakeDose: (medicineId: string, time: string) => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const useMedicineReminders = ({
  medicines,
  logs,
  settings,
  onTakeDose,
  onUpdateSettings,
}: UseMedicineRemindersProps) => {
  const [activeReminders, setActiveReminders] = useState<ReminderNotification[]>([]);
  const notifiedKeysRef = useRef<Set<string>>(new Set());

  // Check doses every 30 seconds
  const checkDoses = useCallback(() => {
    const today = getTodayKey();
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    const currentMinutesOfDay = now.getHours() * 60 + now.getMinutes();

    const activeMeds = medicines.filter(m => m.isActive && m.startDate <= today);

    activeMeds.forEach(med => {
      med.scheduleTimes.forEach(schedTime => {
        const doseKey = `${today}_${med.id}_${schedTime}`;

        // Has this already been logged as taken or skipped today?
        const isLogged = logs.some(
          l => l.date === today && l.medicineId === med.id && l.scheduledTime === schedTime && l.status !== 'pending'
        );
        if (isLogged) return;

        // Convert schedTime to minutes of day
        const [sH, sM] = schedTime.split(':').map(Number);
        const schedMinutesOfDay = sH * 60 + sM;

        // Trigger if time is within [schedTime - remindMinutesBefore, schedTime + 10 mins]
        const diffMinutes = currentMinutesOfDay - schedMinutesOfDay;

        // If it's time (within last 15 minutes and not previously triggered in this session)
        if (diffMinutes >= 0 && diffMinutes <= 15 && !notifiedKeysRef.current.has(doseKey)) {
          notifiedKeysRef.current.add(doseKey);

          const reminder: ReminderNotification = {
            id: doseKey,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            time: schedTime,
            instructions: med.instructions,
            color: med.color,
            imageUrl: med.imageUrl,
            timestamp: Date.now(),
          };

          // Add to in-app banners
          setActiveReminders(prev => [reminder, ...prev.filter(r => r.id !== doseKey)]);

          // Trigger OS / Service worker notification
          const instructionLabel =
            med.instructions === 'with_food'
              ? 'Take with food'
              : med.instructions === 'before_food'
              ? 'Take before eating'
              : med.instructions === 'after_food'
              ? 'Take after meal'
              : med.instructions === 'empty_stomach'
              ? 'Take on empty stomach'
              : 'Take scheduled dose';

          triggerSystemNotification(
            {
              title: `💊 Time for ${med.name} (${med.dosage})`,
              body: `Scheduled for ${schedTime} · ${instructionLabel}`,
              tag: doseKey,
              data: { medicineId: med.id, time: schedTime },
            },
            settings.soundEnabled
          );
        }
      });
    });
  }, [medicines, logs, settings]);

  useEffect(() => {
    // Initial check
    checkDoses();
    const interval = setInterval(checkDoses, 20000); // 20-second interval
    return () => clearInterval(interval);
  }, [checkDoses]);

  const dismissReminder = useCallback((id: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const snoozeReminder = useCallback((reminder: ReminderNotification, minutes = 15) => {
    setActiveReminders(prev => prev.filter(r => r.id !== reminder.id));
    setTimeout(() => {
      // Re-trigger after snooze
      setActiveReminders(prev => [reminder, ...prev.filter(r => r.id !== reminder.id)]);
      triggerSystemNotification(
        {
          title: `⏰ Snoozed Reminder: ${reminder.medicineName} (${reminder.dosage})`,
          body: `Time to take your scheduled dose now.`,
          tag: `${reminder.id}_snooze`,
        },
        settings.soundEnabled
      );
    }, minutes * 60 * 1000);
  }, [settings.soundEnabled]);

  const takeFromReminder = useCallback(
    (reminder: ReminderNotification) => {
      onTakeDose(reminder.medicineId, reminder.time);
      dismissReminder(reminder.id);
    },
    [onTakeDose, dismissReminder]
  );

  const testNotification = useCallback(
    async (med?: Medicine) => {
      const targetMed = med || medicines[0] || {
        id: 'test',
        name: 'Daily Vitamin',
        dosage: '1 tablet',
        color: 'sky' as const,
        instructions: 'with_food' as const,
        scheduleTimes: ['12:00'],
      };

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const fakeReminder: ReminderNotification = {
        id: `test_${Date.now()}`,
        medicineId: targetMed.id,
        medicineName: targetMed.name,
        dosage: targetMed.dosage,
        time: timeStr,
        instructions: targetMed.instructions,
        color: targetMed.color,
        timestamp: Date.now(),
      };

      setActiveReminders(prev => [fakeReminder, ...prev]);

      await triggerSystemNotification(
        {
          title: `🔔 Test Reminder: ${targetMed.name} (${targetMed.dosage})`,
          body: `Notification is working! Reminder chime and vibration sent.`,
          tag: 'test-reminder',
        },
        settings.soundEnabled
      );
    },
    [medicines, settings.soundEnabled]
  );

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    onUpdateSettings({ notificationPermission: result });
    return result;
  }, [onUpdateSettings]);

  return {
    activeReminders,
    dismissReminder,
    snoozeReminder,
    takeFromReminder,
    testNotification,
    requestPermission,
    permission: getNotificationPermission(),
  };
};
