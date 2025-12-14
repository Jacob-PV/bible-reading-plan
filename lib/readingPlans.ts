import plansData from '@/data/plans.json';
import { ReadingPlan, Reading } from '@/types';
import { getCustomPlans } from './customPlans';

export function getAllPlans(): ReadingPlan[] {
  const defaultPlans = plansData.plans as ReadingPlan[];
  const customPlans = getCustomPlans();
  return [...defaultPlans, ...customPlans];
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
