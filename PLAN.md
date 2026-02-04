# Speech Path Clinic - Habit Tracker Idle Game

## Overview
A cottagecore-themed habit tracker disguised as an idle clinic management game. Complete real-world habits to earn coins, spend them on clinic upgrades, and watch your pixel art clinic grow.

## Tech Stack
- **Framework**: SvelteKit (full-stack) with Node adapter
- **Data Storage**: JSON files (config + save)
- **2D Rendering**: PixiJS (manual integration, no wrapper)
- **Styling**: Tailwind CSS with cottagecore theme
- **Containerization**: Docker (single container, port 3000)

---

## Project Structure

```
/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/           # Button, Card, Modal, CoinDisplay
│   │   │   ├── habits/       # HabitCard, HabitForm
│   │   │   ├── shop/         # UpgradeCard, CategoryTabs
│   │   │   └── clinic/       # ClinicView (PixiJS wrapper)
│   │   │
│   │   ├── stores/
│   │   │   └── game.svelte.ts    # Svelte 5 runes state
│   │   │
│   │   ├── server/               # Server-only ($lib/server)
│   │   │   ├── save-manager.ts   # JSON read/write/backup
│   │   │   ├── config-loader.ts  # Load config files
│   │   │   └── idle-calculator.ts
│   │   │
│   │   ├── game/
│   │   │   ├── types.ts          # TypeScript interfaces
│   │   │   ├── streak.ts         # Streak calculation
│   │   │   └── coins.ts          # Coin rewards with multipliers
│   │   │
│   │   └── pixi/
│   │       └── clinic-renderer.ts  # PixiJS abstraction
│   │
│   ├── routes/
│   │   ├── +layout.svelte        # Nav, theme, idle reward modal
│   │   ├── +layout.server.ts     # Load save + config + idle calc
│   │   ├── +page.svelte          # Dashboard (today's habits + clinic)
│   │   ├── habits/
│   │   │   ├── +page.svelte      # Habit management
│   │   │   └── +page.server.ts   # Form actions: create/complete/delete
│   │   ├── shop/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts   # Form action: purchase
│   │   ├── clinic/
│   │   │   └── +page.svelte      # Full-screen clinic view
│   │   ├── settings/
│   │   │   ├── +page.svelte      # Import/Export/Reset
│   │   │   └── +page.server.ts
│   │   └── api/
│   │       ├── export/+server.ts # GET - download save.json
│   │       └── health/+server.ts # GET - health check
│   │
│   ├── app.html
│   └── app.css                   # Tailwind + cottagecore tokens
│
├── static/
│   └── sprites/                  # PixiJS sprites (placeholders initially)
│
├── config/                       # Shipped with app (read-only)
│   ├── upgrades.json
│   ├── streakRewards.json
│   └── settings.json
│
├── svelte.config.js
├── tailwind.config.js
├── vite.config.ts
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## Key Architecture Decisions

### 1. State Management: Svelte 5 Runes
Use `$state()` and `$derived()` runes with context API for SSR-safe state:

```typescript
// game.svelte.ts
export function createGameState(initial: SaveData) {
  let coins = $state(initial.gameState.coins);
  let habits = $state(initial.habits);
  // ...
  return {
    get coins() { return coins; },
    addCoins(n: number) { coins += n; },
    // ...
  };
}
```

### 2. Data Flow: Form Actions + Server Load
- **+layout.server.ts**: Loads config + save, calculates idle rewards, passes to client
- **Form Actions**: Handle habit CRUD, shop purchases, import/reset
- **REST**: Only for export (triggers file download)

### 3. PixiJS: Manual Integration
- Wrap PixiJS Application in a class (`ClinicRenderer`)
- Dynamic import to avoid SSR issues
- Svelte component manages lifecycle (init on mount, destroy on unmount)
- Placeholder rectangles for missing sprites

### 4. File Paths
- **Config**: `process.env.CONFIG_PATH || './config'`
- **Save**: `process.env.SAVE_PATH || './data/save.json'`
- **Backups**: `./data/backups/` (rotate last 3)

---

## Implementation Phases

### Phase 1: Project Setup
1. `npm create svelte@latest` with TypeScript
2. Install dependencies: `tailwindcss`, `pixi.js`, `uuid`
3. Configure `adapter-node` in `svelte.config.js`
4. Set up Tailwind with cottagecore theme colors
5. Create config JSON files from spec
6. Create type definitions (`$lib/game/types.ts`)

### Phase 2: Server Infrastructure
1. Implement `save-manager.ts` (load/write/backup/validate)
2. Implement `config-loader.ts` (with memory caching)
3. Implement `idle-calculator.ts`
4. Create `+layout.server.ts` for central data loading
5. Create health check endpoint

### Phase 3: Core UI & Habits
1. Build base components: Button, Card, Modal, CoinDisplay
2. Create `+layout.svelte` with bottom nav and coin header
3. Implement habits page with form actions
4. Add streak calculation logic
5. Coin award animation on completion

### Phase 4: Shop System
1. Shop page with category tabs
2. UpgradeCard component (available vs owned states)
3. Purchase form action with validation
4. Success animation/feedback

### Phase 5: Clinic View (PixiJS)
1. Create `ClinicRenderer` class
2. Load base clinic background
3. Render purchased upgrades at config positions
4. Placeholder rectangles for missing sprites
5. Basic idle animations (cat sleeping, plants swaying)

### Phase 6: Settings & Polish
1. Export endpoint (download JSON)
2. Import upload with validation
3. Reset with confirmation modal
4. Idle rewards modal ("While you were away...")
5. Streak celebration animations

### Phase 7: Docker & Deploy
1. Write Dockerfile (multi-stage build)
2. Write docker-compose.yml with volume
3. Test container build and data persistence
4. Document deployment

---

## Files to Modify/Create

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `svelte.config.js` | Node adapter config |
| `vite.config.ts` | PixiJS optimization |
| `tailwind.config.js` | Cottagecore theme |
| `src/app.css` | Global styles |
| `src/lib/game/types.ts` | All TypeScript interfaces |
| `src/lib/server/save-manager.ts` | JSON persistence |
| `src/lib/server/config-loader.ts` | Config loading |
| `src/lib/server/idle-calculator.ts` | Offline rewards |
| `src/lib/stores/game.svelte.ts` | Client state |
| `src/lib/pixi/clinic-renderer.ts` | PixiJS wrapper |
| `src/routes/+layout.server.ts` | Server data loading |
| `src/routes/+layout.svelte` | App shell |
| `src/routes/habits/+page.server.ts` | Habit form actions |
| `config/upgrades.json` | Upgrade definitions |
| `config/settings.json` | Game balance |
| `Dockerfile` | Container build |
| `docker-compose.yml` | Deployment |

---

## Potential Issues & Mitigations

1. **Race conditions (multiple tabs)**: Add warning/detection for multiple tabs open
2. **PixiJS bundle size (~500KB)**: Use dynamic import, lazy load clinic view
3. **Offline reward exploits**: Add sanity checks on elapsed time
4. **No auth**: Document single-user assumption; acceptable for personal use

---

## Verification Plan

1. **Habits**: Create habit, complete it, verify streak increments, verify coins awarded
2. **Shop**: Purchase upgrade, verify coins deducted, verify appears in clinic
3. **Idle**: Close app, wait 5 min, reopen, verify "while you were away" shows correct coins
4. **Export/Import**: Export save, modify manually, import, verify changes reflect
5. **Docker**: Build container, create habits, stop container, restart, verify data persists
6. **Mobile**: Test on phone-sized viewport, verify bottom nav works, touch targets adequate

---

## Notes

- Start with placeholder sprites (colored rectangles with labels)
- Keep idle rewards modest to encourage habit completion over AFK farming
- All config changes take effect on app restart (no hot reload needed)
- Save file is human-readable JSON for easy debugging
