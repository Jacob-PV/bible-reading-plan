'use client';

import { clearAllData, exportData } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-reading-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      clearAllData();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-deepEarth">
          Settings
        </h1>
        <p className="text-lg text-stoneGray">
          Manage your reading plan preferences and data
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-deepEarth/12 rounded-xl p-8 fade-in-up-delay-1">
          <h2 className="text-2xl font-bold text-deepEarth mb-2">Data Management</h2>
          <p className="text-stoneGray mb-6">
            Export your progress or reset all data
          </p>

          <div className="space-y-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-3 w-full px-6 py-4 bg-spiritualBlue/10 border border-spiritualBlue/20 rounded-lg hover:bg-spiritualBlue/15 transition-colors"
            >
              <Download className="text-spiritualBlue" size={24} />
              <div className="text-left">
                <div className="font-semibold text-deepEarth">Export Progress</div>
                <div className="text-sm text-stoneGray">Download your reading data as JSON</div>
              </div>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-3 w-full px-6 py-4 bg-softBurgundy/10 border border-softBurgundy/20 rounded-lg hover:bg-softBurgundy/15 transition-colors"
            >
              <Trash2 className="text-softBurgundy" size={24} />
              <div className="text-left">
                <div className="font-semibold text-deepEarth">Reset All Data</div>
                <div className="text-sm text-stoneGray">Clear all progress and start fresh</div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-deepEarth/12 rounded-xl p-8 fade-in-up-delay-2">
          <h2 className="text-2xl font-bold text-deepEarth mb-2">About</h2>
          <p className="text-stoneGray mb-4">
            Bible Reading Plan & Study Tracker helps you build consistent daily Bible reading habits through structured plans and progress tracking.
          </p>
          <p className="text-sm text-stoneGray">
            Version 1.0.0 • All data is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
