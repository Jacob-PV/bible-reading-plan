'use client';

import { useEffect, useState } from 'react';
import { loadProgress, saveProgress, createDefaultProgress } from '@/lib/storage';
import { getAllPlans, getReadingByDay } from '@/lib/readingPlans';
import { calculateCurrentDay, hasReadToday, shouldIncrementStreak } from '@/lib/dateUtils';
import { Progress, Reading, ReadingPlan } from '@/types';
import TodayReading from '@/components/TodayReading';
import ProgressStreak from '@/components/ProgressStreak';
import PlanSelector from '@/components/PlanSelector';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';
import { canShowNotifications, getNotificationSettings } from '@/lib/notifications';

export default function Home() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null);
  const [todaysReading, setTodaysReading] = useState<Reading | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = loadProgress();

    if (savedProgress) {
      setProgress(savedProgress);
      setShowPlanSelector(false); // Explicitly hide selector when plan exists

      // Load current plan
      const plans = getAllPlans();
      const plan = plans.find(p => p.id === savedProgress.currentPlanId);

      if (plan) {
        setCurrentPlan(plan);

        // Calculate current day and get today's reading
        const currentDay = calculateCurrentDay(savedProgress.startDate);
        const reading = getReadingByDay(plan, currentDay);
        setTodaysReading(reading);
      }
    } else {
      // No progress saved - show plan selector
      setShowPlanSelector(true);
    }

    // Check if we should show notification banner
    const notificationSettings = getNotificationSettings();
    const hasNotifications = canShowNotifications();
    const bannerDismissed = localStorage.getItem('notificationBannerDismissed');

    if (!notificationSettings.enabled && !hasNotifications && !bannerDismissed) {
      setShowNotificationBanner(true);
    }
  }, []);

  const handleDismissNotificationBanner = () => {
    setShowNotificationBanner(false);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  const handleSelectPlan = (planId: string) => {
    const newProgress = createDefaultProgress(planId);
    saveProgress(newProgress);
    setProgress(newProgress);

    const plans = getAllPlans();
    const plan = plans.find(p => p.id === planId);

    if (plan) {
      setCurrentPlan(plan);
      const reading = getReadingByDay(plan, 1);
      setTodaysReading(reading);
    }

    setShowPlanSelector(false);
  };

  const handleCompleteReading = (readingId: string) => {
    if (!progress || !currentPlan) return;

    const now = new Date().toISOString();
    const newCompletedReadings = [...progress.completedReadings, readingId];
    const newCompletedDates = [...progress.completedDates, now];

    // Only increment streak if it's a new calendar day
    const incrementStreak = shouldIncrementStreak(progress.completedDates, progress.lastReadingDate);
    const newStreak = incrementStreak ? progress.currentStreak + 1 : progress.currentStreak;
    const newLongestStreak = Math.max(newStreak, progress.longestStreak);

    const updatedProgress: Progress = {
      ...progress,
      completedReadings: newCompletedReadings,
      completedDates: newCompletedDates,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastReadingDate: now,
      totalReadings: progress.totalReadings + 1,
    };

    saveProgress(updatedProgress);
    setProgress(updatedProgress);
  };

  const handleCompleteAndContinue = () => {
    if (!progress || !currentPlan || !todaysReading) return;

    // Complete current reading if not already completed
    if (!progress.completedReadings.includes(todaysReading.id)) {
      handleCompleteReading(todaysReading.id);
    }

    // Move to next day
    const currentDay = calculateCurrentDay(progress.startDate);
    const nextDay = currentDay + 1;

    if (nextDay <= currentPlan.totalDays) {
      // Advance start date by one day to simulate skipping ahead
      const newStartDate = new Date(progress.startDate);
      newStartDate.setDate(newStartDate.getDate() - 1);

      const updatedProgress: Progress = {
        ...progress,
        startDate: newStartDate.toISOString(),
      };

      saveProgress(updatedProgress);
      setProgress(updatedProgress);

      // Load next reading
      const nextReading = getReadingByDay(currentPlan, nextDay);
      setTodaysReading(nextReading);
    }
  };

  if (showPlanSelector) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-deepEarth">
            Welcome to Your Bible Reading Journey
          </h1>
          <p className="text-xl text-stoneGray max-w-2xl mx-auto">
            Choose a reading plan to begin building a consistent daily habit
          </p>
        </div>
        <PlanSelector onSelectPlan={handleSelectPlan} />
      </div>
    );
  }

  if (!progress || !currentPlan || !todaysReading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-stoneGray text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification Prompt Banner */}
      {showNotificationBanner && (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 fade-in-up flex items-start gap-4">
          <Bell className="text-primary-600 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-neutral-900 mb-1">Stay on Track with Reminders</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Enable notifications to receive daily reading reminders and never miss a day.
            </p>
            <Link href="/settings" className="inline-block btn-primary text-sm px-6 py-2">
              Enable Notifications
            </Link>
          </div>
          <button
            onClick={handleDismissNotificationBanner}
            className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
            aria-label="Dismiss notification banner"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="fade-in-up">
        <ProgressStreak
          currentStreak={progress.currentStreak}
          longestStreak={progress.longestStreak}
          totalReadings={progress.totalReadings}
        />
      </div>

      <div className="fade-in-up-delay-1">
        <TodayReading
          reading={todaysReading}
          isCompleted={progress.completedReadings.includes(todaysReading.id)}
          onComplete={() => handleCompleteReading(todaysReading.id)}
          onCompleteAndContinue={handleCompleteAndContinue}
          currentDay={calculateCurrentDay(progress.startDate)}
          totalDays={currentPlan.totalDays}
          hasReadToday={hasReadToday(progress.completedDates)}
        />
      </div>

      <div className="fade-in-up-delay-2 text-center text-neutral-500">
        <p className="text-sm">
          Reading plan: {currentPlan.name} • Day {calculateCurrentDay(progress.startDate)} of {currentPlan.totalDays}
        </p>
      </div>
    </div>
  );
}
