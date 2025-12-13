import { Progress, Note, StudyFocus } from '@/types';

const STORAGE_KEYS = {
  PROGRESS: 'bible-reading-progress',
  NOTES: 'bible-reading-notes',
  STUDY_FOCUS: 'bible-reading-study-focus',
};

// Progress management
export function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function loadProgress(): Progress | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

export function createDefaultProgress(planId: string): Progress {
  return {
    userId: generateUserId(),
    currentPlanId: planId,
    completedReadings: [],
    completedDates: [],
    currentStreak: 0,
    longestStreak: 0,
    lastReadingDate: null,
    totalReadings: 0,
    startDate: new Date().toISOString(),
  };
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
    progress: loadProgress(),
    notes: loadNotes(),
    studyFocus: loadStudyFocus(),
    exportedAt: new Date().toISOString(),
  };
}

export function importData(data: any): void {
  if (typeof window === 'undefined') return;
  try {
    if (data.progress) saveProgress(data.progress);
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
