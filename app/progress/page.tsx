'use client';

import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/storage';
import { Progress, ReadingPlan, Reading } from '@/types';
import ProgressStreak from '@/components/ProgressStreak';
import { getCompletionPercentage } from '@/lib/dateUtils';
import { getAllPlans, getPlanById } from '@/lib/readingPlans';
import { Calendar, Book } from 'lucide-react';

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null);
  const [recentReadings, setRecentReadings] = useState<Array<{ reading: Reading; completedDate: string }>>([]);

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);

      const plan = getPlanById(savedProgress.currentPlanId);
      if (plan) {
        setCurrentPlan(plan);
        const percentage = getCompletionPercentage(
          savedProgress.completedReadings.length,
          plan.totalDays
        );
        setCompletionPercentage(percentage);

        // Get recent completed readings (last 10)
        const recent = savedProgress.completedReadings
          .slice(-10)
          .reverse()
          .map((readingId, index) => {
            const reading = plan.readings.find(r => r.id === readingId);
            const dateIndex = savedProgress.completedReadings.indexOf(readingId);
            const completedDate = savedProgress.completedDates?.[dateIndex] || '';
            return reading ? { reading, completedDate } : null;
          })
          .filter((item): item is { reading: Reading; completedDate: string } => item !== null);

        setRecentReadings(recent);
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

      {recentReadings.length > 0 && (
        <div className="bg-white border border-deepEarth/12 rounded-xl p-8 fade-in-up-delay-3">
          <h2 className="text-2xl font-bold text-deepEarth mb-6">Reading History</h2>
          <div className="space-y-3">
            {recentReadings.map(({ reading, completedDate }) => {
              const date = completedDate ? new Date(completedDate) : null;
              const formattedDate = date
                ? date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown';

              return (
                <div
                  key={reading.id}
                  className="flex items-start gap-4 p-4 bg-parchment rounded-lg hover:bg-parchment/70 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-livingGreen/10 border-2 border-livingGreen flex items-center justify-center">
                    <Book size={20} className="text-livingGreen" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-sacredGold">
                        Day {reading.day}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-stoneGray">
                        <Calendar size={14} />
                        {formattedDate}
                      </div>
                    </div>
                    <h3 className="text-lg font-scripture text-deepEarth">
                      {reading.passages.join(', ')}
                    </h3>

                    {reading.studyTags && reading.studyTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reading.studyTags.map((tag) => (
                          <span key={tag} className="tag text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {progress.completedReadings.length > 10 && (
            <p className="text-center text-sm text-stoneGray mt-4">
              Showing 10 most recent readings
            </p>
          )}
        </div>
      )}
    </div>
  );
}
