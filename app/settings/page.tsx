'use client';

import { useState, useEffect } from 'react';
import { clearAllData, exportData } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Download, Trash2, Bell, Clock } from 'lucide-react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  canShowNotifications,
  NotificationSettings,
} from '@/lib/notifications';

export default function SettingsPage() {
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    const settings = getNotificationSettings();
    setNotificationSettings(settings);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted && notificationSettings) {
      const updatedSettings = { ...notificationSettings, enabled: true };
      saveNotificationSettings(updatedSettings);
      setNotificationSettings(updatedSettings);
      setPermissionStatus('granted');
    } else if (!granted) {
      setPermissionStatus('denied');
    }
  };

  const handleToggleNotifications = (enabled: boolean) => {
    if (notificationSettings) {
      const updatedSettings = { ...notificationSettings, enabled };
      saveNotificationSettings(updatedSettings);
      setNotificationSettings(updatedSettings);
    }
  };

  const handleUpdateTime = (time: string) => {
    if (notificationSettings) {
      const updatedSettings = { ...notificationSettings, dailyReminderTime: time };
      saveNotificationSettings(updatedSettings);
      setNotificationSettings(updatedSettings);
    }
  };

  const handleToggleStreakReminders = (enabled: boolean) => {
    if (notificationSettings) {
      const updatedSettings = { ...notificationSettings, streakReminders: enabled };
      saveNotificationSettings(updatedSettings);
      setNotificationSettings(updatedSettings);
    }
  };

  const handleToggleMissedDayReminders = (enabled: boolean) => {
    if (notificationSettings) {
      const updatedSettings = { ...notificationSettings, missedDayReminders: enabled };
      saveNotificationSettings(updatedSettings);
      setNotificationSettings(updatedSettings);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-reading-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      clearAllData();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-deepEarth">
          Settings
        </h1>
        <p className="text-lg text-stoneGray">
          Manage your reading plan preferences and data
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 fade-in-up-delay-1">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="text-primary-600" size={28} />
            <h2 className="text-2xl font-bold text-neutral-900">Notifications</h2>
          </div>
          <p className="text-neutral-500 mb-6">
            Get reminders to maintain your reading streak
          </p>

          {permissionStatus === 'denied' && (
            <div className="mb-4 p-4 bg-accent-50 border border-accent-200 rounded-lg">
              <p className="text-sm text-accent-700">
                Notifications are blocked. Please enable them in your browser settings to receive reminders.
              </p>
            </div>
          )}

          {notificationSettings && (
            <div className="space-y-4">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="font-semibold text-neutral-900">Enable Notifications</div>
                  <div className="text-sm text-neutral-500">Receive daily reminders and milestone alerts</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.enabled}
                    onChange={(e) => {
                      if (e.target.checked && permissionStatus !== 'granted') {
                        handleEnableNotifications();
                      } else {
                        handleToggleNotifications(e.target.checked);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Daily Reminder Time */}
              {notificationSettings.enabled && (
                <>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="text-primary-600" size={20} />
                      <div>
                        <div className="font-semibold text-neutral-900">Daily Reminder Time</div>
                        <div className="text-sm text-neutral-500">When to receive your daily reading reminder</div>
                      </div>
                    </div>
                    <input
                      type="time"
                      value={notificationSettings.dailyReminderTime}
                      onChange={(e) => handleUpdateTime(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Streak Milestone Alerts */}
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-neutral-900">Streak Milestone Alerts</div>
                      <div className="text-sm text-neutral-500">Celebrate when you reach reading milestones</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.streakReminders}
                        onChange={(e) => handleToggleStreakReminders(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {/* Missed Day Reminders */}
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-neutral-900">Missed Day Reminders</div>
                      <div className="text-sm text-neutral-500">Get notified if you haven't read today</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.missedDayReminders}
                        onChange={(e) => handleToggleMissedDayReminders(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-8 fade-in-up-delay-2">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Data Management</h2>
          <p className="text-neutral-500 mb-6">
            Export your progress or reset all data
          </p>

          <div className="space-y-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-3 w-full px-6 py-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Download className="text-primary-600" size={24} />
              <div className="text-left">
                <div className="font-semibold text-neutral-900">Export Progress</div>
                <div className="text-sm text-neutral-500">Download your reading data as JSON</div>
              </div>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-3 w-full px-6 py-4 bg-softBurgundy/10 border border-softBurgundy/20 rounded-lg hover:bg-softBurgundy/15 transition-colors"
            >
              <Trash2 className="text-softBurgundy" size={24} />
              <div className="text-left">
                <div className="font-semibold text-neutral-900">Reset All Data</div>
                <div className="text-sm text-neutral-500">Clear all progress and start fresh</div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-8 fade-in-up-delay-3">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">About</h2>
          <p className="text-neutral-500 mb-4">
            Bible Reading Plan & Study Tracker helps you build consistent daily Bible reading habits through structured plans and progress tracking.
          </p>
          <p className="text-sm text-neutral-500">
            Version 1.0.0 • All data is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
