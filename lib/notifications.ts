// Notification system for Bible Reading Plan

export interface NotificationSettings {
  enabled: boolean;
  dailyReminderTime: string; // Format: "HH:MM" (24-hour)
  streakReminders: boolean;
  missedDayReminders: boolean;
}

const STORAGE_KEY = 'bible-reading-notifications';

// Get notification settings
export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Failed to load notification settings:', error);
    return getDefaultSettings();
  }
}

// Save notification settings
export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
}

// Default settings
function getDefaultSettings(): NotificationSettings {
  return {
    enabled: false,
    dailyReminderTime: '09:00',
    streakReminders: true,
    missedDayReminders: true,
  };
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Check if notifications are supported and permitted
export function canShowNotifications(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  return Notification.permission === 'granted';
}

// Show a notification
export function showNotification(title: string, options?: NotificationOptions): void {
  if (!canShowNotifications()) {
    console.warn('Cannot show notification: permission not granted');
    return;
  }

  try {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Schedule daily reminder (using browser APIs)
export function scheduleDailyReminder(time: string): void {
  // Note: This is a simplified version. In a production app, you'd want to use
  // service workers and the Push API for more reliable notifications

  const settings = getNotificationSettings();
  if (!settings.enabled || !canShowNotifications()) {
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    showNotification('Time for Today\'s Reading!', {
      body: 'Don\'t forget to complete your Bible reading for today.',
      tag: 'daily-reminder',
    });

    // Schedule the next reminder (24 hours later)
    scheduleDailyReminder(time);
  }, delay);
}

// Send streak milestone notification
export function notifyStreakMilestone(streak: number): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.streakReminders || !canShowNotifications()) {
    return;
  }

  const milestones = [7, 14, 30, 60, 90, 180, 365];
  if (milestones.includes(streak)) {
    showNotification('Streak Milestone Achieved!', {
      body: `Congratulations! You've maintained a ${streak}-day reading streak!`,
      tag: 'streak-milestone',
    });
  }
}

// Send missed day reminder
export function notifyMissedDay(): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.missedDayReminders || !canShowNotifications()) {
    return;
  }

  showNotification('You Haven\'t Read Today', {
    body: 'Don\'t break your streak! Take a few minutes to complete today\'s reading.',
    tag: 'missed-day',
  });
}

// Initialize notifications (call this on app load)
export function initializeNotifications(): void {
  const settings = getNotificationSettings();

  if (settings.enabled) {
    requestNotificationPermission().then((granted) => {
      if (granted && settings.dailyReminderTime) {
        scheduleDailyReminder(settings.dailyReminderTime);
      }
    });
  }
}
