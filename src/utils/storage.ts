import { Medicine, DoseLog, UserSettings, DoseStatus } from '../types/medicine';

const STORAGE_KEYS = {
  MEDICINES: 'dosetrack_medicines_v1',
  DOSE_LOGS: 'dosetrack_dose_logs_v1',
  SETTINGS: 'dosetrack_settings_v1',
};

// Formats YYYY-MM-DD in local time
export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getTodayKey = (): string => formatDateKey(new Date());

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    dosage: '500 mg',
    form: 'tablet',
    color: 'sky',
    scheduleTimes: ['08:30', '20:00'],
    instructions: 'with_food',
    stockTotal: 48,
    stockLowAlertThreshold: 10,
    unit: 'pills',
    notes: 'Take with breakfast and dinner to minimize GI upset',
    doctorName: 'Dr. Sarah Mitchell',
    rxNumber: 'RX-884219',
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23e0f2fe'/%3E%3Cg transform='translate(100 100) rotate(-30) translate(-100 -100)'%3E%3Cellipse cx='100' cy='100' rx='70' ry='36' fill='%23ffffff' stroke='%23bae6fd' stroke-width='3' filter='drop-shadow(0 6px 8px rgba(0,0,0,0.15))'/%3E%3Cline x1='100' y1='64' x2='100' y2='136' stroke='%23cbd5e1' stroke-width='2'/%3E%3Ctext x='70' y='104' font-family='sans-serif' font-size='12' font-weight='bold' fill='%2364748b' text-anchor='middle'%3EM%3C/text%3E%3Ctext x='130' y='104' font-family='sans-serif' font-size='12' font-weight='bold' fill='%2364748b' text-anchor='middle'%3E500%3C/text%3E%3C/g%3E%3C/svg%3E",
    isActive: true,
    startDate: '2026-09-01',
    createdAt: Date.now() - 25 * 86400000,
  },
  {
    id: 'med-2',
    name: 'Lisinopril',
    dosage: '10 mg',
    form: 'tablet',
    color: 'emerald',
    scheduleTimes: ['08:30'],
    instructions: 'anytime',
    stockTotal: 22,
    stockLowAlertThreshold: 7,
    unit: 'pills',
    notes: 'Blood pressure maintenance. Take at same time each morning',
    doctorName: 'Dr. Robert Chen',
    rxNumber: 'RX-491204',
    isActive: true,
    startDate: '2026-09-01',
    createdAt: Date.now() - 25 * 86400000,
  },
  {
    id: 'med-3',
    name: 'Vitamin D3 & K2',
    dosage: '2000 IU',
    form: 'capsule',
    color: 'amber',
    scheduleTimes: ['09:00'],
    instructions: 'with_food',
    stockTotal: 65,
    stockLowAlertThreshold: 15,
    unit: 'capsules',
    notes: 'Fat soluble vitamin; best absorbed with healthy fats',
    isActive: true,
    startDate: '2026-09-05',
    createdAt: Date.now() - 20 * 86400000,
  },
  {
    id: 'med-4',
    name: 'Omega 3 Fish Oil',
    dosage: '1000 mg',
    form: 'capsule',
    color: 'teal',
    scheduleTimes: ['13:00'],
    instructions: 'with_food',
    stockTotal: 18,
    stockLowAlertThreshold: 10,
    unit: 'softgels',
    notes: 'Cardiovascular health',
    isActive: true,
    startDate: '2026-09-10',
    createdAt: Date.now() - 15 * 86400000,
  },
  {
    id: 'med-5',
    name: 'Melatonin',
    dosage: '3 mg',
    form: 'tablet',
    color: 'indigo',
    scheduleTimes: ['22:00'],
    instructions: 'before_food',
    stockTotal: 4, // Intentionally low to show low stock warning banner!
    stockLowAlertThreshold: 7,
    unit: 'tablets',
    notes: 'Take 30 minutes before sleep in a dark room',
    isActive: true,
    startDate: '2026-09-12',
    createdAt: Date.now() - 12 * 86400000,
  },
];

// Helper to seed realistic recent history
const seedInitialLogs = (): DoseLog[] => {
  const logs: DoseLog[] = [];
  const today = new Date();

  // Create logs for past 4 days
  for (let i = 4; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);

    logs.push(
      {
        id: `log-seed-${dateStr}-med-1-0830`,
        medicineId: 'med-1',
        date: dateStr,
        scheduledTime: '08:30',
        status: 'taken',
        loggedAt: new Date(`${dateStr}T08:32:00`).getTime(),
      },
      {
        id: `log-seed-${dateStr}-med-2-0830`,
        medicineId: 'med-2',
        date: dateStr,
        scheduledTime: '08:30',
        status: 'taken',
        loggedAt: new Date(`${dateStr}T08:33:00`).getTime(),
      },
      {
        id: `log-seed-${dateStr}-med-3-0900`,
        medicineId: 'med-3',
        date: dateStr,
        scheduledTime: '09:00',
        status: 'taken',
        loggedAt: new Date(`${dateStr}T09:05:00`).getTime(),
      },
      {
        id: `log-seed-${dateStr}-med-4-1300`,
        medicineId: 'med-4',
        date: dateStr,
        scheduledTime: '13:00',
        status: i === 2 ? 'skipped' : 'taken',
        loggedAt: i === 2 ? new Date(`${dateStr}T13:40:00`).getTime() : new Date(`${dateStr}T13:05:00`).getTime(),
        skippedReason: i === 2 ? 'Away from home' : undefined,
      },
      {
        id: `log-seed-${dateStr}-med-1-2000`,
        medicineId: 'med-1',
        date: dateStr,
        scheduledTime: '20:00',
        status: 'taken',
        loggedAt: new Date(`${dateStr}T20:10:00`).getTime(),
      },
      {
        id: `log-seed-${dateStr}-med-5-2200`,
        medicineId: 'med-5',
        date: dateStr,
        scheduledTime: '22:00',
        status: 'taken',
        loggedAt: new Date(`${dateStr}T22:15:00`).getTime(),
      }
    );
  }

  // Pre-log morning doses for today so today is partially complete and ready to interact
  const todayStr = formatDateKey(today);
  logs.push(
    {
      id: `log-seed-${todayStr}-med-1-0830`,
      medicineId: 'med-1',
      date: todayStr,
      scheduledTime: '08:30',
      status: 'taken',
      loggedAt: Date.now() - 2 * 3600000,
    },
    {
      id: `log-seed-${todayStr}-med-2-0830`,
      medicineId: 'med-2',
      date: todayStr,
      scheduledTime: '08:30',
      status: 'taken',
      loggedAt: Date.now() - 2 * 3600000,
    }
  );

  return logs;
};

export const getStoredMedicines = (): Medicine[] => {
  if (typeof window === 'undefined') return INITIAL_MEDICINES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    if (!raw) {
      saveStoredMedicines(INITIAL_MEDICINES);
      return INITIAL_MEDICINES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEDICINES;
  }
};

export const saveStoredMedicines = (medicines: Medicine[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  } catch (err) {
    console.error('Failed to save medicines:', err);
  }
};

export const getStoredDoseLogs = (): DoseLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
    if (!raw) {
      const seeded = seedInitialLogs();
      saveStoredDoseLogs(seeded);
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredDoseLogs = (logs: DoseLog[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save dose logs:', err);
  }
};

export const getStoredSettings = (): UserSettings => {
  const defaults: UserSettings = {
    soundEnabled: true,
    vibrationEnabled: true,
    notificationPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
    snoozeMinutes: 15,
    remindMinutesBefore: 0,
    showAndroidFrame: false, // Default to clean responsive native feel, toggleable at top
    themeMode: 'system',
    language: 'en',
  };

  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

export const saveStoredSettings = (settings: UserSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

/**
 * Calculates current consecutive streak of 100% taken scheduled doses
 */
export const calculateAdherenceStreak = (logs: DoseLog[], medicines: Medicine[]): number => {
  let streak = 0;
  const today = new Date();

  // Check backward day by day starting from yesterday
  for (let i = 1; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = formatDateKey(d);

    // Get active medicines scheduled on that day
    const dayMeds = medicines.filter(m => m.isActive && m.startDate <= dateKey);
    if (dayMeds.length === 0) continue;

    let totalScheduledDoses = 0;
    dayMeds.forEach(m => (totalScheduledDoses += m.scheduleTimes.length));

    const dayLogs = logs.filter(l => l.date === dateKey);
    const takenCount = dayLogs.filter(l => l.status === 'taken').length;
    const skippedCount = dayLogs.filter(l => l.status === 'skipped').length;

    // If day had doses and all were accounted for without unexcused misses
    if (totalScheduledDoses > 0 && takenCount >= totalScheduledDoses - skippedCount && takenCount > 0) {
      streak++;
    } else {
      break;
    }
  }

  // If today has taken doses, add 1
  const todayKey = getTodayKey();
  const todayLogs = logs.filter(l => l.date === todayKey && l.status === 'taken');
  if (todayLogs.length > 0) {
    streak++;
  }

  return streak;
};
