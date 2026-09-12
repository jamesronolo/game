# How EduPlay Works: Complete Architecture & System Overview

This document provides a comprehensive, end-to-end breakdown of how the **EduPlay** educational gaming platform works across both the **Frontend** (`game/frontend`) and **Backend** (`game-server/backend`) directories.

---

## 1. High-Level System Architecture

EduPlay is a full-stack educational web application designed for teachers, speech-language pathologists (SLPs), parents, and K-12/higher-ed students. The core architecture connects a **React 18 Single Page Application (SPA)** with a **Node.js/Express REST & WebSocket Server** backed by a **MySQL Database** (with automatic in-memory fallback).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                        │
│                                                                         │
│   ┌─────────────────┐   ┌───────────────────┐   ┌───────────────────┐   │
│   │  Navbar & Tabs  │   │  8 Game Engines   │   │  Teacher Tools &  │   │
│   │  (Views Routing)│   │  & Game Launcher  │   │  School Records   │   │
│   └────────┬────────┘   └─────────┬─────────┘   └─────────┬─────────┘   │
│            │                      │                       │             │
│            └──────────────────────┼───────────────────────┘             │
│                                   ▼                                     │
│                     ┌───────────────────────────┐                       │
│                     │      EduPlayContext       │                       │
│                     │ (Global State Management) │                       │
│                     └───────┬───────────┬───────┘                       │
│                             │           │                               │
│                   REST APIs │           │ WebSockets (Socket.IO)        │
└─────────────────────────────┼───────────┼───────────────────────────────┘
                              ▼           ▼
┌─────────────────────────────┼───────────┼───────────────────────────────┐
│                             ▼           ▼                               │
│                         BACKEND (Express + Socket.IO)                   │
│                                                                         │
│   ┌────────────────────────────────┐   ┌────────────────────────────┐   │
│   │         Express Router         │   │   Socket.IO Room Manager   │   │
│   │   11 Modular REST Endpoints    │   │  Multiplayer Live Lobbies  │   │
│   └────────┬───────────────────────┘   └────────────────────────────┘   │
│            │                                                            │
│   ┌────────┴──────────────┐             ┌───────────────────────────┐   │
│   │  Google Gemini 2.5    │             │   MySQL Database Pool     │   │
│   │  Flash (AI Gen Sets)  │             │ (Stored Procs / Fallback) │   │
│   └───────────────────────┘             └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & File Map

### 📁 Frontend (`c:\Users\james\Documents\game\frontend`)

| Directory / File | Description |
| :--- | :--- |
| `src/main.tsx` | Entry point rendering `<App />` into DOM. |
| `src/App.tsx` | Main application shell wrapping views inside `EduPlayProvider`, routing tabs based on `activeTab`. |
| `src/context/EduPlayContext.tsx` | Central state management handling user roles, question sets, active game, roster, rewards, attempts, and grades. |
| `src/services/api.ts` | Type-safe HTTP client communicating with backend REST endpoints (`http://localhost:5000/api`). |
| `src/services/socket.ts` | Socket.IO client instance connecting to `http://localhost:5000` for real-time multiplayer rooms. |
| `src/types/index.ts` | TypeScript interfaces for Users, Games, QuestionSets, Questions, Assignments, Attempts, Stickers, Roster, and Grades. |
| `src/components/common/Navbar.tsx` | Navigation bar with role switcher (Teacher/Student/Admin), points/stars tracker, sound toggle, and tab links. |
| `src/components/games/` | **8 Game Engines** + `GameLauncher.tsx` (runs games with decoupled question sets) + `GamesCatalogView.tsx`. |
| `src/components/question-sets/` | `QuestionSetsView.tsx` and `SetEditorView.tsx` (manual editor & AI prompt generation). |
| `src/components/teacher-tools/` | `TeacherToolsView.tsx` (interactive stopwatch, random student picker, dice roller, spin wheel, soundboard, roster manager). |
| `src/components/coding-quiz/` | `CodingQuizView.tsx` (25-question interactive programming assessment with timer, instant feedback, explanations, and grade tracking). |
| `src/components/school-records/` | `SchoolRecordsView.tsx` (student report cards, grading metrics, GPA calculators, and record deletion/creation). |
| `src/components/dashboard/` | `ProgressView.tsx` (teacher gradebook, student analytics, accuracy metrics, and attempt history). |
| `src/components/assignments/` | `AssignmentsView.tsx` (assignment creation with join codes, due dates, and direct links to games). |
| `src/components/rewards/` | `RewardsView.tsx` (collectible sticker album; trade points for mystery or specific stickers). |
| `src/components/multiplayer/` | `MultiplayerLobby.tsx` & `HostLobbyView.tsx` (live classroom multiplayer competitions). |
| `src/components/pro-upgrade/` | `ProUpgradeView.tsx` (simulated premium plan tier upgrades). |
| `src/utils/soundEffects.ts` | Web Audio API synthesizer for instant game sound effects (correct, wrong, click, win, fanfare) with no external audio files needed. |

---

### 📁 Backend (`c:\Users\james\Documents\game-server\backend`)

| Directory / File | Description |
| :--- | :--- |
| `src/server.ts` | Express HTTP server setup, CORS configuration, Socket.IO initialization, multiplayer lobby room state machine, and API routing. |
| `src/db.ts` | Database connection pool manager, stored procedure execution helper (`callProcedure`), and in-memory fallback store (`memoryStore`). |
| `src/seedData.ts` | Initial seed datasets for default users, 8 games, question sets, stickers, assignments, and roster. |
| `src/routes/index.ts` | Master router mounting health check (`/api/health`) and 11 feature routers. |
| `src/routes/users.routes.ts` | User profiles, role updates, and user listing. |
| `src/routes/games.routes.ts` | Returns arcade catalog metadata for all 8 playable games. |
| `src/routes/questionSets.routes.ts` | CRUD endpoints for teacher question sets and questions. |
| `src/routes/assignments.routes.ts` | Create, list, and delete student assignments. |
| `src/routes/attempts.routes.ts` | Record game play results, score, accuracy, and student attempts. |
| `src/routes/stickers.routes.ts` | Collectible sticker definitions with rarity and costs. |
| `src/routes/roster.routes.ts` | Manage classroom students, award stars, and add/remove students. |
| `src/routes/rewards.routes.ts` | Fetch and update student points, stars, and unlocked sticker inventory. |
| `src/routes/ai.routes.ts` | AI Question Set generation powered by Google Gemini 2.5 Flash via `@google/genai`. |
| `src/routes/programmingQuiz.routes.ts`| Serves 25 CS questions, evaluates answers on server, computes scores, and stores attempt history. |
| `src/routes/grades.routes.ts` | CRUD endpoints for academic school records and student grades. |

---

## 3. Core Architectural Concepts & How It Works

### A. Content Decoupling Model (Key Game Engine Principle)
Unlike traditional quiz apps that hardcode questions into a specific game:
1. Questions are stored in reusable **Question Sets** (e.g., *Multiplication*, *Vocabulary*, *Science*).
2. Games are generic **Gameplay Engines** (e.g., *Ship Battle*, *Alien Spelling*, *Wheel Spin*).
3. The `GameLauncher.tsx` injects any Question Set into any Game Engine at launch.

```
┌─────────────────────────────────┐
│     Question Set (e.g. Math)    │
└────────────────┬────────────────┘
                 │
                 ├──► Passes questions into Wheel Spin (Spin & answer)
                 ├──► Passes questions into Ship Battle (Sink ships on correct)
                 ├──► Passes questions into Alien Spelling (Letter unscramble)
                 └──► Passes questions into Flashcards (Flip & self-test)
```

### B. Dual-Layer Persistence (MySQL + In-Memory Fallback)
- When MySQL is running, `db.ts` connects to the MySQL pool and invokes MySQL Stored Procedures (`sp_get_users`, `sp_save_question_set`, etc.).
- If MySQL is offline or disconnected, `db.ts` automatically flips `isInMemoryMode = true` and transparently routes all operations to `memoryStore` in memory. This ensures zero downtime during local development or offline testing.

### C. Real-Time Multiplayer Room State Machine
Real-time classroom multiplayer runs over WebSockets via Socket.IO:
1. **Host Creates Lobby**: Teacher selects Game + Question Set $\rightarrow$ Backend generates a 4-digit room PIN $\rightarrow$ Teacher receives host status.
2. **Students Join**: Students enter room PIN and name $\rightarrow$ Backend adds player to room $\rightarrow$ Broadcasts `lobby_updated` with player list.
3. **Host Starts Game**: Teacher clicks Start $\rightarrow$ Backend emits `game_started` to all room sockets $\rightarrow$ All clients transition into synced gameplay.
4. **Live Score Updates**: As students answer questions, scores emit to room $\rightarrow$ Real-time leaderboard updates for all players.

### D. AI Question Set Generator (Gemini 2.5 Flash)
- Teachers enter a topic (e.g. *"Photosynthesis"*), grade level (*"Grade 5"*), and count (*"5 questions"*).
- Backend calls Google GenAI (`gemini-2.5-flash`) using a strict JSON schema definition.
- The returned structured questions are immediately loaded into the Question Set Editor for the teacher to preview, tweak, and save.

### E. Gamification & Rewards Economy
- Completing games or answering quiz questions awards **Points** and **Stars**.
- Students visit the **Rewards Store / Sticker Album** to redeem points for mystery sticker packs or specific collectible stickers (Common, Rare, Epic, Legendary).
- Sound effects synthesize dynamically via Web Audio API without needing external MP3/WAV assets.

---

## 4. How to Run Frontend & Backend

### Running the Backend
```bash
cd c:\Users\james\Documents\game-server\backend
npm install
npm run dev
```
*Runs on `http://localhost:5000` with REST APIs at `/api` and Socket.IO on port 5000.*

### Running the Frontend
```bash
cd c:\Users\james\Documents\game\frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173` (Vite dev server) with proxy or direct connection to `http://localhost:5000`.*
