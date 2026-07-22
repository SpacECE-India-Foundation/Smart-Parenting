# SpacECE - Complete Website Workflow & End-User Manual

**Project Name:** SpacECE (Smart Parenting & Integrated Child Learning Platform)  
**Document Version:** 3.5.0 (Live Master Production Edition)  
**Target Audience:** Children (Learners), Parents, Educators, System Administrators, QA Testers, and Support Staff  
**Document Type:** Functional Workflow Guide, Visual Flowcharts & Master User Manual  

---

## Executive Summary & Quick Start Orientation

Welcome to **SpacECE**, an integrated early childhood learning and smart parenting platform designed to make learning engaging for children while providing actionable analytics for parents and educators.

> [!NOTE]
> * **Document Scope:** This manual is your complete step-by-step operational guide for navigating, using, administering, and troubleshooting the SpacECE web application.
> * **Visual Flowcharts & Diagrams:** Includes 6 high-resolution architecture and user workflow flowcharts.
> * **Screenshots:** Includes 30 unique, high-resolution screenshots captured directly from the live application for all pages and game worlds.
> * **Database Documentation:** For database schemas, indexes, and collections, refer to **[DATABASE_DOCUMENTATION.md](file:///Users/ayush9085/Desktop/SpacECE%20MongoDB/DATABASE_DOCUMENTATION.md)**.
> * **Installation Guide:** For developer environment setup and deployment steps, refer to **[README.md](file:///Users/ayush9085/Desktop/SpacECE%20MongoDB/README.md)**.

---

### Platform Role Quick Orientation

| Role Icon | Target Audience | Primary Dashboard | Main Capabilities |
| :---: | :--- | :--- | :--- |
| 🧒 | **Child Learner** | `/child/dashboard` | Gamified learning worlds, Adventure Map, Avatar Customizer, Trophy Room, XP & Coins progression. |
| 👨‍👩‍👧 | **Parent Supervisor** | `/parent/dashboard` | Child profile management (up to 4 children), profile switching, real-time pillar analytics, exportable reports. |
| 👩‍🏫 | **Teacher / Educator** | `/teacher/dashboard` | Cohort performance heatmap, student skill gap analyzer, targeted activity assignment, class roster management. |
| 🛠️ | **Administrator** | `/admin/dashboard` | User role controls, active session security, feature flags, maintenance gate toggle, notification broadcasts. |

---

## Table of Contents

1. [1. Executive Summary & Quick Start Orientation](#executive-summary--quick-start-orientation)
2. [2. System Architecture & Technology Flowchart](#2-system-architecture--technology-flowchart)
3. [3. Public Authentication & Account Onboarding](#3-public-authentication--account-onboarding)
4. [4. Parent User Playbook (Step-by-Step Operations)](#4-parent-user-playbook-step-by-step-operations)
5. [5. Child Learner Playbook & Gamified Progression](#5-child-learner-playbook--gamified-progression)
6. [6. Comprehensive Game-by-Game Guide (10+ Learning Worlds)](#6-comprehensive-game-by-game-guide-10-learning-worlds)
7. [7. Teacher Console & Classroom Management](#7-teacher-console--classroom-management)
8. [8. System Administrator Operations & Maintenance](#8-system-administrator-operations--maintenance)
9. [9. Offline Resilience & Score Synchronization](#9-offline-resilience--score-synchronization)
10. [10. Full Application Route Reference (51 Routes)](#10-full-application-route-reference-51-routes)
11. [11. FAQs & Troubleshooting Matrix](#11-faqs--troubleshooting-matrix)

---

## 2. System Architecture & Technology Flowchart

SpacECE utilizes a modern full-stack architecture built for high performance and offline resilience:

![SpacECE Architecture Diagram](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/diagram_system_architecture.png)
*Diagram 1: SpacECE System Architecture & Data Flow Diagram*

---

## 3. Public Authentication & Account Onboarding

The public authentication flow supports role selection, account creation, multi-role login, and password recovery:

![Role Selector Landing Page](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_role_selector.png)
*Figure 1: SpacECE Role Selector Landing Page (http://localhost:5173/)*

![User Account Registration](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_register.png)
*Figure 2: User Account Registration Screen (/register)*

![Parent Authentication Portal](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_parent_login.png)
*Figure 3: Parent Authentication Portal (/login/parent)*

![Child Login Screen](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_child_login.png)
*Figure 4: Child Avatar & PIN Login Screen (/login/child)*

![Teacher Authentication](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_teacher_login.png)
*Figure 5: Teacher Authentication Screen (/login/teacher)*

![Admin Authentication](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_admin_login.png)
*Figure 6: Administrator Authentication Screen (/login/admin)*

---

## 4. Parent User Playbook (Step-by-Step Operations)

![Parent User Journey Diagram](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/diagram_parent_workflow.png)
*Diagram 2: Parent User Journey & Operational Flowchart*

### Step-by-Step Parent Workflow:
1. **Log in to Parent Portal:** Visit `http://localhost:5173/login/parent` and log in with your email and password.
2. **Review Parent Dashboard:** View active child overview, recent learning activity, and progress notifications.

![Parent Overview Dashboard](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_parent_dashboard.png)
*Figure 7: Parent Overview Dashboard (/parent/dashboard)*

3. **Manage Child Profiles:** Click **Child Profiles** in the sidebar (`/parent/children`). Click **+ Add Child** to register up to 4 child profiles with age groups and avatar emojis. Click **Select Profile** to make a child active.

![Child Profile Manager](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_child_profile_manager.png)
*Figure 8: Child Profile Manager & Profile Selector (/parent/children)*

4. **Analyze 5-Pillar Mastery:** Click **Analytics** (`/parent/analytics`). Inspect the 5-Pillar Mastery Radar Chart (Numeracy, Literacy, Cognitive, SEL, Creativity) and pillar skill bars.

![Parent Analytics & Radar Chart](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_parent_analytics.png)
*Figure 9: Parent Analytics & 5-Pillar Mastery Radar Chart (/parent/analytics)*

5. **Generate Progress Reports:** Click **Reports** (`/parent/reports`). Choose date range filter and click **Generate & Export PDF Report** to download an exportable summary.

![Parent PDF Report Generator](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_parent_reports.png)
*Figure 10: Parent PDF Report Generator (/parent/reports)*

---

## 5. Child Learner Playbook & Gamified Progression

![Child Learner Flowchart](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/diagram_child_workflow.png)
*Diagram 3: Child Learner Gameplay & Rewards Flowchart*

### Child Explorer Features:
1. **Child Home Dashboard (`/child/dashboard`):** View daily streak (🔥), coins (🪙), total XP (⭐), and featured game world cards.

![Child Home Dashboard](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_child_dashboard.png)
*Figure 11: Child Home Dashboard (/child/dashboard)*

2. **2D Adventure Island Map (`/child/explore`):** Tap unlocked zone pins to enter learning worlds. Earning XP unlocks new island regions!

![Adventure Island Map](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_child_explore.png)
*Figure 12: 2D Adventure Island Exploration Map (/child/explore)*

3. **Avatar Customizer & Shop (`/child/avatar`):** Spend earned coins on hats, outfits, glasses, and background themes.

![Avatar Customizer](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_child_avatar.png)
*Figure 13: Avatar Customizer & Accessories Shop (/child/avatar)*

4. **Trophy Room & Achievement Badges (`/child/awards`):** View earned trophies and achievement milestones.

![Trophy Room](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_child_awards.png)
*Figure 14: Child Trophy Room & Achievement Badges (/child/awards)*

---

## 6. Comprehensive Game-by-Game Guide (10+ Learning Worlds)

### 6.1 Numeracy & Math Games

* **Math World (`/math-world`):** Count garden fruits, solve addition math paths, and sort 3D geometric shapes (+20 XP, +5 Coins).
![Math World](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_math.png)
*Figure 15: Math World Counting & Addition Game (/math-world)*

* **Puzzle World (`/puzzle-world`):** Reassemble jigsaw tiles and align spatial picture patterns.
![Puzzle World](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_puzzle.png)
*Figure 16: Puzzle World Spatial Matching Game (/puzzle-world)*

* **Number Adventure (`/number-adventure`):** Endless runner style number skipping and sequence solver.
![Number Adventure](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_number_adventure.png)
*Figure 17: Number Adventure Sequence Game (/number-adventure)*

* **Logic Island (`/logic-island`):** Visual pattern recognition and odd-one-out logic puzzles.
![Logic Island](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_logic.png)
*Figure 18: Logic Island Pattern Game (/logic-island)*

### 6.2 Literacy & Phonics Games

* **Reading & Phonics World (`/child/reading-world`):** Alphabet phonics sound matching, phoneme blending, and letter tracing.
![Reading World](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_reading.png)
*Figure 19: Reading & Phonics World (/child/reading-world)*

* **Read-Along Story World (`/child/story-world`):** Interactive animated storybooks with read-aloud voiceover audio.
![Read-Along Story World](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_story.png)
*Figure 20: Read-Along Story World (/child/story-world)*

* **Vocabulary Zone (`/child/vocabulary-zone`):** Picture-to-word matching and interactive spelling matrices.
![Vocabulary Zone](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_vocabulary.png)
*Figure 21: Vocabulary Zone Word Builder (/child/vocabulary-zone)*

### 6.3 Cognitive, SEL & Expressive Arts

* **Brain World (`/child/brain-world`):** Memory card flip pair matching game with dynamic grid sizes.
![Brain World](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_brain.png)
*Figure 22: Brain World Memory Flip Game (/child/brain-world)*

* **Spatial 3D Rotation Studio (`/child/spatial-brain`):** Rotate 3D objects to match target view perspectives.
![Spatial Rotation](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_spatial.png)
*Figure 23: Spatial 3D Rotation Studio (/child/spatial-brain)*

* **Creativity World (`/child/creativity-world`):** Freehand drawing canvas with color palettes, brush sizes, and sticker stamps.
![Creativity World](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_creativity.png)
*Figure 24: Expressive Arts & Drawing Studio (/child/creativity-world)*

* **Emotion Sanctuary (`/child/emotion-world`):** Emoji mood check-in and interactive empathy decision tree stories.
![Emotion Sanctuary](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_game_emotion.png)
*Figure 25: Emotion Sanctuary & SEL Mood Check-In (/child/emotion-world)*

---

## 7. Teacher Console & Classroom Management

![Teacher Workflow Diagram](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/diagram_teacher_workflow.png)
*Diagram 4: Educator & Teacher Classroom Workflow*

Teachers view class completion rate heatmaps, identify skill gaps, and assign targeted practice modules:

![Teacher Dashboard](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_teacher_dashboard.png)
*Figure 26: Teacher Class Performance Dashboard (/teacher/dashboard)*

![Teacher Skill Gap Analyzer](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_teacher_gaps.png)
*Figure 27: Teacher Student Skill Gap Analyzer (/teacher/gaps)*

---

## 8. System Administrator Operations & Maintenance

![Admin Workflow Diagram](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/diagram_admin_workflow.png)
*Diagram 5: System Administrator Operations Flowchart*

Administrators control user account roles, inspect active JWT sessions, configure feature flags, and toggle maintenance mode:

![Admin Dashboard](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_admin_dashboard.png)
*Figure 28: System Administrator Main Dashboard (/admin/dashboard)*

![Admin User Management](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_admin_users.png)
*Figure 29: Admin User Account Management (/admin/users)*

![Admin Feature Flags](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/screen_admin_features.png)
*Figure 30: Admin Feature Flags & Maintenance Gate Control (/admin/features)*

---

## 9. Offline Resilience & Score Synchronization

![Score Sync Diagram](/Users/ayush9085/.gemini/antigravity-ide/brain/7896c53a-f030-4c4e-b9ee-df669af31eec/diagram_score_sync_workflow.png)
*Diagram 6: Offline Resilience & Score Sync Sequence Flowchart*

SpacECE ensures no child progress is lost during network dropouts through automatic offline score queueing. Scores queue in `localStorage` and automatically sync to MongoDB upon reconnection.

---

## 10. Full Application Route Reference (51 Routes)

| Route URL | Page Title / Module | User Actions & Interactions | Expected Behavior |
| :--- | :--- | :--- | :--- |
| `/` | Role Selector Landing | Click Child/Parent/Teacher/Admin card | Navigates to selected role login |
| `/login/parent` | Parent Login Page | Enter Email & Password, click Sign In | Issues JWT token; opens `/parent/dashboard` |
| `/login/child` | Child Login Page | Select avatar or enter 4-digit PIN | Sets active child; opens `/child/dashboard` |
| `/login/teacher` | Teacher Login Page | Enter teacher credentials | Opens `/teacher/dashboard` |
| `/login/admin` | Admin Login Page | Enter admin credentials | Opens `/admin/dashboard` |
| `/register` | User Registration | Input Name, Email, Password, Role | Creates user account; auto logs in |
| `/parent/dashboard` | Parent Dashboard | View active child summary & quick stats | Displays child progress overview |
| `/parent/children` | Child Profile Manager | Click Add Child (Name, Age, Avatar) | Creates profile; enforces max 4 limit |
| `/parent/analytics` | Parent Analytics | View 5-Pillar Radar Chart & Stats | Displays active child mastery bars |
| `/parent/reports` | Parent Reports Page | Select date range & click Export PDF | Generates downloadable PDF report |
| `/teacher/dashboard` | Teacher Dashboard | View class cohort completion rates | Displays student performance heatmap |
| `/teacher/gaps` | Skill Gaps Analyzer | Filter low-scoring pillar metrics | Highlights students needing practice |
| `/admin/features` | Feature Flags & Gate | Toggle Maintenance Mode or Features | Updates global app behavior in real time |
| `/admin/users` | User Account Control | Search users, edit roles, toggle status | Updates user status in database |
| `/child/dashboard` | Child Home Dashboard | View streak, coins, XP & game cards | Central hub for child learners |
| `/child/explore` | Adventure Island Map | Tap unlocked zone pins (Math, Logic) | Opens target game world |
| `/child/avatar` | Avatar Customizer | Purchase accessories with coins | Updates child avatar appearance |
| `/child/awards` | Trophy Room | View unlocked achievement badges | Displays earned awards & trophies |
| `/math-world` | Math World (Numeracy) | Count fruits, sort 3D geometric shapes | Awards +20 XP & +5 Coins on completion |
| `/logic-island` | Logic Island | Solve Odd One Out & Pattern games | Awards XP & advances map progress |
| `/child/reading-world` | Reading & Phonics | Phonics puzzle & phoneme matching | Builds literacy skills & awards XP |
| `/child/story-world` | Read-Along Stories | Interactive read-aloud storybook | Enhances reading comprehension |
| `/child/vocabulary-zone` | Vocabulary Zone | Picture-to-word matching matrix | Expands child vocabulary |
| `/child/brain-world` | Brain World (Memory) | Flip card matching game | Develops visual memory |
| `/child/spatial-brain` | Spatial 3D Rotation | Rotate 3D block to match pattern | Improves spatial reasoning |
| `/child/creativity-world` | Drawing Studio | Draw with colors & stickers | Saves artwork canvas |
| `/child/emotion-world` | Emotion Sanctuary | Emoji mood check-in & story scenarios | Builds social-emotional skills |

---

## 11. FAQs & Troubleshooting Matrix

| Symptom / Problem | Underlying Cause | Recommended Resolution Step |
| :--- | :--- | :--- |
| "System Under Maintenance" page appears | Admin turned ON maintenanceMode flag. | Admin logs in to `/login/admin` and toggles maintenanceMode OFF under `/admin/features`. |
| Cannot add 5th child profile | Max limit reached (4 children max per parent). | Delete an inactive profile or edit existing profile details under `/parent/children`. |
| Child scores not saving | Expired JWT session or missing active child. | Switch active child profile under `/parent/children/switch` or re-login. |
| No audio in story games | Device or browser audio muted. | Check volume slider in `/child/settings` and verify browser audio permissions. |
| Coins or XP not updating immediately | Network latency or offline mode. | Wait for auto-sync or refresh page. Scores queue in localStorage automatically. |
