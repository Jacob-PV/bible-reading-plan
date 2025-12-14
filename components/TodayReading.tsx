'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Reading } from '@/types';
import { getNoteForReading, saveNote } from '@/lib/storage';

interface TodayReadingProps {
  reading: Reading;
  isCompleted: boolean;
  onComplete: () => void;
  onCompleteAndContinue?: () => void;
  currentDay: number;
  totalDays: number;
  hasReadToday?: boolean;
}

export default function TodayReading({
  reading,
  isCompleted,
  onComplete,
  onCompleteAndContinue,
  currentDay,
  totalDays,
  hasReadToday = false,
}: TodayReadingProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Load existing note when component mounts or reading changes
  useEffect(() => {
    const existingNote = getNoteForReading(reading.id);
    if (existingNote) {
      setNotes(existingNote.content);
      // If note exists, auto-expand the notes section
      setShowNotes(false); // Keep it collapsed initially, user can click to view
    } else {
      setNotes('');
    }
  }, [reading.id]);

  // Check if a note exists for this reading
  const hasExistingNote = () => {
    const existingNote = getNoteForReading(reading.id);
    return existingNote && existingNote.content.trim().length > 0;
  };

  // Show tooltip for first-time users (only if not completed)
  useEffect(() => {
    if (!isCompleted && !hasReadToday) {
      const hasSeenTooltip = localStorage.getItem('hasSeenCompletionTooltip');
      if (!hasSeenTooltip) {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('hasSeenCompletionTooltip', 'true');
        }, 5000);
      }
    }
  }, [isCompleted, hasReadToday]);

  const handleSaveNotes = () => {
    const now = new Date().toISOString();
    const existingNote = getNoteForReading(reading.id);

    const note = {
      id: existingNote?.id || `note-${reading.id}-${Date.now()}`,
      readingId: reading.id,
      content: notes,
      createdAt: existingNote?.createdAt || now,
      updatedAt: now,
    };

    saveNote(note);

    // Show saved feedback
    setNoteSaved(true);

    // Auto-clear after 2 seconds
    setTimeout(() => {
      setNoteSaved(false);
    }, 2000);
  };

  return (
    <div className="reading-card max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-accent-600 text-sm font-semibold tracking-wider uppercase">
            Day {currentDay} of {totalDays}
          </p>
          {hasReadToday && (
            <span className="text-xs bg-success-50 text-success-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Check size={12} />
              Read today
            </span>
          )}
        </div>
        <h2 className="text-4xl md:text-5xl font-scripture text-neutral-900 leading-tight mb-6">
          {reading.passages.join(', ')}
        </h2>

        {/* Completion Button - Design Option A */}
        <div className="relative inline-block">
          {!isCompleted ? (
            <button
              onClick={onComplete}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4 hover:scale-105 active:scale-95"
            >
              <Check size={24} />
              Mark as Complete
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-success-50 border-2 border-success-600 rounded-lg text-success-600 font-semibold text-lg">
              <Check size={24} strokeWidth={3} />
              Completed!
            </div>
          )}

          {/* First-time tooltip */}
          {showTooltip && !isCompleted && (
            <div className="absolute -top-16 left-0 right-0 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
              Click here after you finish reading
              <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-neutral-900"></div>
            </div>
          )}
        </div>
      </div>

      {reading.studyTags && reading.studyTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {reading.studyTags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-deepEarth/10 pt-6">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-2 text-spiritualBlue hover:text-spiritualBlue/80 font-medium transition-colors"
        >
          {showNotes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          {showNotes ? 'Hide Notes' : hasExistingNote() ? 'View Notes' : 'Add Notes'}
        </button>

        {showNotes && (
          <div className="mt-4 animate-fadeIn">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your thoughts and reflections..."
              className="w-full min-h-[150px] p-4 border-2 border-deepEarth/15 rounded-lg focus:border-spiritualBlue focus:outline-none focus:ring-2 focus:ring-spiritualBlue/20 transition-all resize-none font-body text-inkBlack"
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-stoneGray">
                {notes.length} / 5000 characters
              </span>
              <button
                onClick={handleSaveNotes}
                className={`btn-ghost text-sm flex items-center gap-2 ${noteSaved ? 'text-livingGreen' : ''}`}
              >
                {noteSaved && <Check size={16} />}
                {noteSaved ? 'Saved!' : 'Save Notes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {isCompleted && (
        <div className="mt-6 p-4 bg-livingGreen/10 border border-livingGreen/20 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-livingGreen font-medium flex items-center gap-2">
              <Check size={20} />
              Reading completed! Keep up your great work.
            </p>
            {onCompleteAndContinue && currentDay < totalDays && (
              <button
                onClick={onCompleteAndContinue}
                className="btn-primary text-sm"
              >
                Continue to Next Day
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
