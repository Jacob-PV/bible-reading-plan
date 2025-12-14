'use client';

import { useEffect, useState } from 'react';
import { loadProgress, saveProgress, createDefaultProgress, getCurrentPlanProgress } from '@/lib/storage';
import { getAllPlans, getReadingByDay } from '@/lib/readingPlans';
import { calculateCurrentDay, hasReadToday, shouldIncrementStreak } from '@/lib/dateUtils';
import { MultiPlanProgress, PlanProgress, Reading, ReadingPlan } from '@/types';
import TodayReading from '@/components/TodayReading';
import ProgressStreak from '@/components/ProgressStreak';
import PlanSelector from '@/components/PlanSelector';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';
import { canShowNotifications, getNotificationSettings } from '@/lib/notifications';

export default function Home() {
  const [progress, setProgress] = useState<MultiPlanProgress | null>(null);
  const [currentPlanData, setCurrentPlanData] = useState<PlanProgress | null>(null);
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

      // Get current plan progress
      const planProgress = getCurrentPlanProgress(savedProgress);
      if (planProgress) {
        setCurrentPlanData(planProgress);
      }

      // Load current plan
      const plans = getAllPlans();
      const plan = plans.find(p => p.id === savedProgress.currentPlanId);

      if (plan && planProgress) {
        setCurrentPlan(plan);

        // Calculate current day and get today's reading
        const currentDay = calculateCurrentDay(planProgress.startDate);
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
    if (!progress || !currentPlan || !currentPlanData) return;

    const now = new Date().toISOString();
    const newCompletedReadings = [...currentPlanData.completedReadings, readingId];
    const newCompletedDates = [...currentPlanData.completedDates, now];

    // Only increment streak if it's a new calendar day
    const incrementStreak = shouldIncrementStreak(
      currentPlanData.completedDates,
      currentPlanData.lastReadingDate
    );
    const newStreak = incrementStreak ? currentPlanData.currentStreak + 1 : currentPlanData.currentStreak;
    const newLongestStreak = Math.max(newStreak, currentPlanData.longestStreak);

    const updatedPlanProgress: PlanProgress = {
      ...currentPlanData,
      completedReadings: newCompletedReadings,
      completedDates: newCompletedDates,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastReadingDate: now,
      totalReadings: currentPlanData.totalReadings + 1,
    };

    const updatedProgress: MultiPlanProgress = {
      ...progress,
      planProgress: {
        ...progress.planProgress,
        [progress.currentPlanId]: updatedPlanProgress,
      },
    };

    saveProgress(updatedProgress);
    setProgress(updatedProgress);
    setCurrentPlanData(updatedPlanProgress);
  };

  const handleCompleteAndContinue = () => {
    if (!progress || !currentPlan || !todaysReading || !currentPlanData) return;

    // Complete current reading if not already completed
    if (!currentPlanData.completedReadings.includes(todaysReading.id)) {
      handleCompleteReading(todaysReading.id);
    }

    // Move to next day
    const currentDay = calculateCurrentDay(currentPlanData.startDate);
    const nextDay = currentDay + 1;

    if (nextDay <= currentPlan.totalDays) {
      // Advance start date by one day to simulate skipping ahead
      const newStartDate = new Date(currentPlanData.startDate);
      newStartDate.setDate(newStartDate.getDate() - 1);

      const updatedPlanProgress: PlanProgress = {
        ...currentPlanData,
        startDate: newStartDate.toISOString(),
      };

      const updatedProgress: MultiPlanProgress = {
        ...progress,
        planProgress: {
          ...progress.planProgress,
          [progress.currentPlanId]: updatedPlanProgress,
        },
      };

      saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setCurrentPlanData(updatedPlanProgress);

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

  if (!progress || !currentPlan || !todaysReading || !currentPlanData) {
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
          currentStreak={currentPlanData.currentStreak}
          longestStreak={currentPlanData.longestStreak}
          totalReadings={currentPlanData.totalReadings}
        />
      </div>

      <div className="fade-in-up-delay-1">
        <TodayReading
          reading={todaysReading}
          isCompleted={currentPlanData.completedReadings.includes(todaysReading.id)}
          onComplete={() => handleCompleteReading(todaysReading.id)}
          onCompleteAndContinue={handleCompleteAndContinue}
          currentDay={calculateCurrentDay(currentPlanData.startDate)}
          totalDays={currentPlan.totalDays}
          hasReadToday={hasReadToday(currentPlanData.completedDates)}
        />
      </div>

      <div className="fade-in-up-delay-2 text-center text-neutral-500">
        <p className="text-sm">
          Reading plan: {currentPlan.name} • Day {calculateCurrentDay(currentPlanData.startDate)} of {currentPlan.totalDays}
        </p>
      </div>
    </div>
  );
}
