# EduPlay — Interactive Learning Games Platform
### University Capstone Project Guide (Inspired by Academoo)

> **Status:** Permanent reference document. Keep this file updated as the single source of truth for scope, architecture, and folder structure throughout development.

---

## 1. Project Summary

**EduPlay** is a web-based platform that lets teachers, speech-language pathologists (SLPs), and parents create **custom question sets** and use them inside a library of **interactive classroom games**. Teachers can assign games to students, track progress, and use free standalone classroom tools (name picker, star chart, dice, etc.) without even creating an account.

This project recreates the core concept of Academoo (academoo.com) as an original build for academic purposes — same *category* of product (EdTech / game-based learning), your own branding, code, and design.

**Reference site analyzed:** academoo.com — a games + question-set platform for teachers/SLPs with progress tracking and free teacher tools, marketed as safe and ad-free for classrooms. Their own Student Privacy page confirms their production stack runs on **Supabase, Vercel, Paddle, Google Sign-In, PostHog, and Sentry** — this guide's architecture (Section 5) mirrors that stack.

---

## 2. Problem Statement

Teachers spend significant time creating engaging review activities and lack a single tool that lets them:
- Reuse the same content (spelling lists, vocab, math problems) across multiple different game formats
- Assign that content as homework and see who completed it
- Access quick classroom utilities (random name picker, grouping, dice) without setup

**EduPlay solves this** by decoupling *content* (question sets) from *game format* (Wheel Spin, Ship Battle, Flashcards, etc.), so one question set can power any game.

---

## 3. Target Users / Personas

| Persona | Needs |
|---|---|
| **Classroom Teacher** | Fast content creation, whole-class play mode (smartboard), homework assignment, gradebook-style progress view |
| **Speech-Language Pathologist (SLP)** | Custom word lists for articulation/vocabulary drills, 1-on-1 or small group session tools |
| **Parent / Home Educator** | Simple play mode, shared/public question sets, works on tablet/phone |
| **Student** | Play games, see own progress/streaks, no account friction |

---

## 4. Core Features (MVP Scope)

### 4.1 Authentication & Accounts
- Sign up / login (email + password, optionally Google OAuth)
- Roles: `teacher`, `student`, `parent`, `admin`
- Guest/no-login mode for free teacher tools

### 4.2 Question Set Management
- Create/edit/delete question sets (title, subject, grade level)
- Question types: text Q&A, multiple choice, image-based, audio-based
- Upload images/audio per question
- Public/shared library — browse & clone others' sets
- Tagging by subject (math, spelling, vocabulary, reading, custom)

### 4.3 Games Library
A **shared game engine** where each game consumes a question set generically — this is the core architectural pattern of the product: one question set, any game format.

**Confirmed full games list from the reference site** (build your MVP with 3–4 of these first, add the rest post-MVP):

| Game | Mechanic |
|---|---|
| **Wheel Spin** | Spin a wheel for points, answer to win |
| **Ship Battle** | Fire cannons by answering questions correctly |
| **Alien Spelling** | Spell words with alien characters — built for spelling/phonics practice |
| **Crane Game** | Lift boxes by answering correctly — claw-machine mechanic |
| **Magic Potions** | Brew potions and transform animals — sequence/matching mechanic |
| **Flashcards** | Flip cards, self-mark known/unknown, spaced-repetition friendly |
| **Roll & Read** | Roll dice, dice value selects a word/question to read aloud — common SLP/phonics tool |
| **Ocean Quest** | Dive for treasure — exploration/collection mechanic |

**MVP recommendation:** Start with **Wheel Spin, Flashcards, and Roll & Read** — they're the simplest to build (no complex physics/canvas animation) and cover the widest range of subjects. Add **Crane Game** or **Ship Battle** next as your "impressive" stretch feature once the core engine works, since those need canvas/sprite animation.

### 4.4 Classroom / Assignment Mode
- "Play Now" mode — single shared screen for whole class (smartboard use case)
- "Assign" mode — teacher assigns a question set + game to specific students/class, with due date
- Students complete on their own device; results sync back

### 4.5 Progress Tracking
- Per-student score history, accuracy %, streaks
- Per-class dashboard for teacher (completion %, average score, weak topics)
- Exportable/printable summary (optional stretch goal)
- **Rewards system** *(optional/stretch)*: students earn points for correct answers, unlock a "sticker ticket" at score milestones, and redeem tickets to reveal collectible stickers in a personal album — teacher toggles rewards on/off per assignment

### 4.6 Free Teacher Tools (no login required)
- **Name Wheel** — random student picker
- **Star Chart** — award stars for good behavior, students collect stickers, tracks progress via milestones
- **Student Grouper** — randomly splits class into groups for collaborative activities/projects
- **Virtual Dice** — simple randomizer for classroom activities
- **Behavior Race** — project a race track (cars/submarines) that advances as reward for good behavior — visual, whole-class incentive
- **Team Points / Live Podium** *(optional stretch)* — track points for classroom teams, add/subtract live, project a leaderboard

### 4.7 Monetization Model (for your proposal's "business case" section — optional, only if your course wants a sustainability/business plan)

Reference model observed from Academoo's pricing page:
- **Free tier**: create question sets, use shared library, play games
- **Pro tier**: one-time pass purchase (not a recurring subscription) that unlocks all games, image uploads, audio questions, and a **student rewards system** (points + sticker collection unlocked by the teacher for assigned activities)
- Pro is tied to the **teacher's account only** — students always play free; rewards just don't activate without a Pro pass
- **Payment processor: Paddle** (confirmed) — handles payment + local tax collection + receipts/invoices automatically, so you don't build tax logic yourself
- Refund policy: 14-day money-back window
- Existing data (question sets, student records) is retained even if a Pro pass expires — only Pro-only *features* re-lock

> For an academic project, you likely won't implement real payments. You can simulate this with an `is_pro: boolean` flag on the teacher's `users` row to demonstrate the access-control logic (gate image uploads / audio questions / rewards system behind it) without wiring actual billing. If your course *does* want a working payment demo, **Paddle** (or Stripe) both have free sandbox/test modes — no cost to integrate for a school project.

### 4.7 Non-Functional Requirements
- Responsive: works on desktop, tablet, phone (touch-friendly)
- Ad-free, no third-party tracking on student-facing pages (student privacy compliance — relevant for COPPA/FERPA-style discussion in your paper)
- Offline-tolerant play mode (optional/stretch — cache question set locally)
- Accessibility: keyboard navigation, readable fonts, color-contrast for classroom projectors

---

## 5. Confirmed Tech Stack

> **Validated against the real product:** Academoo's own Student Privacy page discloses their actual vendor stack — **Supabase, Vercel, Paddle, Google Sign-In, PostHog, Microsoft Clarity, and Sentry**. Your Supabase choice matches theirs exactly. The table below mirrors that stack, substituting only where a piece is optional or where a specific university-mandated framework needs to slot in.

| Layer | Tech | Free? | Notes |
|---|---|---|---|
| Frontend | React (or Next.js) + TypeScript | ✅ Free | Component-based, matches game-engine architecture |
| Styling | Tailwind CSS | ✅ Free | Fast to theme, responsive utilities |
| State Management | React Context or Zustand | ✅ Free | Lightweight, avoids Redux overhead for a student project |
| Backend / API | Express.js / Node.js + MySQL | ✅ Free | REST API and server-side logic for users, question sets, assignments, and game sessions |
| **Database** | **MySQL** | ✅ Free tier options available | Stores users, question_sets, questions, assignments, attempts — see enhanced schema below |
| **Auth** | **JWT + Google Sign-In** | ✅ Free | Email/password + Google OAuth using server-side auth and role checks in the API |
| **File/Media Storage** | **Local storage / S3-compatible storage** | ✅ Free / low-cost | Question images & audio uploads, optionally stored in object storage |
| **Realtime** | **Socket.IO / Server-Sent Events** | ✅ Free | Powers live "Play Now" classroom mode and live leaderboards without relying on a managed realtime service |
| Hosting | **Vercel** | ✅ Free tier | Good choice for deploying the frontend and API together |
| Payments *(optional/stretch)* | **Paddle** | ✅ Free to integrate (sandbox mode, only takes a cut of real transactions) | Handles checkout, tax, receipts if you build the Pro-tier demo |
| Analytics *(optional)* | **PostHog** | ✅ Free tier (1M events/mo) | Product usage analytics, funnels |
| Error Monitoring *(optional)* | **Sentry** | ✅ Free tier | Catches runtime errors in production, useful to show in your defense as a "production-readiness" touch |
| Session Replay *(optional, skip for school project)* | Microsoft Clarity | ✅ Free | Likely unnecessary scope for your capstone |
| Version Control | Git + GitHub | ✅ Free | Include README, issues, project board |

**Why this stack is a strong choice for your report/defense:** every piece is free at student-project scale, and you can honestly state in your documentation that your architecture **mirrors a real, live production EdTech product** — which is a strong point to make to your panel about industry-relevance.

---

## 6. Folder Structure Guide

```
eduplay/
├── readme1.md                      # project guide / capstone reference
├── README.md                       # setup instructions and run commands
├── package.json                    # project scripts and dependencies
├── package-lock.json               # lockfile for npm
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
├── server.ts                       # Express server and API routes
├── index.html                      # app entry HTML
├── metadata.json                   # app metadata
├── .env.example                    # sample environment variables
├── .gitignore
├── assets/                         # static assets and images
├── src/                            # main frontend source code
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── assignments/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── games/
│   │   │   ├── AlienSpellingGame.tsx
│   │   │   ├── CraneGame.tsx
│   │   │   ├── FlashcardsGame.tsx
│   │   │   ├── GameLauncher.tsx
│   │   │   ├── GamesCatalogView.tsx
│   │   │   ├── MagicPotionsGame.tsx
│   │   │   ├── OceanQuestGame.tsx
│   │   │   ├── RollAndReadGame.tsx
│   │   │   ├── ShipBattleGame.tsx
│   │   │   └── WheelSpinGame.tsx
│   │   ├── home/
│   │   ├── pro-upgrade/
│   │   ├── question-sets/
│   │   ├── rewards/
│   │   └── teacher-tools/
│   ├── context/
│   ├── data/
│   ├── types/
│   └── utils/
└── node_modules/                  # installed dependencies (not committed)
```

**Guidance on this structure:**
- Keep **one folder per game** inside the games section under [src/components/games](src/components/games) so new games can be added without touching existing ones.
- The current project is organized as a **single-root app** using Vite + React on the frontend and Express on the backend/server side, rather than a separate frontend/backend monorepo.
- If you later want to expand this into a full capstone system, you can add a [docs](docs) folder for proposals, diagrams, meeting notes, and final reports without changing the app structure.

---

## 7. Supabase Database Schema (Enhanced)

### 7.1 Entity Overview

```
users            (id, name, email, role, is_pro, created_at)
classes          (id, teacher_id, name, join_code, created_at)
class_students   (id, class_id, student_id)
question_sets    (id, owner_id, title, subject, grade_level, is_public, created_at)
questions        (id, set_id, prompt_text, image_url, audio_url, answer, options_json, type, position)
games            (id, name, slug, description, thumbnail_url)
assignments      (id, teacher_id, class_id, question_set_id, game_id, due_date, rewards_enabled, created_at)
attempts         (id, assignment_id, student_id, score, accuracy, completed_at)
attempt_answers  (id, attempt_id, question_id, student_answer, is_correct)
rewards          (id, student_id, points, stickers_earned, updated_at)
```

### 7.2 Actual MySQL SQL (paste into MySQL Workbench or your MySQL server)

```sql
-- USERS
create table users (
  id char(36) primary key,
  name varchar(255) not null,
  email varchar(255) not null unique,
  role enum('teacher','student','parent','admin') not null,
  is_pro boolean default false,
  created_at timestamp default current_timestamp
) engine=InnoDB;

-- CLASSES
create table classes (
  id char(36) primary key,
  teacher_id char(36),
  name varchar(255) not null,
  join_code varchar(50) unique not null,
  created_at timestamp default current_timestamp,
  constraint fk_classes_teacher foreign key (teacher_id) references users(id) on delete cascade
) engine=InnoDB;

create table class_students (
  id char(36) primary key,
  class_id char(36),
  student_id char(36),
  constraint fk_class_students_class foreign key (class_id) references classes(id) on delete cascade,
  constraint fk_class_students_student foreign key (student_id) references users(id) on delete cascade
) engine=InnoDB;

-- QUESTION SETS
create table question_sets (
  id char(36) primary key,
  owner_id char(36),
  title varchar(255) not null,
  subject varchar(100),
  grade_level varchar(100),
  is_public boolean default false,
  created_at timestamp default current_timestamp,
  constraint fk_question_sets_owner foreign key (owner_id) references users(id) on delete cascade
) engine=InnoDB;

create table questions (
  id char(36) primary key,
  set_id char(36),
  prompt_text text,
  image_url varchar(1000),
  audio_url varchar(1000),
  answer text,
  options_json json,
  type enum('text','multiple_choice','image','audio'),
  position int default 0,
  constraint fk_questions_set foreign key (set_id) references question_sets(id) on delete cascade
) engine=InnoDB;

-- GAMES (seed once — Wheel Spin, Flashcards, Roll & Read, etc.)
create table games (
  id char(36) primary key,
  name varchar(255) not null,
  slug varchar(255) unique not null,
  description text,
  thumbnail_url varchar(1000)
) engine=InnoDB;

-- ASSIGNMENTS
create table assignments (
  id char(36) primary key,
  teacher_id char(36),
  class_id char(36),
  question_set_id char(36),
  game_id char(36),
  due_date datetime,
  rewards_enabled boolean default false,
  created_at timestamp default current_timestamp,
  constraint fk_assignments_teacher foreign key (teacher_id) references users(id) on delete cascade,
  constraint fk_assignments_class foreign key (class_id) references classes(id) on delete cascade,
  constraint fk_assignments_question_set foreign key (question_set_id) references question_sets(id),
  constraint fk_assignments_game foreign key (game_id) references games(id)
) engine=InnoDB;

-- ATTEMPTS + ANSWERS
create table attempts (
  id char(36) primary key,
  assignment_id char(36),
  student_id char(36),
  score int default 0,
  accuracy decimal(5,2),
  completed_at timestamp null,
  constraint fk_attempts_assignment foreign key (assignment_id) references assignments(id) on delete cascade,
  constraint fk_attempts_student foreign key (student_id) references users(id) on delete cascade
) engine=InnoDB;

create table attempt_answers (
  id char(36) primary key,
  attempt_id char(36),
  question_id char(36),
  student_answer text,
  is_correct boolean,
  constraint fk_attempt_answers_attempt foreign key (attempt_id) references attempts(id) on delete cascade,
  constraint fk_attempt_answers_question foreign key (question_id) references questions(id)
) engine=InnoDB;

-- REWARDS (points + stickers, gated by assignments.rewards_enabled)
create table rewards (
  id char(36) primary key,
  student_id char(36),
  points int default 0,
  stickers_earned int default 0,
  updated_at timestamp default current_timestamp,
  constraint fk_rewards_student foreign key (student_id) references users(id) on delete cascade
) engine=InnoDB;
```

### 7.3 MySQL access control model

MySQL does not use Supabase-style row-level security. Instead, enforce access control in the backend by checking the logged-in user's role and ownership before each query.

```sql
-- Example: create a dedicated app user with limited privileges
create user 'eduplay_app'@'%' identified by 'strong_password';
grant select, insert, update, delete on eduplay.* to 'eduplay_app'@'%';
flush privileges;
```

> Apply the same ownership-based checks in your API layer for every table (`classes`, `questions`, `rewards`, etc.). This is a good section to walk through live during your defense — security and authorization are strong talking points for a capstone project.

### 7.4 Supabase Storage Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `question-images` | Images attached to questions | Public read, authenticated write (owner only) |
| `question-audio` | Audio clips for questions (SLP use case) | Public read, authenticated write (owner only) |
| `avatars` *(optional)* | User profile pictures | Public read, own-user write |

---

## 8. Data Privacy & Compliance Model

> Confirmed from the reference site's actual Student Privacy page — a strong section to cite in your thesis/report's ethical-considerations chapter, since student data handling is a real, examinable concern for any EdTech capstone.

**Data retention principle:** keep classroom/progress records only while needed to provide the service and generate teacher reports. Teachers can delete some classroom resources directly in the product; full account/classroom data deletion is handled via a support request.

**Data usage boundaries (design these into your system from day one):**
- Student data is used **only** to show teachers assignment progress, completion, scores, and answer history
- Student data is **never** used for targeted advertising, sold to advertisers, or used to market to students
- Any third-party vendors used (hosting, DB, storage, auth, analytics) are **not authorized** to use student data for their own purposes

**Suggested implementation for your project:**
- Add a `deleted_at` (soft-delete) column to `users`, `question_sets`, and `attempts` tables instead of hard-deleting, so you can demonstrate a data-deletion request flow without losing referential integrity during a live demo
- Write a short **Privacy Policy** and **Student Privacy Policy** page as part of your deliverables (even a simple static page) — panels often ask about this for any app touching minors' data
- If your paper wants to reference real-world frameworks, mention **FERPA** (US student education records law) and **COPPA** (children's online privacy, under-13 data) by name as the compliance context your design is informed by — you are not required to be legally certified, just to show design awareness

---

---

## 9. Development Roadmap (Suggested Phases)

| Phase | Focus | Deliverable |
|---|---|---|
| **1. Planning** | Finalize scope, wireframes, ER diagram, tech stack approval | Proposal + design docs in `docs/` |
| **2. Foundation** | Auth, DB schema, base UI shell, routing | Working login/dashboard skeleton |
| **3. Content Engine** | Question set CRUD, image/audio upload, public library | Teachers can create & browse sets |
| **4. Game Engine (MVP games)** | Build 2–3 games consuming question sets generically | Playable games with real content |
| **5. Classroom Features** | Assign flow, student play mode, scoring | End-to-end assign → play → score loop |
| **6. Progress Dashboard** | Teacher analytics view, student history | Charts/tables of performance |
| **7. Free Teacher Tools** | Name wheel, star chart, dice, grouper | No-login utility pages |
| **8. Polish & Testing** | Responsive QA, accessibility pass, bug fixes | Stable release candidate |
| **9. Deployment & Defense Prep** | Deploy live demo, write final report, prepare defense/demo | Live URL + final documentation |

---

## 10. Suggested Team Roles (if group project)

- **Project Lead / PM** — scope, timeline, documentation
- **Frontend Developer(s)** — UI, game components, responsiveness
- **Backend Developer(s)** — API, auth, database
- **UI/UX Designer** — wireframes, branding, game art direction
- **QA / Documentation** — testing, user manual, final report writing

---

## 11. Design & Branding Starter Kit

> **Honesty note:** Fetching a webpage strips out its actual CSS, so exact font-family names used by Academoo can't be confirmed this way. Their brand accent color *is* confirmed via page metadata. The font pairing below is a recommended close-style equivalent for a playful, classroom-friendly EdTech look — not a literal copy. For academic integrity, use your **own** logo, name, and exact color/type choices rather than matching theirs 1:1; the direction below is a reasonable, legally-safe starting point in the same visual category.

**Confirmed brand accent color:** `#38bdf8` (sky blue) — you should pick your own distinct primary color instead of reusing this exactly.

**Suggested font pairing (playful, kid/classroom-friendly, free on Google Fonts):**

| Use | Font | Why |
|---|---|---|
| Headings / Logo / Game titles | **Baloo 2** or **Fredoka** | Rounded, friendly, reads well on a smartboard from a distance |
| Body text / UI labels | **Inter** or **Nunito Sans** | Clean, highly legible at small sizes, good accessibility |
| Numbers / Score displays | **Poppins SemiBold** | Geometric, punchy for point counters and timers |

**Suggested palette starting point** *(pick your own hex values — this is just a structure)*:
- Primary (brand/CTA buttons): one bright, energetic color
- Secondary/accent: a complementary playful color for game cards
- Neutral background: soft off-white or very light tint (not stark white — easier on eyes for long classroom sessions)
- Success/error states: standard green/red, but slightly desaturated to stay friendly rather than alarming for young students

---

## 12. Important Notes & Academic Integrity

- Build your **own branding, name, logo, and visual design** — do not copy Academoo's copyrighted assets, logo, or exact UI/text.
- Cite Academoo (and any other references) in your proposal/report as **inspiration/comparative analysis**, common practice for capstone projects that build on an existing product category.
- Confirm with your adviser whether the project should be framed as an **original platform inspired by existing EdTech tools** rather than a "clone," since most university panels prefer originality in branding, feature prioritization, or a specific niche (e.g., focusing on SLP therapy tools, or a specific subject/grade level) to differentiate your thesis contribution.
- Consider picking **one differentiator** for your version (e.g., focus on ESL vocabulary, or offline-first for low-connectivity schools) — this strengthens your defense.

---

## 13. Open Decisions To Fill In (update this section as you decide)

- [ ] Final project name/branding
- [x] Database/Auth/Storage: **MySQL + JWT/Google OAuth + local/S3 storage**
- [ ] Required backend framework (per university mandate — fill in once specified)
- [x] Full games list confirmed (8 games) — pick 3–4 for MVP (see Section 4.3 recommendation)
- [ ] Number & list of MVP games
- [ ] Hosting provider
- [ ] Team member role assignments
- [ ] Target grade levels / subjects for launch content