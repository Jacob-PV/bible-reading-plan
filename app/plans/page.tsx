'use client';

import PlanSelector from '@/components/PlanSelector';
import { loadProgress, saveProgress, createDefaultProgress } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';

export default function PlansPage() {
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    const currentProgress = loadProgress();

    if (currentProgress) {
      // User is switching plans - confirm first
      if (confirm('Switching plans will save your current progress. Continue?')) {
        const newProgress = createDefaultProgress(planId);
        // Preserve some existing progress data
        newProgress.longestStreak = currentProgress.longestStreak;
        saveProgress(newProgress);
        router.push('/');
      }
    } else {
      // First time user
      const newProgress = createDefaultProgress(planId);
      saveProgress(newProgress);
      router.push('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-deepEarth">
          Reading Plans
        </h1>
        <p className="text-lg text-stoneGray max-w-2xl mx-auto">
          Choose a plan that matches your goals and commitment level
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

      <PlanSelector onSelectPlan={handleSelectPlan} />
    </div>
  );
}
