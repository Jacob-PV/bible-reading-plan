import { ReadingPlan, Reading } from '@/types';

const STORAGE_KEY = 'bible-reading-custom-plans';

// Get all custom plans
export function getCustomPlans(): ReadingPlan[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load custom plans:', error);
    return [];
  }
}

// Save a custom plan
export function saveCustomPlan(plan: ReadingPlan): void {
  if (typeof window === 'undefined') return;

  try {
    const customPlans = getCustomPlans();
    const existingIndex = customPlans.findIndex(p => p.id === plan.id);

    if (existingIndex >= 0) {
      customPlans[existingIndex] = plan;
    } else {
      customPlans.push(plan);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPlans));
  } catch (error) {
    console.error('Failed to save custom plan:', error);
  }
}

// Delete a custom plan
export function deleteCustomPlan(planId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const customPlans = getCustomPlans();
    const filtered = customPlans.filter(p => p.id !== planId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete custom plan:', error);
  }
}

// Create a new custom plan
export function createCustomPlan(
  name: string,
  description: string,
  readings: Reading[]
): ReadingPlan {
  const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    name,
    description,
    type: 'custom',
    readings,
    totalDays: readings.length,
    estimatedDuration: `${readings.length} days`,
  };
}

// Validate a custom plan
export function validateCustomPlan(plan: Partial<ReadingPlan>): string[] {
  const errors: string[] = [];

  if (!plan.name || plan.name.trim().length === 0) {
    errors.push('Plan name is required');
  }

  if (!plan.description || plan.description.trim().length === 0) {
    errors.push('Plan description is required');
  }

  if (!plan.readings || plan.readings.length === 0) {
    errors.push('At least one reading is required');
  }

  if (plan.readings) {
    plan.readings.forEach((reading, index) => {
      if (!reading.passages || reading.passages.length === 0) {
        errors.push(`Reading ${index + 1} must have at least one passage`);
      }
    });
  }

  return errors;
}

// Create a reading entry for custom plan
export function createReading(
  day: number,
  passages: string[],
  studyTags?: string[],
  theme?: string
): Reading {
  return {
    id: `reading-${day}-${Date.now()}`,
    day,
    passages,
    studyTags,
    theme,
  };
}

// Parse passages from text (e.g., "Genesis 1-2, Psalm 1")
export function parsePassages(text: string): string[] {
  return text
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

// Generate a simple sequential plan (e.g., read entire book)
export function generateSequentialPlan(
  name: string,
  description: string,
  startBook: string,
  chapters: number
): ReadingPlan {
  const readings: Reading[] = [];

  for (let i = 1; i <= chapters; i++) {
    readings.push(createReading(i, [`${startBook} ${i}`]));
  }

  return createCustomPlan(name, description, readings);
}
