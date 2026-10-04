import { sound } from './audio';

/**
 * Handles Web Notifications API, vibration, and permission requests.
 */

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
};

export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
}

export const triggerSystemNotification = async (payload: NotificationPayload, playAudio = true) => {
  if (playAudio) {
    sound.playReminderChime();
  }

  // Trigger vibration if supported on Android device
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 300]);
    } catch {
      // Ignore vibration error
    }
  }

  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    // If Service Worker registration exists, use showNotification (optimal on Android Chrome / PWA)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/pwa-192x192.png',
          badge: '/icon.svg',
          tag: payload.tag || 'dose-reminder',
          data: payload.data,
          requireInteraction: payload.requireInteraction ?? true,
        });
        return true;
      }
    }

    // Direct Notification fallback
    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/pwa-192x192.png',
      tag: payload.tag || 'dose-reminder',
    });
    return true;
  } catch (err) {
    console.warn('System notification error, falling back to in-app alert:', err);
    return false;
  }
};
