'use client';

import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/storage';
import { Progress } from '@/types';
import ProgressStreak from '@/components/ProgressStreak';
import { getCompletionPercentage } from '@/lib/dateUtils';
import { getAllPlans } from '@/lib/readingPlans';

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);

      const plans = getAllPlans();
      const plan = plans.find(p => p.id === savedProgress.currentPlanId);
      if (plan) {
        const percentage = getCompletionPercentage(
          savedProgress.completedReadings.length,
          plan.totalDays
        );
        setCompletionPercentage(percentage);
      }
    }
  }, []);

  if (!progress) {
    return (
      <div className="text-center py-12">
        <p className="text-stoneGray text-lg">
          Start a reading plan to track your progress
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12 fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-deepEarth">
          Your Progress
        </h1>
        <p className="text-lg text-stoneGray">
          Keep up the great work on your reading journey
        </p>
      </div>

      <div className="fade-in-up-delay-1">
        <ProgressStreak
          currentStreak={progress.currentStreak}
          longestStreak={progress.longestStreak}
          totalReadings={progress.totalReadings}
        />
      </div>

      <div className="bg-white border border-deepEarth/12 rounded-xl p-8 fade-in-up-delay-2">
        <h2 className="text-2xl font-bold text-deepEarth mb-6">Overall Progress</h2>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-deepEarth">Plan Completion</span>
              <span className="text-sm font-bold text-sacredGold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-deepEarth/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-sacredGold to-deepEarth h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-parchment rounded-lg">
              <div className="text-2xl font-bold text-sacredGold mb-1">
                {progress.completedReadings.length}
              </div>
              <div className="text-sm text-stoneGray">Days Completed</div>
            </div>

            <div className="p-4 bg-parchment rounded-lg">
              <div className="text-2xl font-bold text-spiritualBlue mb-1">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-stoneGray">Current Streak</div>
            </div>

            <div className="p-4 bg-parchment rounded-lg">
              <div className="text-2xl font-bold text-livingGreen mb-1">
                {progress.longestStreak}
              </div>
              <div className="text-sm text-stoneGray">Best Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
