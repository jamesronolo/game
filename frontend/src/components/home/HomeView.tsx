import React, { useEffect, useState } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import {
  Gamepad2,
  BookOpen,
  Wrench,
  Sparkles,
  Play,
  Award,
  ShieldCheck,
  Zap,
  MonitorSmartphone,
  GraduationCap,
  BookOpenCheck,
  ChevronRight,
  ChevronDown,
  CircleCheckBig,
  MessageCircleQuestion,
  Users,
  Volume2,
  Flag,
  Dice5,
  Code2,
  Crown,
  Key,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { BackendHealth, fetchBackendHealth } from '../../services/api';

export const HomeView: React.FC = () => {
  const { setActiveTab, gamesCatalog, questionSets, launchGameWithSet } = useEduPlay();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [quickRoomCode, setQuickRoomCode] = useState('');

  useEffect(() => {
    fetchBackendHealth().then(setBackendHealth).catch(() => setBackendHealth(null));
  }, []);

  const featuredGame = gamesCatalog.find((game) => game.slug === 'alien-spelling') || gamesCatalog[0];

  const faqs = [
    {
      question: 'What makes Quiz Game different from traditional quiz tools?',
      answer:
        'Instead of boring static quizzes, Quiz Game allows you to take any question set and instantly play it across 8 distinct video game formats: Wheel Spin, Naval Battles, Phonics Spelling, Arcade Claw, Magic Potions, Flashcards, and more! Your question data is completely decoupled from the game mechanics.',
    },
    {
      question: 'Can teachers and students use the platform without an account?',
      answer:
        'Yes! The platform is designed for zero-friction classroom use. Teachers can project smartboard utilities immediately, and students can enter 4-digit room codes without passwords or ads.',
    },
    {
      question: 'Is it suitable for Speech-Language Pathologists (SLPs) and special ed?',
      answer:
        'Absolutely. Custom word sets, articulation drills, phonics exercises, and high-contrast flashcards are built right into the curriculum editor and game engines.',
    },
    {
      question: 'Does it support real-time classroom multiplayer?',
      answer:
        'Yes! Teachers can host live lobbies from the Host Room panel, and students join instantly using room codes. Scores sync in real-time with live rank leaderboards.',
    },
  ];

  const handleQuickJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRoomCode.trim()) {
      setActiveTab('multiplayer-join');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0e172a] to-[#1e1b4b] text-white shadow-2xl border border-slate-800/80">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {featuredGame?.imageUrl && (
          <img
            src={featuredGame.imageUrl}
            alt="Classroom gaming adventure banner"
            className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full object-cover object-center opacity-25 lg:opacity-35 pointer-events-none mix-blend-luminosity"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl flex flex-col justify-between min-h-[500px]">
          {/* Top Status & Brand Chip */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Interactive EdTech Arcade Platform</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                backendHealth
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${backendHealth ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {backendHealth ? (backendHealth.db === 'connected' ? 'Server Connected' : 'Server Online') : 'Offline Mode'}
              </span>
            </div>
          </div>

          {/* Headline & Value Statement */}
          <div className="py-8 sm:py-10 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-800/60 inline-block">
              One Question Set • 8 Interactive Ways to Play
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              Turn Any Curriculum Into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">Arcade Adventure</span>.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Build custom question sets or choose from the shared library. Launch games instantly on smartboards, tablets, or laptops with real-time multiplayer scoring and sticker rewards.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('games')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Explore 8 Game Engines</span>
              </button>

              <button
                onClick={() => setActiveTab('sets')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Question Sets Studio</span>
              </button>

              <button
                onClick={() => setActiveTab('coding-quiz')}
                className="px-4 py-3.5 rounded-2xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-violet-200 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                title="Try Programming Test Arena"
              >
                <Code2 className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Programming Arena</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-5">
              <span>🎮 <strong className="text-white">{gamesCatalog.length}</strong> Game Worlds</span>
              <span className="text-slate-600">•</span>
              <span>📚 <strong className="text-white">{questionSets.length}</strong> Question Sets</span>
              <span className="text-slate-600">•</span>
              <span>⚡ <strong className="text-white">Real-Time</strong> Socket Multiplayer</span>
            </div>

            <button
              onClick={() => setActiveTab('host-lobby')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Host Live Classroom Session <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ LIVE QUICK-JOIN ARENA BANNER ═══════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-700/60">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/30 shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                  Live Classroom Arena
                </span>
                <span className="text-xs text-indigo-200">Room Code System</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Joining a Live Classroom Quiz?
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200">
                Enter your teacher's 4-digit code to jump directly into the live leaderboard!
              </p>
            </div>
          </div>

          {/* Quick Enter Code Field & Action */}
          <form onSubmit={handleQuickJoinSubmit} className="flex items-center gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-48">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                maxLength={6}
                value={quickRoomCode}
                onChange={(e) => setQuickRoomCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                className="w-full pl-9 pr-3 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200/60 text-sm font-mono font-bold tracking-widest uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              onClick={() => setActiveTab('multiplayer-join')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span>Join Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════ VALUE PILLARS GRID ═══════════════ */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'One Set, 8 Game Mechanics',
            body: 'Write your questions once. Run them through Wheel Spin, Naval Battles, Phonics Alien, Crane Claws, and more with zero re-entry.',
            icon: Zap,
            color: 'from-blue-500 to-indigo-600',
            bgGlow: 'bg-blue-50 dark:bg-blue-950/30',
          },
          {
            title: 'Frictionless Classroom Flow',
            body: 'Launch instant random student pickers, 3D dice, star behavior charts, and noise meters without forcing students to log in.',
            icon: ShieldCheck,
            color: 'from-emerald-500 to-teal-600',
            bgGlow: 'bg-emerald-50 dark:bg-emerald-950/30',
          },
          {
            title: 'Gamified Sticker Rewards',
            body: 'Students earn tickets for correct answers and unlock collectible mystery stickers across Legendary, Epic, Rare, and Common rarities.',
            icon: Award,
            color: 'from-amber-500 to-orange-600',
            bgGlow: 'bg-amber-50 dark:bg-amber-950/30',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="card-interactive rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-7 shadow-xs backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/10 mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ═══════════════ FEATURED GAMES SHOWCASE ═══════════════ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Arcade
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Game Worlds
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('games')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <span>Browse All {gamesCatalog.length} Engines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gamesCatalog.slice(0, 4).map((game) => (
            <div
              key={game.id}
              onClick={() => {
                const firstSet = questionSets[0];
                if (firstSet) launchGameWithSet(game.slug, firstSet.id);
              }}
              className="group card-interactive cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/70 backdrop-blur-md text-white border border-white/20">
                    {game.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/90">
                    Grade {game.minGrade}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    {game.mechanic}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Play Engine</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS (3-STEP PROGRESSION) ═══════════════ */}
      <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-8 sm:p-10 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Seamless Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Concept to Gameplay in 3 Steps
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('sets')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all self-start sm:self-auto"
          >
            Create Question Set
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Build or Import Questions',
              body: 'Craft multiple-choice lists with optional hints, tags, images, or use the integrated AI curriculum generator.',
              icon: BookOpenCheck,
            },
            {
              step: '02',
              title: 'Pick Any Game Mechanic',
              body: 'Choose from 8 distinct game worlds — Wheel Spin, Naval Battles, Phonics Spelling, or Arcade Claw — without reformatting.',
              icon: Gamepad2,
            },
            {
              step: '03',
              title: 'Play, Analyze & Reward',
              body: 'Project on a smartboard or launch multiplayer rooms. Review student accuracy in real-time gradebook analytics.',
              icon: MonitorSmartphone,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ FREE SMARTBOARD TOOLS SHOWCASE ═══════════════ */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-indigo-950 to-slate-950 p-8 sm:p-10 text-white shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block">
              Dedicated Educator Utilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Classroom Projector Tools Ready in One Click.
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              No account, no student app download, and zero setup friction. Open student spinners, group generators, and noise meters directly on smartboards.
            </p>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setActiveTab('teacher-tools')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-indigo-600" />
              <span>Launch Teacher Tools Suite</span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-8 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
            <Wrench className="w-4 h-4" />
            <span>Instant Classroom Tools</span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              { label: 'Random Name Picker', icon: Users },
              { label: 'Star Chart & Behavior', icon: Award },
              { label: 'Student Grouper', icon: Users },
              { label: 'Virtual 3D Dice', icon: Dice5 },
              { label: 'Behavior Race Track', icon: Flag },
              { label: 'Noise Level Monitor', icon: Volume2 },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  onClick={() => setActiveTab('teacher-tools')}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{tool.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ FREQUENTLY ASKED QUESTIONS ═══════════════ */}
      <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-8 sm:p-10 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6">
          <MessageCircleQuestion className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
