# Bible Reading Plan & Study Tracker

A beautiful, peaceful web application for building consistent Bible reading habits with daily plans, progress tracking, and study focus features.

## Features

- 📖 **Multiple Reading Plans** - Choose from pre-built plans (New Testament in 90 Days, Psalms & Proverbs Monthly)
- 🔥 **Streak Tracking** - Build motivation with daily streak counters
- ✅ **Progress Tracking** - Visual progress indicators and completion percentages
- 📝 **Personal Notes** - Add reflections and thoughts for each reading
- 🏷️ **Study Focus Tags** - Track themes and topics in your readings
- 💾 **Local Storage** - All data stored securely in your browser
- 📱 **Responsive Design** - Beautiful experience on mobile and desktop
- ♿ **Accessible** - WCAG 2.1 AA compliant with keyboard navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Storage**: Browser LocalStorage

## Design Philosophy

The app features a warm, peaceful aesthetic inspired by sacred texts and spiritual reflection:

- **Colors**: Warm earth tones (Sacred Gold, Deep Earth, Spiritual Blue) on a parchment background
- **Typography**: Crimson Pro for headings, Plus Jakarta Sans for UI, Lora for scripture references
- **UX**: Generous whitespace, gentle animations, encouraging feedback
- **Accessibility**: High contrast ratios, keyboard navigation, screen reader support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bible-reading-plan
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Usage

### First Time Setup

1. Launch the app and you'll be greeted with the plan selector
2. Choose a reading plan that matches your goals (90 days, monthly, etc.)
3. Start reading today's passage

### Daily Use

1. Open the app to see today's reading
2. Complete the reading and mark it complete with the checkbox
3. Watch your streak grow!
4. Optionally add personal notes and reflections

### Features

- **Today Page**: View current day's reading, mark complete, add notes
- **Plans Page**: Switch reading plans or preview available plans
- **Progress Page**: See your streak, completion percentage, and statistics
- **Settings Page**: Export your data or reset progress

## Data Storage

All data is stored locally in your browser using LocalStorage:

- **Reading Progress**: Completed readings, streaks, statistics
- **Notes**: Personal reflections for each reading
- **Study Focus**: Selected tags and themes

No data is sent to external servers. Your reading journey is private and stays on your device.

## Customization

### Adding New Reading Plans

Edit `data/plans.json` to add new plans:

```json
{
  "id": "custom-plan",
  "name": "Your Plan Name",
  "description": "Plan description",
  "type": "custom",
  "totalDays": 30,
  "estimatedDuration": "1 month",
  "readings": [
    {
      "id": "day-1",
      "day": 1,
      "passages": ["Genesis 1-3"],
      "studyTags": ["Creation", "Beginnings"]
    }
  ]
}
```

### Customizing Study Tags

Edit `data/studyTags.json` to modify available tags:

```json
{
  "tags": [
    { "id": "custom", "name": "Custom Tag", "color": "blue" }
  ]
}
```

### Theme Customization

Modify colors in `tailwind.config.ts`:

```typescript
colors: {
  sacredGold: '#C4941D',
  deepEarth: '#5A4A3B',
  // ... add your custom colors
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (no environment variables required)

The app works entirely client-side, so no server configuration is needed.

### Other Platforms

Build the app:
```bash
npm run build
```

The static files will be in `.next/` and can be deployed to any static hosting service.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

LocalStorage support is required.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Design inspired by sacred manuscripts and spiritual reflection
- Built with modern web technologies for a peaceful, focused experience
- Created to help build consistent Bible reading habits

## Support

For issues or questions:
1. Check existing issues in the repository
2. Create a new issue with details about your problem
3. Include browser version and steps to reproduce

---

**May this app help you build a consistent, meaningful Bible reading habit.** 📖✨
