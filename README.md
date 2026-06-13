# SpacECE - Smart Parenting & Integrated Child Learning Platform

Welcome to **SpacECE**, a comprehensive, gamified early childhood learning platform built for parents, children, teachers, and admins. 

This repository consolidates and integrates multiple workspaces built by the SpacECE developer team, offering a responsive interface, premium glassmorphic visual aesthetics, and database integrations.

---

## 🚀 Key Features by Universe

### 1. Child Learning Portal
* **Math World** (Numeracy): Count fruits in the interactive garden, sort shapes by size, and solve comparison questions.
* **Puzzle World**: 3D geometric puzzles and color-matching matrices.
* **Number Adventure**: A visual map tracking math challenges.
* **Logic Island**: Interactive "Odd One Out" quizzes, logical sequence repeat patterns, and multiplication battles.
* **Reading World** (Literacy): Phonics puzzles, vocabulary spelling zones, and a reading dashboard.
* **Brain World** (Cognitive): Memory card matching and repeating sequence color tests.
* **Emotion World** (Emotional): Emoji mood check-ins, friendship empathy stories, and social choice scenarios.
* **Story Choice World**: Branching adventure stories with multiple endings depending on the choices made by the child.
* **Explore Map (Adventure Island)**: An interactive 2D island map plotting all learning zones. Accessible zones are unlocked dynamically as children earn XP.
* **Avatar Customizer**: Personalized child avatars using a wide list of explorer emojis.

### 2. Parent Dashboard & Analytics Portal
* **Child Profile Management**: Easily swap between multiple child profiles (up to 4 children) and edit their age group configurations.
* **Learning Analytics**: Visual charts mapping child progress across Math, Logic, Literacy, and Cognitive worlds.
* **Reports Generator**: Detailed performance summary metrics for parents to review.

### 3. Teacher & Admin Console
* **Class Trackers**: Manage active classes, review completion rates, and identify top performers.
* **System Operations**: Live feature flagging panel, audit logs, and templates for notification managers.

---

## 📁 Integrated Project Structure

```bash
├── functions/                     # Firebase Cloud Functions (index.js & package.json)
├── public/                        # Static assets, fallback logos
├── src/
│   ├── assets/                    # Shared image assets (logos, hero graphics)
│   ├── components/                # Shared layout shells & global animations
│   │   ├── layout/                # Sidebar.jsx, Layout.jsx, BottomNav.jsx (Child Portal)
│   │   └── animations/            # ConfettiEffect, StarAnimation, FloatingElements
│   ├── context/                   # Global state providers (UserContext.jsx, ThemeContext.jsx)
│   ├── hooks/                     # Custom hooks (useGameState.js, useDifficultyLadder.js)
│   ├── modules/                   # Intern-specific modules
│   │   ├── aditya/                # Parent Dashboard views & Reports pages
│   │   ├── gyanendra/             # Multi-role Auth, Switch Child & Admin consoles
│   │   ├── harshika/              # Phonics, stories, and Language Challenges
│   │   ├── pratiush/              # Achievements, themes, Hindi translations & components
│   │   └── yogashwar/             # Brain, Emotions, Creativity, and Story Choice games
│   ├── pages/                     # Child numeracy pages (Home, MathWorld, LogicIsland, etc.)
│   ├── theme/                     # Global color tokens & styling configs
│   ├── App.jsx                    # Root router registering all universe views
│   └── main.jsx                   # React application mount script
├── firestore.rules                # Unified database security access rules
├── vite.config.js                 # Local dev server configs
└── package.json                   # Project packages & builder scripts
```

---

## 🛠️ Installation & Execution

### 1. Setup Environment
Ensure that you have [Node.js](https://nodejs.org/) installed, and create a local `.env` file at the root:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_DEV_MODE="true"
```

### 2. Install Dependencies
Run the package installer:
```bash
npm install
```

### 3. Spin Up Development Server
Launch the local Vite server:
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### 4. Build Production Bundle
To compile the application into optimized static assets (`dist/`):
```bash
npm run build
```

---

## 🔍 Codebase Quality & Verification
* **ESLint Purity**: Run `npx eslint "src/**/*.{js,jsx}"` to verify that all code compiles cleanly with 0 warnings.
* **Component Purity**: The mathematical games utilize deterministic, idempotent shuffling algorithms to maintain pure React rendering cycles.
* **Context Bridging**: A global unified context bridges multi-intern states securely without duplicate Firebase app initializations.
