'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Check } from 'lucide-react';
import {
  createCustomPlan,
  saveCustomPlan,
  createReading,
  validateCustomPlan,
  parsePassages,
} from '@/lib/customPlans';
import { Reading } from '@/types';

export default function CreatePlanPage() {
  const router = useRouter();
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [readings, setReadings] = useState<Reading[]>([
    createReading(1, [''], []),
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleAddReading = () => {
    const newDay = readings.length + 1;
    setReadings([...readings, createReading(newDay, [''], [])]);
  };

  const handleRemoveReading = (index: number) => {
    if (readings.length === 1) return; // Keep at least one
    const updated = readings.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = updated.map((r, i) => ({ ...r, day: i + 1 }));
    setReadings(renumbered);
  };

  const handlePassagesChange = (index: number, text: string) => {
    const updated = [...readings];
    updated[index] = {
      ...updated[index],
      passages: text ? parsePassages(text) : [''],
    };
    setReadings(updated);
  };

  const handleTagsChange = (index: number, text: string) => {
    const updated = [...readings];
    updated[index] = {
      ...updated[index],
      studyTags: text ? text.split(',').map(t => t.trim()) : [],
    };
    setReadings(updated);
  };

  const handleSavePlan = () => {
    const plan = createCustomPlan(planName, planDescription, readings);
    const validationErrors = validateCustomPlan(plan);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    saveCustomPlan(plan);
    setErrors([]);
    setSuccess(true);

    // Redirect to plans page after short delay
    setTimeout(() => {
      router.push('/plans');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-deepEarth mb-4">
          Create Custom Reading Plan
        </h1>
        <p className="text-lg text-stoneGray">
          Design your own personalized Bible reading plan
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Please fix these errors:</h3>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-livingGreen/10 border border-livingGreen/20 rounded-lg">
          <p className="text-livingGreen font-medium flex items-center gap-2">
            <Check size={20} />
            Plan created successfully! Redirecting...
          </p>
        </div>
      )}

      <div className="reading-card mb-6">
        <h2 className="text-2xl font-bold text-deepEarth mb-4">Plan Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-deepEarth mb-2">
              Plan Name *
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g., Psalms & Proverbs"
              className="w-full p-3 border-2 border-deepEarth/15 rounded-lg focus:border-spiritualBlue focus:outline-none focus:ring-2 focus:ring-spiritualBlue/20 transition-all"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-deepEarth mb-2">
              Description *
            </label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              placeholder="Describe your reading plan..."
              className="w-full p-3 border-2 border-deepEarth/15 rounded-lg focus:border-spiritualBlue focus:outline-none focus:ring-2 focus:ring-spiritualBlue/20 transition-all resize-none"
              rows={3}
              maxLength={500}
            />
          </div>
        </div>
      </div>

      <div className="reading-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-deepEarth">
            Readings ({readings.length} days)
          </h2>
          <button onClick={handleAddReading} className="btn-primary">
            <Plus size={20} />
            Add Day
          </button>
        </div>

        <div className="space-y-4">
          {readings.map((reading, index) => (
            <div
              key={reading.id}
              className="p-4 border-2 border-deepEarth/10 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-deepEarth">Day {reading.day}</h3>
                {readings.length > 1 && (
                  <button
                    onClick={() => handleRemoveReading(index)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stoneGray mb-1">
                    Passages * (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={reading.passages.join(', ')}
                    onChange={(e) => handlePassagesChange(index, e.target.value)}
                    placeholder="e.g., Genesis 1-2, Psalm 1"
                    className="w-full p-2 text-sm border border-deepEarth/15 rounded focus:border-spiritualBlue focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stoneGray mb-1">
                    Study Tags (comma-separated, optional)
                  </label>
                  <input
                    type="text"
                    value={reading.studyTags?.join(', ') || ''}
                    onChange={(e) => handleTagsChange(index, e.target.value)}
                    placeholder="e.g., Creation, Poetry"
                    className="w-full p-2 text-sm border border-deepEarth/15 rounded focus:border-spiritualBlue focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button onClick={() => router.push('/plans')} className="btn-ghost">
          Cancel
        </button>
        <button onClick={handleSavePlan} className="btn-primary">
          <Check size={20} />
          Create Plan
        </button>
      </div>
    </div>
  );
}
