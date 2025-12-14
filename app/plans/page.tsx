'use client';

import { useEffect, useState } from 'react';
import { loadProgress, saveProgress, switchPlan, resetPlanProgress, getPlanProgress } from '@/lib/storage';
import { getAllPlans } from '@/lib/readingPlans';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Plus, CheckCircle, RotateCcw } from 'lucide-react';
import { MultiPlanProgress, ReadingPlan, PlanProgress } from '@/types';

export default function PlansPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<MultiPlanProgress | null>(null);
  const [allPlans, setAllPlans] = useState<ReadingPlan[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState<string | null>(null);

  useEffect(() => {
    const savedProgress = loadProgress();
    setProgress(savedProgress);
    setAllPlans(getAllPlans());
  }, []);

  const handleSwitchPlan = (planId: string) => {
    if (!progress) {
      // First time user - create new progress
      const newProgress = {
        userId: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        currentPlanId: planId,
        planProgress: {
          [planId]: {
            planId: planId,
            completedReadings: [],
            completedDates: [],
            currentStreak: 0,
            longestStreak: 0,
            lastReadingDate: null,
            totalReadings: 0,
            startDate: new Date().toISOString(),
            lastAccessedDate: new Date().toISOString(),
          }
        }
      };
      saveProgress(newProgress);
      setProgress(newProgress);
      router.push('/');
      return;
    }

    if (planId === progress.currentPlanId) {
      // Already on this plan, just navigate
      router.push('/');
      return;
    }

    // Switch to different plan
    const updatedProgress = switchPlan(progress, planId);
    saveProgress(updatedProgress);
    setProgress(updatedProgress);
    router.push('/');
  };

  const handleResetPlan = (planId: string) => {
    setShowResetConfirm(planId);
  };

  const confirmReset = (planId: string) => {
    if (!progress) return;

    const updatedProgress = resetPlanProgress(progress, planId);
    saveProgress(updatedProgress);
    setProgress(updatedProgress);
    setShowResetConfirm(null);
  };

  const cancelReset = () => {
    setShowResetConfirm(null);
  };

  const getPlanProgressData = (planId: string): PlanProgress | null => {
    if (!progress) return null;
    return getPlanProgress(progress, planId);
  };

  const calculateProgressPercentage = (plan: ReadingPlan): number => {
    const planProgress = getPlanProgressData(plan.id);
    if (!planProgress) return 0;
    return Math.round((planProgress.completedReadings.length / plan.totalDays) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-deepEarth">
          Reading Plans
        </h1>
        <p className="text-lg text-stoneGray max-w-2xl mx-auto">
          Switch between plans or start new ones. Your progress is saved for each plan.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8 fade-in-up-delay-1">
        <Link href="/plan-view" className="btn-secondary flex items-center gap-2">
          <BookOpen size={20} />
          View Current Plan Details
        </Link>
        <Link href="/create-plan" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Custom Plan
        </Link>
      </div>

      {/* All Plans with Progress */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {allPlans.map((plan) => {
          const planProgress = getPlanProgressData(plan.id);
          const progressPercentage = calculateProgressPercentage(plan);
          const isActive = progress?.currentPlanId === plan.id;
          const hasStarted = planProgress && planProgress.completedReadings.length > 0;

          return (
            <div
              key={plan.id}
              className={`reading-card transition-all ${
                isActive ? 'ring-2 ring-spiritualBlue shadow-lg' : ''
              }`}
            >
              {isActive && (
                <div className="mb-3 inline-flex items-center gap-1 px-3 py-1 bg-spiritualBlue text-white text-xs font-semibold rounded-full">
                  <CheckCircle size={14} />
                  Active Plan
                </div>
              )}

              <h3 className="text-2xl font-bold text-deepEarth mb-2">{plan.name}</h3>
              <p className="text-sm text-stoneGray mb-4">{plan.description}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-deepEarth">
                    {planProgress ? planProgress.completedReadings.length : 0} / {plan.totalDays} days
                  </span>
                  <span className="text-sm font-bold text-sacredGold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-deepEarth/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sacredGold to-livingGreen h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {!isActive && (
                  <button
                    onClick={() => handleSwitchPlan(plan.id)}
                    className="btn-primary flex-1 text-sm"
                  >
                    {hasStarted ? 'Switch to Plan' : 'Start Plan'}
                  </button>
                )}
                {isActive && (
                  <div className="flex-1 text-center py-2 text-sm text-spiritualBlue font-medium">
                    Currently Active
                  </div>
                )}
                {hasStarted && (
                  <button
                    onClick={() => handleResetPlan(plan.id)}
                    className="btn-ghost text-sm flex items-center gap-1 px-3"
                    title="Reset progress for this plan"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                )}
              </div>

              {planProgress && planProgress.completedReadings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-deepEarth/10">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stoneGray">Streak:</span>
                      <span className="ml-1 font-semibold text-spiritualBlue">
                        {planProgress.currentStreak} days
                      </span>
                    </div>
                    <div>
                      <span className="text-stoneGray">Best:</span>
                      <span className="ml-1 font-semibold text-livingGreen">
                        {planProgress.longestStreak} days
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-deepEarth mb-3">Reset Plan Progress?</h3>
            <p className="text-stoneGray mb-6">
              This will permanently delete all progress, notes, and streak data for this plan. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelReset}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmReset(showResetConfirm)}
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
              >
                Reset Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
