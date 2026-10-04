export type MedicineForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'drops' | 'cream' | 'powder';

export type FoodInstruction = 'with_food' | 'before_food' | 'after_food' | 'empty_stomach' | 'anytime';

export type AccentColor = 'sky' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'purple' | 'teal';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  form: MedicineForm;
  color: AccentColor;
  scheduleTimes: string[]; // ['08:00', '20:00'] in 24h format
  instructions: FoodInstruction;
  stockTotal: number;
  stockLowAlertThreshold: number;
  unit: string; // 'pills', 'ml', 'drops', 'puffs'
  notes?: string;
  doctorName?: string;
  rxNumber?: string;
  imageUrl?: string; // Captured photo or uploaded image of the pill/bottle
  isActive: boolean;
  startDate: string; // YYYY-MM-DD
  createdAt: number;
}

export type DoseStatus = 'taken' | 'skipped' | 'pending';

export interface DoseLog {
  id: string;
  medicineId: string;
  date: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: DoseStatus;
  loggedAt?: number;
  notes?: string;
  skippedReason?: string;
}

export interface ScheduledDoseItem {
  id: string; // generated dose key: `${medicineId}_${date}_${scheduledTime}`
  medicine: Medicine;
  date: string;
  scheduledTime: string;
  status: DoseStatus;
  loggedAt?: number;
  timeWindow: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface ReminderNotification {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  time: string;
  instructions: FoodInstruction;
  color: AccentColor;
  imageUrl?: string;
  timestamp: number;
}

export type ThemeMode = 'system' | 'light' | 'dark';
export type AppLanguage = 'en' | 'hi' | 'ur';

export interface UserSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationPermission: NotificationPermission;
  snoozeMinutes: number;
  remindMinutesBefore: number;
  showAndroidFrame: boolean;
  themeMode: ThemeMode;
  language: AppLanguage;
}
