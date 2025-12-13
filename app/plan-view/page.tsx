'use client';

import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/storage';
import { getPlanById } from '@/lib/readingPlans';
import { Progress, ReadingPlan, Reading } from '@/types';
import { Check, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlanViewPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);
      const plan = getPlanById(savedProgress.currentPlanId);
      setCurrentPlan(plan);
    }
  }, []);

  if (!progress || !currentPlan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-stoneGray text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const isReadingCompleted = (readingId: string) => {
    return progress.completedReadings.includes(readingId);
  };

  const completionPercentage = Math.round(
    (progress.completedReadings.length / currentPlan.totalDays) * 100
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="btn-ghost mb-4"
        >
          &larr; Back to Today's Reading
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-deepEarth mb-4">
          {currentPlan.name}
        </h1>
        <p className="text-xl text-stoneGray mb-6">{currentPlan.description}</p>

        <div className="reading-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-deepEarth">
                {progress.completedReadings.length} / {currentPlan.totalDays}
              </p>
              <p className="text-sm text-stoneGray">Readings Completed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sacredGold">
                {completionPercentage}%
              </p>
              <p className="text-sm text-stoneGray">Complete</p>
            </div>
          </div>

          <div className="w-full bg-deepEarth/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sacredGold to-livingGreen h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-deepEarth mb-4">
          All Readings ({currentPlan.totalDays} days)
        </h2>

        <div className="grid gap-3">
          {currentPlan.readings.map((reading: Reading) => {
            const completed = isReadingCompleted(reading.id);
            return (
              <div
                key={reading.id}
                className={`reading-card transition-all duration-200 ${
                  completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      completed
                        ? 'bg-livingGreen border-livingGreen text-white'
                        : 'border-sacredGold text-sacredGold'
                    }`}
                  >
                    {completed ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      <span className="text-sm font-bold">{reading.day}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Book size={16} className="text-spiritualBlue" />
                      <p className="text-sm font-semibold text-sacredGold uppercase tracking-wide">
                        Day {reading.day}
                      </p>
                    </div>
                    <h3 className="text-xl font-scripture text-deepEarth mb-2">
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
