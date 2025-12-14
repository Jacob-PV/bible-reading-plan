'use client';

import { useEffect, useState } from 'react';
import { loadProgress, getCurrentPlanProgress, getNoteForReading, saveNote } from '@/lib/storage';
import { getPlanById } from '@/lib/readingPlans';
import { MultiPlanProgress, PlanProgress, ReadingPlan, Reading, Note } from '@/types';
import { Check, Book, StickyNote, ChevronDown, ChevronUp, Edit2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlanViewPage() {
  const [progress, setProgress] = useState<MultiPlanProgress | null>(null);
  const [planProgress, setPlanProgress] = useState<PlanProgress | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editedNoteContent, setEditedNoteContent] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);
      const currentPlanProgress = getCurrentPlanProgress(savedProgress);
      if (currentPlanProgress) {
        setPlanProgress(currentPlanProgress);
      }
      const plan = getPlanById(savedProgress.currentPlanId);
      setCurrentPlan(plan);
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
    setEditingNote(null);
    setEditedNoteContent('');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setEditedNoteContent('');
  };

  if (!progress || !currentPlan || !planProgress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-stoneGray text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const isReadingCompleted = (readingId: string) => {
    return planProgress.completedReadings.includes(readingId);
  };

  const completionPercentage = Math.round(
    (planProgress.completedReadings.length / currentPlan.totalDays) * 100
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="btn-ghost mb-4"
        >
          &larr; Back to Today's Reading
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-deepEarth mb-4">
          {currentPlan.name}
        </h1>
        <p className="text-xl text-stoneGray mb-6">{currentPlan.description}</p>

        <div className="reading-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-deepEarth">
                {planProgress.completedReadings.length} / {currentPlan.totalDays}
              </p>
              <p className="text-sm text-stoneGray">Readings Completed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sacredGold">
                {completionPercentage}%
              </p>
              <p className="text-sm text-stoneGray">Complete</p>
            </div>
          </div>

          <div className="w-full bg-deepEarth/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sacredGold to-livingGreen h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-deepEarth mb-4">
          All Readings ({currentPlan.totalDays} days)
        </h2>

        <div className="grid gap-3">
          {currentPlan.readings.map((reading: Reading) => {
            const completed = isReadingCompleted(reading.id);
            const note = getNoteForReading(reading.id);
            const hasNote = note && note.content.trim().length > 0;
            const isExpanded = expandedNotes.has(reading.id);
            const isEditing = editingNote === reading.id;

            return (
              <div
                key={reading.id}
                className={`reading-card transition-all duration-200 ${
                  completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      completed
                        ? 'bg-livingGreen border-livingGreen text-white'
                        : 'border-sacredGold text-sacredGold'
                    }`}
                  >
                    {completed ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      <span className="text-sm font-bold">{reading.day}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Book size={16} className="text-spiritualBlue" />
                        <p className="text-sm font-semibold text-sacredGold uppercase tracking-wide">
                          Day {reading.day}
                        </p>
                      </div>
                      {hasNote && (
                        <div className="flex items-center gap-1 text-xs text-spiritualBlue">
                          <StickyNote size={14} />
                          Note
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-scripture text-deepEarth mb-2">
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
      </div>
    </div>
  );
}
