import { Progress, Note, StudyFocus, MultiPlanProgress, PlanProgress } from '@/types';

const STORAGE_KEYS = {
  PROGRESS: 'bible-reading-progress',
  NOTES: 'bible-reading-notes',
  STUDY_FOCUS: 'bible-reading-study-focus',
};

// Migration helpers
function isOldProgressFormat(data: any): data is Progress {
  return data && 'completedReadings' in data && !('planProgress' in data);
}

function migrateProgressToMultiPlan(oldProgress: Progress): MultiPlanProgress {
  const planProgress: PlanProgress = {
    planId: oldProgress.currentPlanId,
    completedReadings: oldProgress.completedReadings,
    completedDates: oldProgress.completedDates,
    currentStreak: oldProgress.currentStreak,
    longestStreak: oldProgress.longestStreak,
    lastReadingDate: oldProgress.lastReadingDate,
    totalReadings: oldProgress.totalReadings,
    startDate: oldProgress.startDate,
    lastAccessedDate: new Date().toISOString(),
  };

  return {
    userId: oldProgress.userId,
    currentPlanId: oldProgress.currentPlanId,
    planProgress: {
      [oldProgress.currentPlanId]: planProgress,
    },
  };
}

// Progress management
export function saveProgress(progress: MultiPlanProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function loadProgress(): MultiPlanProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!data) return null;

    const parsed = JSON.parse(data);

    // Migration: Check if old format
    if (isOldProgressFormat(parsed)) {
      const migrated = migrateProgressToMultiPlan(parsed);
      // Save migrated data
      saveProgress(migrated);
      return migrated;
    }

    return parsed as MultiPlanProgress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

export function createDefaultProgress(planId: string): MultiPlanProgress {
  const planProgress: PlanProgress = {
    planId: planId,
    completedReadings: [],
    completedDates: [],
    currentStreak: 0,
    longestStreak: 0,
    lastReadingDate: null,
    totalReadings: 0,
    startDate: new Date().toISOString(),
    lastAccessedDate: new Date().toISOString(),
  };

  return {
    userId: generateUserId(),
    currentPlanId: planId,
    planProgress: {
      [planId]: planProgress,
    },
  };
}

// Get progress for a specific plan
export function getPlanProgress(
  multiProgress: MultiPlanProgress,
  planId: string
): PlanProgress | null {
  return multiProgress.planProgress[planId] || null;
}

// Get progress for the currently active plan
export function getCurrentPlanProgress(
  multiProgress: MultiPlanProgress
): PlanProgress | null {
  return getPlanProgress(multiProgress, multiProgress.currentPlanId);
}

// Switch to a different plan (preserving progress)
export function switchPlan(
  multiProgress: MultiPlanProgress,
  newPlanId: string
): MultiPlanProgress {
  const now = new Date().toISOString();

  // Update last accessed date for current plan
  if (multiProgress.planProgress[multiProgress.currentPlanId]) {
    multiProgress.planProgress[multiProgress.currentPlanId].lastAccessedDate = now;
  }

  // If new plan doesn't have progress, create it
  if (!multiProgress.planProgress[newPlanId]) {
    multiProgress.planProgress[newPlanId] = {
      planId: newPlanId,
      completedReadings: [],
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      lastReadingDate: null,
      totalReadings: 0,
      startDate: now,
      lastAccessedDate: now,
    };
  } else {
    // Update last accessed date for new plan
    multiProgress.planProgress[newPlanId].lastAccessedDate = now;
  }

  return {
    ...multiProgress,
    currentPlanId: newPlanId,
  };
}

// Reset progress for a specific plan
export function resetPlanProgress(
  multiProgress: MultiPlanProgress,
  planId: string
): MultiPlanProgress {
  const newProgress = { ...multiProgress };

  if (newProgress.planProgress[planId]) {
    newProgress.planProgress[planId] = {
      planId: planId,
      completedReadings: [],
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      lastReadingDate: null,
      totalReadings: 0,
      startDate: new Date().toISOString(),
      lastAccessedDate: new Date().toISOString(),
    };
  }

  return newProgress;
}

// Get notes for a specific plan
export function getNotesForPlan(planId: string): Note[] {
  const allNotes = loadNotes();
  // Notes have readingId which includes planId prefix
  return allNotes.filter(note => note.readingId.startsWith(planId));
}

// Get notes for a specific reading
export function getNotesForReading(readingId: string, planId: string): Note[] {
  const allNotes = loadNotes();
  // Match by full readingId
  return allNotes.filter(note => note.readingId === readingId);
}

// Notes management
export function saveNote(note: Note): void {
  if (typeof window === 'undefined') return;
  try {
    const notes = loadNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);

    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }

    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save note:', error);
  }
}

export function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load notes:', error);
    return [];
  }
}

export function getNoteForReading(readingId: string): Note | null {
  const notes = loadNotes();
  return notes.find(n => n.readingId === readingId) || null;
}

// Study focus management
export function saveStudyFocus(focus: StudyFocus): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_FOCUS, JSON.stringify(focus));
  } catch (error) {
    console.error('Failed to save study focus:', error);
  }
}

export function loadStudyFocus(): StudyFocus {
  if (typeof window === 'undefined') return { tags: [], customTags: [] };
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDY_FOCUS);
    return data ? JSON.parse(data) : { tags: [], customTags: [] };
  } catch (error) {
    console.error('Failed to load study focus:', error);
    return { tags: [], customTags: [] };
  }
}

// Utility functions
function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function exportData() {
  if (typeof window === 'undefined') return null;
  return {
    progress: loadProgress(), // Now returns MultiPlanProgress
    notes: loadNotes(),
    studyFocus: loadStudyFocus(),
    exportedAt: new Date().toISOString(),
    version: '2.0', // Add version for future migrations
  };
}

export function importData(data: any): void {
  if (typeof window === 'undefined') return;
  try {
    if (data.progress) {
      // Handle old format if importing from old export
      if (isOldProgressFormat(data.progress)) {
        const migrated = migrateProgressToMultiPlan(data.progress);
        saveProgress(migrated);
      } else {
        saveProgress(data.progress);
      }
    }
    if (data.notes) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
    }
    if (data.studyFocus) saveStudyFocus(data.studyFocus);
  } catch (error) {
    console.error('Failed to import data:', error);
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.STUDY_FOCUS);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
