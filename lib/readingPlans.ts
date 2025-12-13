import plansData from '@/data/plans.json';
import { ReadingPlan, Reading } from '@/types';

export function getAllPlans(): ReadingPlan[] {
  return plansData.plans as ReadingPlan[];
}

export function getPlanById(id: string): ReadingPlan | null {
  const plans = getAllPlans();
  return plans.find(p => p.id === id) || null;
}

export function getReadingByDay(plan: ReadingPlan, day: number): Reading | null {
  return plan.readings.find(r => r.day === day) || null;
}

export function getReadingById(plan: ReadingPlan, readingId: string): Reading | null {
  return plan.readings.find(r => r.id === readingId) || null;
}
