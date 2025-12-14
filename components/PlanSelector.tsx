'use client';

import { getAllPlans } from '@/lib/readingPlans';
import { ReadingPlan } from '@/types';
import { BookOpen, Calendar, TrendingUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PlanSelectorProps {
  onSelectPlan: (planId: string) => void;
}

export default function PlanSelector({ onSelectPlan }: PlanSelectorProps) {
  const router = useRouter();
  const plans = getAllPlans();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {plans.map((plan: ReadingPlan, index: number) => (
        <div
          key={plan.id}
          className={`bg-white border border-deepEarth/12 rounded-xl p-8 hover:border-sacredGold hover:shadow-cardHover transition-all duration-300 hover:-translate-y-1 cursor-pointer fade-in-up-delay-${index + 1}`}
          onClick={() => onSelectPlan(plan.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-sacredGold/10 rounded-lg">
              <BookOpen className="text-sacredGold" size={28} />
            </div>
            <span className={`text-sm font-semibold uppercase tracking-wide ${plan.type === 'custom' ? 'bg-spiritualBlue text-white px-3 py-1 rounded-full' : 'text-sacredGold'}`}>
              {plan.type === 'custom' ? 'CUSTOM' : plan.type}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-deepEarth mb-2">{plan.name}</h3>
          <p className="text-stoneGray mb-6 leading-relaxed">{plan.description}</p>

          <div className="flex items-center gap-6 text-sm text-deepEarth/70 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{plan.totalDays} days</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span>{plan.estimatedDuration}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlan(plan.id);
            }}
            className="btn-primary w-full"
          >
            Start This Plan
          </button>
        </div>
      ))}

      {/* Create Custom Plan Card */}
      <div
        className={`bg-white border-2 border-dashed border-sacredGold/40 rounded-xl p-8 hover:border-sacredGold hover:bg-sacredGold/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer fade-in-up-delay-${plans.length + 1} flex flex-col items-center justify-center min-h-[320px]`}
        onClick={() => router.push('/create-plan')}
      >
        <div className="p-4 bg-sacredGold/10 rounded-full mb-4">
          <Plus className="text-sacredGold" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-deepEarth mb-2">Create Custom Plan</h3>
        <p className="text-stoneGray text-center leading-relaxed">
          Design your own reading plan with personalized passages and schedule
        </p>
      </div>
    </div>
  );
}
