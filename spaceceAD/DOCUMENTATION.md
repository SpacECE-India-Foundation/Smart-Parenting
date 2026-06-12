# SpaceECE - Platform Documentation

This document contains the Module Documentation, API Reference, and Test Report for the SpaceECE platform.

---

## 1. Module Documentation

SpaceECE is structured around a centralized State & Database Simulation layer that serves data to role-based page views.

### File Architecture

```
src/
├── App.tsx                     # Core Application Shell & State Router
├── index.css                   # Premium CSS Design System (HSL tokens, Animations, Print CSS)
├── main.tsx                    # React Dom Bootstrapper
├── assets/                     # SVG icons & static images
├── components/
│   └── Navbar.tsx              # Role switcher & profile selector navigation header
├── services/
│   └── firebaseSimulator.ts    # Firestore & Cloud Functions simulation layer
└── pages/
    ├── ChildProgress.tsx       # Child-facing rings, streaks, and stars charts
    ├── LearningMap.tsx         # Interactive learning path with SVG node lines
    ├── ParentDashboard.tsx     # Parent analytics (Recharts Radar, AI focus lists, alerts)
    ├── TeacherDashboard.tsx    # Class analytical rosters, CSV exporter, module assignments
    └── ReportsPage.tsx         # Developmental curves, cohort bars, and NEP milestone maps
```

### Component Details

#### 1. State Router (`App.tsx`)
Routes views based on the active role (`child`, `parent`, `teacher`, `admin`) and tab selections. When assessments or configurations are added in the Admin panel, this module triggers a virtual state re-render to keep all dashboards synchronized.

#### 2. Child Progress View (`ChildProgress.tsx`)
Provides kids with gamified visual feedback:
- **Circular Progress SVG Rings**: Computes circumference math dynamically to render HSL neon indicators.
- **Star Grid**: Plots a 30-day matrix displaying icons for days with high assessment averages.
- **Achievements Cabinet**: Unlocks dynamic badges based on domain benchmarks and learning streaks.

#### 3. Learning Map (`LearningMap.tsx`)
Coordinates absolute coordinate mapping over a curved path SVG connector. Nodes represent zones:
- Glowing **green** rings identify strength topics (averages >= 80%).
- Glowing **amber** outlines represent gap areas (accuracy < 60% consecutively).
- Displays drawers logging score history for individual clicked nodes.

#### 4. Parent Dashboard (`ParentDashboard.tsx`)
Focuses on student diagnostic support:
- **Recharts Radar Chart**: Highlights domain-wide strengths and areas for focus.
- **Checklist Action Cards**: Allows parents to check off recommended remedial tasks, mutating states instantly.
- **Engagement Alerters**: Flags reading delays or login gaps.

#### 5. Teacher Panel (`TeacherDashboard.tsx`)
Ms. Sarah's administration station:
- **Assignment Dispatcher**: Assigns learning games (e.g. *Rhyme Builder*) to individual students or the class, creating recommendation flags.
- **Roster table**: Displays real-time grade cards, milestones, and flags.
- **CSV Exporter**: Encourages teachers to export marks in Excel-friendly format.

---

## 2. API Documentation

Our platform mocks Firestore database collections inside `localStorage`.

### Data Schemas

1. **`assessments` Collection**
   ```typescript
   interface Assessment {
     id: string;
     child_id: string;
     domain: 'Literacy' | 'Numeracy' | 'Cognitive' | 'Creativity' | 'Emotional';
     activity_id: string;
     activity_name: string;
     score: number;       // 0 - 100
     accuracy: number;    // 0 - 100
     time: number;        // seconds
     attempts: number;
     date: string;        // YYYY-MM-DD
   }
   ```

2. **`ai_analysis` Collection**
   ```typescript
   interface AIAnalysis {
     child_id: string;
     reading_difficulty: boolean;
     numeracy_gap: boolean;
     learning_delay_flag: boolean;
     strength_areas: string[];
     last_updated: string;
   }
   ```

3. **`recommendations` Collection**
   ```typescript
   interface Recommendation {
     id: string;
     child_id: string;
     activity_id: string;
     activity_name: string;
     domain: string;
     reason: string;
     priority: 'High' | 'Medium' | 'Low';
     generated_date: string;
     completed: boolean;
   }
   ```

4. **`reports` Collection**
   ```typescript
   interface AIReport {
     id: string;
     child_id: string;
     report_date: string;
     domain_scores: Record<string, number>;
     time_spent: Record<string, number>; // domain -> minutes
     ai_flags: string[];
     recommendations: string[];
     school_readiness_score: number;
   }
   ```

### Core Functions Reference

#### `addAssessment(assessment: Omit<Assessment, 'id'>): Assessment`
Writes a new assessment document, updates streaks, and triggers downstream AI Gap audits.

#### `runAiGapDetection(childId: string): void`
Reads assessments chronologically. If a child has `< cutoff` accuracy (default: 60%) in N consecutive sessions (default: 3) in the Literacy/Numeracy domain, it flags the child and creates remedial recommendations.

#### `calculateSchoolReadinessScore(childId: string): number`
Returns a composite metric (0 to 100) based on average score of all 5 domains, consistency, and session counts.

#### `generateWeeklyReport(childId: string): AIReport`
Calculates weekly averages, checks login gaps, maps progress against benchmarks, and drafts action recommendations.

---

## 3. Test Report

### Automated Build Logs
- Compiler outcome: **SUCCESSFUL**
- Runtime environment: Node v22.12.0
- Bundler command: `tsc -b && vite build`
- Build Output:
  ```
  dist/index.html                   0.72 kB
  dist/assets/index-BlBZ3lLQ.css    9.56 kB
  dist/assets/index-P2gpmAhC.js   682.52 kB
  ✓ built in 267ms
  ```

### Manual Verification Protocols

| Test Case | Steps | Expected Outcome | Status |
|---|---|---|---|
| **AI Gap Detection** | 1. Go to Admin Console.<br>2. Log 3 consecutive Literacy assessments with accuracy=45% for Leo.<br>3. Switch to Parent view. | Red `Literacy/Phonics Fluency Alert` banner appears.<br>`Phonics Safari` action card is generated. | **PASSED** |
| **School Readiness Index** | 1. Add high score Numeracy logs.<br>2. Check readiness summary cards. | Readiness metric rises dynamically. | **PASSED** |
| **Activity Assignment** | 1. In Teacher view, assign `Rhyme Builder` to Leo.<br>2. Swap to Leo's Parent view. | Custom assignment card displays. | **PASSED** |
| **Data Export** | 1. In Teacher view, click `Export CSV Records`. | A file named `Class_Analytics_Export_[date].csv` downloads. | **PASSED** |
| **Report Generation** | 1. In Admin panel, click `Run Function` under weekly report triggers.<br>2. Swap to Developmental Reports view. | A new weekly report ending with today's date displays. | **PASSED** |
| **PDF Format printing** | 1. Click `Print / PDF Weekly Report` in Parent view. | Clean, isolated grid page matches native document prints. | **PASSED** |
