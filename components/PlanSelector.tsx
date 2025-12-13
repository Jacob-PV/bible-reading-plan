'use client';

import { getAllPlans } from '@/lib/readingPlans';
import { ReadingPlan } from '@/types';
import { BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface PlanSelectorProps {
  onSelectPlan: (planId: string) => void;
}

export default function PlanSelector({ onSelectPlan }: PlanSelectorProps) {
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
            <span className="text-sm font-semibold text-sacredGold uppercase tracking-wide">
              {plan.type}
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
    </div>
  );
}
