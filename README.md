# Speech Path Clinic - Habit Tracker Idle Game

A cozy, cottagecore-themed habit tracker disguised as an idle clinic management game. Complete real-world habits to earn coins, spend them on upgrades for your pixel art clinic, and watch your little clinic grow and thrive.

## Features

- **Habit Tracking**: Add habits with coin rewards (1-5) and recurrence (daily/weekly/one-off)
- **Streak System**: Build streaks for bonus rewards at milestones (7, 14, 30, 100 days)
- **Idle Rewards**: Earn coins passively while away (up to 12 hours)
- **Shop**: Purchase assessments, tools, decor, staff, and expansions
- **Clinic View**: Watch your clinic grow with PixiJS rendering
- **Import/Export**: Backup and restore your progress

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS v4 with cottagecore theme
- **2D Rendering**: PixiJS v8
- **Data Storage**: JSON files (no database needed)
- **Containerization**: Docker

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Production (Docker)

```bash
# Build and run
docker compose up -d

# Open http://localhost:3000
```

## Project Structure

```
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── server/         # Server-only utilities
│   │   ├── game/           # Game logic and types
│   │   └── pixi/           # PixiJS renderer
│   └── routes/             # SvelteKit pages
├── config/                 # Game configuration (upgrades, settings)
├── data/                   # User save data (gitignored)
└── static/                 # Static assets
```

## Configuration

### `config/settings.json`
Game balance settings for idle rewards and habits.

### `config/upgrades.json`
Available shop items with costs, effects, and positions.

### `config/streakRewards.json`
Streak milestone bonuses.

## Data

All user data is stored in `data/save.json`. The app automatically:
- Creates a default save on first run
- Backs up before each save (keeps last 3)
- Validates imports before applying

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CONFIG_DIR` | `./config` | Path to config files |
| `DATA_DIR` | `./data` | Path to save data |
| `ORIGIN` | `http://localhost:3000` | App origin for CORS |

## License

MIT
