import { differenceInDays, format, parseISO, isToday, isBefore, startOfDay, isSameDay } from 'date-fns';

export function calculateCurrentDay(startDate: string): number {
  const start = parseISO(startDate);
  const today = startOfDay(new Date());
  const daysPassed = differenceInDays(today, start);
  return daysPassed + 1; // Day 1, not Day 0
}

export function calculateStreak(completedDates: string[], lastReadingDate: string | null): { current: number; longest: number } {
  if (completedDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Sort dates in descending order
  const sortedDates = completedDates
    .map(d => startOfDay(parseISO(d)))
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date());
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if last reading was today or yesterday to maintain streak
  const lastReading = sortedDates[0];
  const daysDiff = differenceInDays(today, lastReading);

  if (daysDiff === 0 || daysDiff === 1) {
    currentStreak = 1;

    // Count consecutive days backwards
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
}

export function formatDateForDisplay(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM d, yyyy');
}

export function isReadingForToday(readingDate: string): boolean {
  return isToday(parseISO(readingDate));
}

export function getReadingForDay(dayNumber: number, readings: any[]) {
  return readings.find(r => r.day === dayNumber);
}

export function getTodaysDateString(): string {
  return startOfDay(new Date()).toISOString();
}

export function getCompletionPercentage(completedCount: number, totalDays: number): number {
  if (totalDays === 0) return 0;
  return Math.round((completedCount / totalDays) * 100);
}

export function hasReadToday(completedDates: string[]): boolean {
  if (completedDates.length === 0) return false;

  const today = startOfDay(new Date());

  return completedDates.some(dateStr => {
    const completedDate = startOfDay(parseISO(dateStr));
    return isSameDay(completedDate, today);
  });
}

export function shouldIncrementStreak(completedDates: string[], lastReadingDate: string | null): boolean {
  // If no reading completed yet, should increment
  if (!lastReadingDate) return true;

  // Check if user has already read today
  if (hasReadToday(completedDates)) {
    return false; // Don't increment if already read today
  }

  return true;
}
