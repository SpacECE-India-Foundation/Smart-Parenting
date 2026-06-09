# Numeracy & Logical Thinking Universe
## Module Documentation — SpacECE Platform
**Module Owner:** Ayush | **Project:** SpacECE India Foundation | **Date:** June 2026

---

## 1. Project Overview

SpacECE is an AI-powered early childhood education platform for children aged 1–10 in India. The platform delivers learning through interactive games while continuously measuring development across five domains: Literacy, Numeracy, Cognition, Creativity, and Emotional Intelligence.

The **Numeracy & Logical Thinking Universe** (Ayush's module) consists of four interactive game pages teaching numbers, counting, arithmetic, spatial reasoning, pattern recognition, and logical thinking — all connected to Firebase.

**Tech Stack:** React 19 + Vite, Three.js (R3F), Framer Motion, Tailwind CSS, Firebase (Auth + Firestore + Analytics)

---

## 2. Module File Structure

```
src/
├── pages/
│   ├── MathWorld.jsx          → /math-world
│   ├── PuzzleWorld.jsx        → /puzzle-world
│   ├── NumberAdventure.jsx    → /number-adventure
│   └── LogicIsland.jsx        → /logic-island
│
├── components/
│   ├── three/
│   │   ├── ThreeDPuzzle.jsx          (3D shape matching — R3F)
│   │   └── ThreeDAdventureMap.jsx    (3D floating island map — R3F)
│   └── common/
│       ├── NumberArray.jsx           (Visual dot arrays for multiplication)
│       ├── GameCard.jsx              (Reusable game card)
│       └── ScoreDisplay.jsx          (Score/lives/streak bar)
│
├── hooks/
│   ├── useGameState.js               (Lives, score, streak, level)
│   └── useDifficultyLadder.js        (Auto-advance Level 1→5)
│
├── context/
│   ├── UserContext.jsx               (Firebase Auth + profile state)
│   └── ThemeContext.jsx              (Light/Dark/Seasonal themes)
│
└── firebase/
    ├── config.js                     (Firebase app init)
    └── services.js                   (All Firestore CRUD functions)
```

---

## 3. Page Flow

### 3.1 Math World (`/math-world`)

```
App Load → Firebase Anonymous Auth → Read users/{uid}

/math-world
  ├── Age filter: All / 1–3 / 4–6 / 7–10
  ├── Fetch math_games from Firestore (fallback: static data)
  └── User clicks game card → COUNTING GAME
        ├── N emoji objects shown on screen
        ├── User picks correct count from 4 options
        ├── CORRECT → score += 15×level, streak++
        ├── WRONG   → lives--, streak reset
        ├── lives=0 → isComplete=true
        └── ON COMPLETE:
              saveNumeracyScore() → numeracy_scores collection
              awardProgress()    → users.xp, stars, coins updated
              refreshProfile()   → Header/Sidebar update live
```

### 3.2 Puzzle World (`/puzzle-world`)

```
/puzzle-world
  ├── Timer Mode toggle (ON/OFF)
  ├── Fetch puzzle_games from Firestore (fallback: static)
  │
  ├── THREE.JS 3D PUZZLE (always visible)
  │     ├── 6 rotating 3D shapes: Cube, Sphere, Cone, Torus, Cylinder, Pyramid
  │     ├── Target shape shown at top (glowing, spinning)
  │     ├── 3 option shapes at bottom
  │     ├── User clicks matching name
  │     │     CORRECT → score += 25×level, perfectStreak++
  │     │               perfectStreak=3 → Level UP (max Level 5)
  │     │     WRONG   → streak resets
  │     └── OrbitControls: user can rotate/zoom camera
  │
  └── Game card click → 2D SHAPE MATCH GAME
        ├── Color shapes displayed
        ├── User matches target
        └── ON COMPLETE → saveNumeracyScore() + awardProgress()
```

### 3.3 Number Adventure (`/number-adventure`)

```
/number-adventure
  ├── Reads users.xp from Firestore (UserContext)
  ├── XP progress bar at top
  │
  ├── THREE.JS 3D ADVENTURE MAP
  │     ├── Star field background
  │     ├── 6 floating island meshes
  │     ├── Gold dotted paths between islands
  │     ├── XP unlock system:
  │     │     Counting Meadow  → 0 XP   (default unlocked)
  │     │     Number Forest    → 50 XP
  │     │     Toy Town         → 120 XP
  │     │     Ocean Depths     → 200 XP
  │     │     Sky Castle       → 350 XP
  │     │     Space Station    → 500 XP
  │     ├── Click unlocked island → tooltip + setActiveZone()
  │     └── Camera: autoRotate + OrbitControls
  │
  ├── Zone cards list (scrollable)
  │
  ├── Zone click → COUNT TOYS GAME
  │     ├── Toy emojis appear one by one
  │     ├── User counts and selects answer
  │     └── ON COMPLETE → saveNumeracyScore() + awardProgress()
  │
  └── Interactive Number Line 0–10
        └── Hover → dot highlights and scales
```

### 3.4 Logic Island (`/logic-island`)

```
/logic-island
  ├── Difficulty filter: All / Easy / Medium / Hard
  ├── Fetch logic_games from Firestore (fallback: static)
  ├── Difficulty Progression bar (Beginner → Genius)
  │
  ├── "Multiply Quest" card → MULTIPLICATION QUEST GAME
  │     ├── Question: "What is 3 × 4?" shown
  │     ├── VISUAL DOT ARRAY:
  │     │     rows × cols animated dots reveal one by one
  │     │     e.g. 3 rows of 4 dots = 12 total
  │     ├── Hide/Show toggle (hint)
  │     ├── 15-second countdown timer
  │     ├── CORRECT → score += 30×level, perfectStreak++
  │     │             3 perfects → Level UP (max Level 5)
  │     ├── Timer hits 0 → auto wrong
  │     └── ON COMPLETE → saveNumeracyScore() + awardProgress()
  │
  └── Other card → PATTERN SPOTTER GAME
        ├── Sequence shown: 🔴 🔵 🔴 🔵 🔴 [?]
        ├── User picks what comes next from 4 options
        └── ON COMPLETE → saveNumeracyScore() + awardProgress()
```

---

## 4. Firebase Database Schema

### Collection: `users`

| Field | Type | Description | Example |
|---|---|---|---|
| uid | string (doc ID) | Firebase Auth UID — Primary Key | "abc123xyz" |
| name | string | Child display name | "Ayush" |
| avatar | string | Selected avatar character ID | "Alex" |
| coins | number | Total coins earned | 50 |
| xp | number | Total experience points | 180 |
| stars | number | Total stars earned | 12 |
| badges | number | Total badges unlocked | 3 |
| dayStreak | number | Consecutive login days | 7 |
| level | number | Overall player level | 2 |
| language | string | Preferred language | "English" |
| lastLogin | timestamp | Last active time | Timestamp |
| createdAt | timestamp | Account creation time | Timestamp |
| progress.mathWorld | number | XP earned in Math World | 120 |
| progress.puzzleWorld | number | XP in Puzzle World | 60 |
| progress.numberAdventure | number | XP in Number Adventure | 40 |
| progress.logicIsland | number | XP in Logic Island | 20 |

**Relationships:** uid → referenced by numeracy_scores.child_id

---

### Collection: `numeracy_scores`

One document per game session. Written when game completes.

| Field | Type | Description | Example |
|---|---|---|---|
| id | string (auto ID) | Auto-generated doc ID | "sc_abc123" |
| child_id | string | FK → users.uid | "abc123xyz" |
| game_id | string | ID of game played | "counting-1-3" |
| score | number | Points scored | 135 |
| level | number | Difficulty level reached | 2 |
| time_taken | number | Seconds in game | 45 |
| date | timestamp | Server timestamp | Timestamp |

**Relationships:** child_id → users.uid (many scores : one user)

---

### Collection: `math_games`

| Field | Type | Description | Example |
|---|---|---|---|
| id | string (doc ID) | Unique game ID | "counting-1-3" |
| title | string | Display title | "Counting Fun" |
| description | string | Short description | "Count objects!" |
| emoji | string | Display emoji | "🐻" |
| type | string | counting / matching / arithmetic / ordering | "counting" |
| age_group | string | 1-3 / 4-6 / 7-10 | "1-3" |
| difficulty | string | Easy / Medium / Hard | "Easy" |
| question_set | array | Array of {question, answer, options} | [...] |
| gradient | string | Tailwind gradient class | "from-[#FF9A56]..." |

---

### Collection: `puzzle_games`

| Field | Type | Description | Example |
|---|---|---|---|
| id | string (doc ID) | Unique puzzle ID | "shape-match" |
| title | string | Display title | "Shape Matching" |
| description | string | Short description | "Match shapes!" |
| emoji | string | Display emoji | "🔷" |
| shape_type | string | 2D / 3D | "3D" |
| age_group | string | 1-3 / 4-6 / 7-10 | "1-3" |
| difficulty | string | Easy / Medium / Hard | "Easy" |
| pieces_url | string | Firebase Storage URL | "gs://..." |
| gradient | string | Tailwind gradient class | "from-[#2EC4B6]..." |

---

### Collection: `logic_games`

| Field | Type | Description | Example |
|---|---|---|---|
| id | string (doc ID) | Unique game ID | "pattern-recognition" |
| title | string | Display title | "Pattern Spotter" |
| description | string | Short description | "Find the pattern!" |
| emoji | string | Display emoji | "🔍" |
| pattern_data | array | Sequence items | ["🔴","🔵","🔴"] |
| maze_layout | map | {rows, cols, walls[]} | {rows:5,cols:5,...} |
| age_group | string | 1-3 / 4-6 / 7-10 | "4-6" |
| difficulty | string | Easy / Medium / Hard | "Medium" |
| gradient | string | Tailwind gradient class | "from-[#7C4DFF]..." |

---

### Collections Belonging to Other Interns

| Collection | Owner | Status |
|---|---|---|
| child_profiles | Pratiush | ❌ Not created |
| achievements | Pratiush | ❌ Not created |
| rewards | Pratiush | ❌ Not created |
| assessments | Aditya | ❌ Not created |
| recommendations | Aditya | ❌ Not created |

---

## 5. ER Diagram (Relationships)

```
users (1) ──────────────────< numeracy_scores (many)
  uid                           child_id → users.uid

math_games (1) ─────────────< numeracy_scores (many)
  id                            game_id → math_games.id

puzzle_games (1) ───────────< numeracy_scores (many)
  id                            game_id → puzzle_games.id

logic_games (1) ────────────< numeracy_scores (many)
  id                            game_id → logic_games.id

users (1) ──────────────────< achievements (many)  [Pratiush]
  uid                           child_id → users.uid
```

---

## 6. Completion Status

### ✅ Done

| Item | Notes |
|---|---|
| Math World page | Counting game, age filter, Firebase load |
| Puzzle World page | 3D shape puzzle (Three.js), 2D shape match |
| Number Adventure page | 3D map (Three.js), count toys, number line |
| Logic Island page | Pattern game, multiplication quest |
| Three.js 3D Puzzle | Rotating shapes, OrbitControls, difficulty ladder |
| Three.js 3D Map | Floating islands, XP unlock, star field, auto-rotate |
| Visual Number Arrays | Animated dot grid for multiplication |
| Difficulty Ladder hook | Auto Level 1→5 on 3 consecutive perfects |
| Firebase Auth | Anonymous sign-in on first load |
| numeracy_scores writes | All 4 pages write on game complete |
| XP / Stars / Coins award | Written to Firestore after every session |
| Module progress tracking | users.progress.{module} incremented |
| Theme System | Light / Dark / System / Seasonal (Diwali, Holi) |
| Sidebar, Header, Mascot | All read live profile data from Firestore |
| Settings page | Language, theme, sign out — Firebase connected |
| Avatar page | 12 characters, accessories, Firebase save |

### ⚠️ Partially Done

| Item | What's Missing |
|---|---|
| math_games data | Collection exists but needs seeding in Firebase Console |
| puzzle_games data | Same — needs seeding |
| logic_games data | Same — needs seeding |
| Day Streak logic | Field exists in users but no daily-login increment |
| Badge unlock trigger | UI shows badges but no write to achievements collection |
| Home recommendations | Hardcoded — needs recommendations collection (Aditya) |

### ❌ Not Done (Other Interns)

| Item | Owner |
|---|---|
| child_profiles collection | Pratiush |
| achievements collection | Pratiush |
| rewards collection | Pratiush |
| Login / Register page | Gyanendra |
| Parent / Teacher Dashboard | Aditya |
| Push to GitHub | Ayush (pending) |

---

## 7. Expected Timeline (Max 5 Days)

| Task | Days | Target |
|---|---|---|
| Seed Firestore game collections | 0.5 | Day 1 |
| Minor bug fixes (6 items) | 1 | Day 1–2 |
| Day streak logic | 0.5 | Day 2 |
| GitHub push (feature branch) | 0.5 | Day 2 |
| Badge unlock trigger | 1 | Day 3 |
| Integration testing with team | 1 | Day 4 |
| Final review + doc polish | 0.5 | Day 5 |
| **TOTAL** | **~5 days** | **Day 5** |

---

## 8. Known Bugs (Minor Fixes)

| # | Bug | File | Fix |
|---|---|---|---|
| 1 | Unused import in Mascot | Mascot.jsx | Remove useUser import |
| 2 | 3D puzzle has no round limit | ThreeDPuzzle.jsx | Add 10-round limit |
| 3 | Zone click maps to wrong game | NumberAdventure.jsx | Map zone IDs to game components |
| 4 | Analytics async may fail | config.js | Wrap in try/catch |
| 5 | 3D canvas overflow on mobile | ThreeDPuzzle.jsx | Set height:280px on mobile |
| 6 | refreshProfile not called after 3D puzzle | ThreeDPuzzle.jsx | Pass user + refreshProfile as props |

---

## 9. GitHub Push Checklist

- [ ] .env is in .gitignore ✅
- [ ] No hardcoded Firebase credentials ✅
- [ ] npm run build passes with no errors
- [ ] Pages tested: mobile 375px + desktop 1280px
- [ ] Commit: `feat(numeracy): complete module with Three.js + Firebase`
- [ ] Branch: `feature/ayush-numeracy-module`

---

## 10. Data Flow Summary

```
User plays game
    ↓
useGameState hook tracks score/lives/streak locally
    ↓
isComplete = true (lives=0 or rounds done)
    ↓
saveNumeracyScore() → writes to numeracy_scores/{auto-id}
    ↓
awardProgress()    → increments users/{uid}.xp, stars, coins, progress.{module}
    ↓
refreshProfile()   → re-fetches users/{uid} from Firestore
    ↓
UserContext updates → Header stats + Sidebar coin badge update live
```

---

*SpacECE Intern Documentation | Ayush — Numeracy Module | June 2026 | Confidential*
