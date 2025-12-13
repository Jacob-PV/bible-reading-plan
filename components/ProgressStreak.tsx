interface ProgressStreakProps {
  currentStreak: number;
  longestStreak: number;
  totalReadings: number;
}

export default function ProgressStreak({
  currentStreak,
  longestStreak,
  totalReadings,
}: ProgressStreakProps) {
  return (
    <div className="bg-gradient-to-br from-sacredGold to-deepEarth text-white rounded-2xl p-8 shadow-goldGlow max-w-2xl mx-auto text-center">
      <div className="mb-4">
        <div className="text-6xl md:text-7xl font-bold font-heading mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {currentStreak}
        </div>
        <div className="flex items-center justify-center gap-2 text-2xl">
          <span className="text-4xl">🔥</span>
          <span className="font-semibold">Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/20">
        <div>
          <div className="text-3xl font-bold font-heading mb-1">{longestStreak}</div>
          <div className="text-white/90 text-sm font-medium">Longest Streak</div>
        </div>
        <div>
          <div className="text-3xl font-bold font-heading mb-1">{totalReadings}</div>
          <div className="text-white/90 text-sm font-medium">Total Readings</div>
        </div>
      </div>

      {currentStreak > 0 && (
        <p className="mt-6 text-white/90 text-sm">
          {currentStreak >= 30
            ? '🎉 Amazing! A whole month of consistent reading!'
            : currentStreak >= 7
            ? "💪 You're building a strong habit!"
            : currentStreak >= 3
            ? "🌟 Great start! Keep going!"
            : "✨ You're on your way!"}
        </p>
      )}
    </div>
  );
}
