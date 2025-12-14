'use client';

import { useEffect, useState } from 'react';
import { loadProgress, getCurrentPlanProgress, getNoteForReading, saveNote } from '@/lib/storage';
import { MultiPlanProgress, PlanProgress, ReadingPlan, Reading, Note } from '@/types';
import ProgressStreak from '@/components/ProgressStreak';
import { getCompletionPercentage } from '@/lib/dateUtils';
import { getAllPlans, getPlanById } from '@/lib/readingPlans';
import { Calendar, Book, ChevronDown, ChevronUp, Edit2, Save, StickyNote } from 'lucide-react';

export default function ProgressPage() {
  const [progress, setProgress] = useState<MultiPlanProgress | null>(null);
  const [planProgress, setPlanProgress] = useState<PlanProgress | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null);
  const [recentReadings, setRecentReadings] = useState<Array<{ reading: Reading; completedDate: string; note: Note | null }>>([]);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editedNoteContent, setEditedNoteContent] = useState<string>('');

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);

      const currentPlanProgress = getCurrentPlanProgress(savedProgress);
      if (currentPlanProgress) {
        setPlanProgress(currentPlanProgress);
      }

      const plan = getPlanById(savedProgress.currentPlanId);
      if (plan && currentPlanProgress) {
        setCurrentPlan(plan);
        const percentage = getCompletionPercentage(
          currentPlanProgress.completedReadings.length,
          plan.totalDays
        );
        setCompletionPercentage(percentage);

        // Get all completed readings with notes
        const allCompleted = currentPlanProgress.completedReadings
          .map((readingId, index) => {
            const reading = plan.readings.find(r => r.id === readingId);
            const completedDate = currentPlanProgress.completedDates?.[index] || '';
            const note = getNoteForReading(readingId);
            return reading ? { reading, completedDate, note } : null;
          })
          .filter((item): item is { reading: Reading; completedDate: string; note: Note | null } => item !== null)
          .reverse(); // Most recent first

        setRecentReadings(allCompleted);
      }
    }
  }, []);

  const toggleNoteExpansion = (readingId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(readingId)) {
      newExpanded.delete(readingId);
    } else {
      newExpanded.add(readingId);
    }
    setExpandedNotes(newExpanded);
  };

  const startEditingNote = (readingId: string, currentContent: string) => {
    setEditingNote(readingId);
    setEditedNoteContent(currentContent);
  };

  const saveEditedNote = (readingId: string) => {
    const existingNote = getNoteForReading(readingId);
    const now = new Date().toISOString();

    const note: Note = {
      id: existingNote?.id || `note-${readingId}-${Date.now()}`,
      readingId: readingId,
      content: editedNoteContent,
      createdAt: existingNote?.createdAt || now,
      updatedAt: now,
    };

    saveNote(note);

    // Update the display
    setRecentReadings(prevReadings =>
      prevReadings.map(item =>
        item.reading.id === readingId ? { ...item, note } : item
      )
    );

    setEditingNote(null);
    setEditedNoteContent('');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setEditedNoteContent('');
  };

  if (!progress || !planProgress) {
    return (
      <div className="text-center py-12">
        <p className="text-stoneGray text-lg">
          Start a reading plan to track your progress
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12 fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-deepEarth">
          Your Progress
        </h1>
        <p className="text-lg text-stoneGray">
          Keep up the great work on your reading journey
        </p>
      </div>

      <div className="fade-in-up-delay-1">
        <ProgressStreak
          currentStreak={planProgress.currentStreak}
          longestStreak={planProgress.longestStreak}
          totalReadings={planProgress.totalReadings}
        />
      </div>

      <div className="bg-white border border-deepEarth/12 rounded-xl p-8 fade-in-up-delay-2">
        <h2 className="text-2xl font-bold text-deepEarth mb-6">Overall Progress</h2>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-deepEarth">Plan Completion</span>
              <span className="text-sm font-bold text-sacredGold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-deepEarth/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-sacredGold to-deepEarth h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-parchment rounded-lg">
              <div className="text-2xl font-bold text-sacredGold mb-1">
                {planProgress.completedReadings.length}
              </div>
              <div className="text-sm text-stoneGray">Days Completed</div>
            </div>

            <div className="p-4 bg-parchment rounded-lg">
              <div className="text-2xl font-bold text-spiritualBlue mb-1">
                {planProgress.currentStreak}
              </div>
              <div className="text-sm text-stoneGray">Current Streak</div>
            </div>

            <div className="p-4 bg-parchment rounded-lg">
              <div className="text-2xl font-bold text-livingGreen mb-1">
                {planProgress.longestStreak}
              </div>
              <div className="text-sm text-stoneGray">Best Streak</div>
            </div>
          </div>
        </div>
      </div>

      {recentReadings.length > 0 && (
        <div className="bg-white border border-deepEarth/12 rounded-xl p-8 fade-in-up-delay-3">
          <h2 className="text-2xl font-bold text-deepEarth mb-6">Reading History</h2>
          <div className="space-y-3">
            {recentReadings.map(({ reading, completedDate, note }) => {
              const date = completedDate ? new Date(completedDate) : null;
              const formattedDate = date
                ? date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown';

              const isExpanded = expandedNotes.has(reading.id);
              const isEditing = editingNote === reading.id;
              const hasNote = note && note.content.trim().length > 0;

              return (
                <div
                  key={reading.id}
                  className="p-4 bg-parchment rounded-lg hover:bg-parchment/70 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-livingGreen/10 border-2 border-livingGreen flex items-center justify-center">
                      <Book size={20} className="text-livingGreen" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-sacredGold">
                          Day {reading.day}
                        </p>
                        <div className="flex items-center gap-3">
                          {hasNote && (
                            <div className="flex items-center gap-1 text-xs text-spiritualBlue">
                              <StickyNote size={14} />
                              Note
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-stoneGray">
                            <Calendar size={14} />
                            {formattedDate}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-scripture text-deepEarth">
                        {reading.passages.join(', ')}
                      </h3>

                      {reading.studyTags && reading.studyTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {reading.studyTags.map((tag) => (
                            <span key={tag} className="tag text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes Section */}
                      {hasNote && (
                        <div className="mt-3 border-t border-deepEarth/10 pt-3">
                          <button
                            onClick={() => toggleNoteExpansion(reading.id)}
                            className="flex items-center gap-2 text-sm text-spiritualBlue hover:text-spiritualBlue/80 font-medium transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {isExpanded ? 'Hide Notes' : 'View Notes'}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 animate-fadeIn">
                              {isEditing ? (
                                <div>
                                  <textarea
                                    value={editedNoteContent}
                                    onChange={(e) => setEditedNoteContent(e.target.value)}
                                    className="w-full min-h-[100px] p-3 border-2 border-deepEarth/15 rounded-lg focus:border-spiritualBlue focus:outline-none focus:ring-2 focus:ring-spiritualBlue/20 transition-all resize-none font-body text-inkBlack text-sm"
                                    maxLength={5000}
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      onClick={cancelEditingNote}
                                      className="btn-ghost text-xs px-3 py-1"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => saveEditedNote(reading.id)}
                                      className="btn-primary text-xs px-3 py-1 flex items-center gap-1"
                                    >
                                      <Save size={14} />
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="p-3 bg-white/50 rounded border border-deepEarth/10 text-sm text-inkBlack whitespace-pre-wrap">
                                    {note.content}
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-stoneGray">
                                      {note.updatedAt
                                        ? `Updated ${new Date(note.updatedAt).toLocaleDateString()}`
                                        : ''}
                                    </span>
                                    <button
                                      onClick={() => startEditingNote(reading.id, note.content)}
                                      className="text-xs text-spiritualBlue hover:text-spiritualBlue/80 flex items-center gap-1"
                                    >
                                      <Edit2 size={12} />
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {planProgress.completedReadings.length > 20 && (
            <p className="text-center text-sm text-stoneGray mt-4">
              Showing all {recentReadings.length} completed readings
            </p>
          )}
        </div>
      )}
    </div>
  );
}
