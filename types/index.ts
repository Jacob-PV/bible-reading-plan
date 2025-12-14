export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  type: 'chronological' | 'thematic' | 'book-by-book' | 'custom';
  readings: Reading[];
  totalDays: number;
  estimatedDuration: string;
}

export interface Reading {
  id: string;
  day: number;
  passages: string[];
  studyTags?: string[];
  theme?: string;
}

export interface Progress {
  userId: string;
  currentPlanId: string;
  completedReadings: string[];
  completedDates: string[]; // Array of ISO date strings for each completed reading
  currentStreak: number;
  longestStreak: number;
  lastReadingDate: string | null;
  totalReadings: number;
  startDate: string;
}

export interface Note {
  id: string;
  readingId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyFocus {
  tags: string[];
  customTags: string[];
}

export interface StudyTag {
  id: string;
  name: string;
  color: string;
}

export interface PlanProgress {
  planId: string;
  completedReadings: string[];
  completedDates: string[]; // Array of ISO date strings for each completed reading
  currentStreak: number;
  longestStreak: number;
  lastReadingDate: string | null;
  totalReadings: number;
  startDate: string;
  lastAccessedDate: string; // When this plan was last active
}

export interface MultiPlanProgress {
  userId: string;
  currentPlanId: string; // The currently active plan
  planProgress: Record<string, PlanProgress>; // Map of planId to PlanProgress
}
