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
}

export default function TodayReading({
  reading,
  isCompleted,
  onComplete,
  onCompleteAndContinue,
  currentDay,
  totalDays,
}: TodayReadingProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  // Load existing note when component mounts or reading changes
  useEffect(() => {
    const existingNote = getNoteForReading(reading.id);
    if (existingNote) {
      setNotes(existingNote.content);
    } else {
      setNotes('');
    }
  }, [reading.id]);

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
  };

  return (
    <div className="reading-card max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <p className="text-sacredGold text-sm font-semibold tracking-wider uppercase mb-2">
            Day {currentDay} of {totalDays}
          </p>
          <h2 className="text-4xl md:text-5xl font-scripture text-deepEarth leading-tight">
            {reading.passages.join(', ')}
          </h2>
        </div>

        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`flex-shrink-0 ml-6 w-16 h-16 rounded-full border-3 flex items-center justify-center transition-all duration-300 shadow-lg ${
            isCompleted
              ? 'bg-livingGreen border-livingGreen text-white scale-100 shadow-livingGreen/30'
              : 'border-sacredGold bg-white hover:bg-sacredGold hover:border-sacredGold hover:text-white hover:scale-110 active:scale-95 shadow-sacredGold/20 hover:shadow-xl hover:shadow-sacredGold/40'
          }`}
          aria-label={isCompleted ? 'Reading completed' : 'Mark reading as complete'}
        >
          {isCompleted && <Check size={32} strokeWidth={3} />}
        </button>
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
          {showNotes ? 'Hide Notes' : 'Add Notes'}
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
              <button onClick={handleSaveNotes} className="btn-ghost text-sm">Save Notes</button>
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
