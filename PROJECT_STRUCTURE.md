# Project Skeleton & File Structure Guide

## 📌 Project Overview
**SpacECE Smart Parenting & Early Childhood Education (ECE) Portal** is a full-stack MERN application (MongoDB, Express.js, React, Node.js + Vite) built for interactive early childhood learning, parent monitoring, and educator analytics aligned with **NEP 2020** benchmarks.

---

## 🗂️ High-Level Root Directory Structure

```
SpacECE MongoDB/
├── backend/                  # Node.js + Express.js REST API Server
├── frontend/                 # React.js + Vite Single Page Application (SPA)
├── run.sh                    # Helper shell script to launch backend & frontend concurrently
├── spacece_games_list.csv    # Master catalogue of interactive game modules
├── MILESTONE_*.md            # Integration guides for NEP 2020 milestone tracking
└── README.md                 # Project introduction and quickstart documentation
```

---

## ⚙️ Backend Architecture (`/backend`)

The backend is built with **Node.js**, **Express.js**, and **Mongoose** (MongoDB Object Modeling).

```
backend/
├── middleware/               # Custom Express middleware
│   └── auth.js               # JWT verification & role-based route guard
├── models/                   # Mongoose Database Schemas (MongoDB Collections)
│   ├── User.js               # User accounts (Parents, Teachers, Admins)
│   ├── ChildProfile.js       # Child profiles, XP, level, mascot, & progress
│   ├── Score.js              # Activity scores, accuracy, time spent & domain metrics
│   ├── Literacy.js           # Phonics, stories, & reading game configs
│   ├── CognitiveSel.js       # Brain, Emotion, & SEL game configs
│   ├── Recommendation.js     # AI & Teacher activity recommendations
│   ├── Notification.js       # Parent & educator alert notifications
│   ├── NotificationTemplate.js # System notification presets
│   ├── Center.js             # Early Childhood Learning Centers
│   └── MilestoneAssessment.js # NEP 2020 milestone evaluation logs
├── routes/                   # Express API Endpoint Handlers
│   ├── auth.js               # User register, login, Google OAuth, password reset, email change
│   ├── children.js           # Child profile CRUD & progress award tracking
│   ├── scores.js             # Game score submission & analytics aggregations
│   ├── literacy.js           # Phonics, reading, & vocabulary game content API
│   ├── cognitiveSel.js       # Brain, emotion, & SEL content API
│   ├── numeracy.js           # Math, puzzle, & logic game content API
│   ├── milestones.js         # NEP 2020 milestone tracking & recommendations
│   ├── centers.js            # Learning center management
│   ├── notifications.js      # User notification retrieval & read status
│   ├── sessions.js           # Active session logs
│   └── users.js              # User management endpoints for admins/teachers
├── scripts/                  # Maintenance & utility scripts
├── tests/                    # Backend API unit & integration tests
├── utils/                    # Backend helper utilities
│   └── sendEmail.js          # Nodemailer email dispatch for verification & resets
├── seed_mongodb.js           # Seed script for initial games, sample data, & default accounts
└── server.js                 # Application entry point: Express app setup, DB connect, route mounting
```

### Key Backend Files Explained
- **`server.js`**: Initializes Express, connects to MongoDB via Mongoose, configures CORS/JSON parsers, mounts API routes under `/api/*`, and starts the HTTP server.
- **`middleware/auth.js`**: Extracts JWT from authorization headers, verifies authenticity, and attaches `req.user` for secure route protection.
- **`seed_mongodb.js`**: Populates MongoDB with standard early childhood learning games, default admin/teacher accounts, and benchmark datasets.

---

## 🎨 Frontend Architecture (`/frontend`)

The frontend is a modern React application bundled using **Vite**, styled with **Vanilla CSS & TailwindCSS**, and utilizing **Material-UI (MUI)** and **Framer Motion**.

```
frontend/
├── public/                   # Static public assets (favicons, images, logos)
├── src/
│   ├── api/                  # Axios HTTP client & API abstraction services
│   │   ├── client.js         # Axios instance configured with base URL & JWT interceptors
│   │   ├── authService.js    # Authentication API calls (login, register, email change)
│   │   ├── services.js       # Scores saving, progress awarding, & child API methods
│   │   ├── literacyService.js # Literacy & story API integration
│   │   ├── cognitiveSelService.js # Cognitive & SEL API integration
│   │   ├── userService.js    # User management & account operations
│   │   └── recommendationService.js # Recommendations API handling
│   ├── assets/               # Images, SVG graphics, logos, & media
│   ├── components/           # Reusable UI components
│   │   ├── animations/       # Floating elements, particle stars, confetti effects
│   │   ├── auth/             # Password inputs, Google sign-in buttons
│   │   ├── child/            # Learning journey roadmaps, recommendations, milestone panels
│   │   ├── common/           # Custom buttons, cards, modal dialogs
│   │   ├── layout/           # MainLayout, top navbar, sidebar navigation, bottom bar
│   │   ├── literacy/         # Interactive story readers, word builders
│   │   ├── shared/           # Logos, loading spinners, breadcrumbs
│   │   └── three/            # 3D interactive avatar rendering components
│   ├── context/              # React Context Providers for global state management
│   │   ├── AuthContext.jsx   # Authentication state, current user JWT, & role
│   │   ├── UserContext.jsx   # Active child profile, XP, streak, & progress state
│   │   ├── ChildProfileContext.jsx # Child profile management & context switching
│   │   ├── NotificationContext.jsx # Global alert notifications
│   │   └── ThemeContext.jsx  # Dark/Light theme mode state
│   ├── pages/                # Main view pages grouped by role & learning domain
│   │   ├── admin/            # Admin dashboard, user management, content control
│   │   ├── analytics/        # Parent & teacher analytics, radar charts, NEP 2020 curves
│   │   ├── auth/             # Login, register, role picker, terms & privacy pages
│   │   ├── child/            # Child dashboard, Adventure island, avatar builder, awards
│   │   ├── cognitive-sel/    # Brain World, Emotion World, Story Choice World games
│   │   ├── literacy/         # Reading World, Phonics Land, Vocabulary Zone, Language challenges
│   │   ├── numeracy/         # Math World, Math Mountain, Puzzle World, Logic Island
│   │   ├── parent/           # Parent dashboard, milestone tracking, child profiles
│   │   ├── public/           # Public landing page, about us, contact
│   │   ├── settings/         # Parent & teacher account settings
│   │   └── teacher/          # Teacher dashboard, student roster, classroom stats
│   ├── routes/               # Navigation & route security
│   │   ├── ProtectedRoute.jsx # Guard requiring active authentication
│   │   └── RoleRoute.jsx     # Guard enforcing role restrictions (Parent, Teacher, Admin)
│   ├── services/             # Analytics processing & NEP 2020 scoring engine
│   │   └── analyticsService.ts # Dynamic domain mapping, readiness score calculation
│   ├── utils/                # Helper utilities & localization
│   │   ├── helpers.js        # Formatting, date helpers, strength checks
│   │   └── translations.js   # Multilingual dictionary & translation helpers
│   ├── App.jsx               # Main React Application router configuration & route routes
│   ├── index.css             # Global design tokens, color variables, & keyframe animations
│   └── main.jsx              # Application bootstrap & Context Provider wrapper
├── index.html                # Entry HTML template
├── vite.config.js            # Vite build setup & dev server configuration
└── package.json              # Frontend npm dependencies & build scripts
```

---

## 🔄 End-to-End Data Flow

```
[User Action in UI]
       │
       ▼
[React Page / Component]
       │  (dispatches state update / context method)
       ▼
[React Context (AuthContext / UserContext)]
       │  (invokes API function)
       ▼
[Axios API Client (src/api/*)]
       │  (adds JWT header & sends HTTP request)
       ▼
[Express Server (backend/server.js)]
       │  (routes to backend/routes/*)
       ▼
[Auth Middleware (backend/middleware/auth.js)]
       │  (verifies JWT token)
       ▼
[Route Controller Handler]
       │  (queries / updates MongoDB via Mongoose)
       ▼
[Mongoose Model (backend/models/*)] ──► [MongoDB Database]
```

---

## 🎯 Summary of Core Features by Role

| User Role | Key Pages & Tools | Primary Responsibilities |
| :--- | :--- | :--- |
| **Child** | `/child/dashboard`, `/child/adventure`, `/math-world`, `/child/emotion-world`, `/child/reading-world` | Play interactive games across 5 domains, earn XP/stars/coins, customize avatar. |
| **Parent** | `/parent/dashboard`, `/parent/analytics`, `/settings/account` | Monitor progress, view NEP 2020 milestone reports, view AI recommendations. |
| **Teacher** | `/teacher/dashboard`, `/analytics/teacher` | Monitor classroom rosters, assign focus activities, track developmental gaps. |
| **Admin** | `/admin/dashboard` | Manage users, view platform metrics, configure thresholds & system content. |
