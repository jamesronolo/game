import React, { useState } from 'react';
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
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab, gamesCatalog, questionSets, launchGameWithSet } = useEduPlay();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What makes this different from a normal quiz app?',
      answer:
        'It combines custom question sets, classroom games, teacher tools, assignments, progress tracking, and rewards in one student-friendly experience.',
    },
    {
      question: 'Can I use it without an account?',
      answer:
        'Yes. Teachers can jump into free classroom tools immediately, and the platform is designed to feel simple and ad-free for students.',
    },
    {
      question: 'Does it work for SLPs and parents too?',
      answer:
        'Absolutely. The same question sets can be reused for articulation, vocabulary, spelling, and review activities across different game formats.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8 lg:space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 text-white shadow-[0_25px_60px_-20px_rgba(15,23,42,0.7)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Quiz Game Platform • Classroom Learning Experience
            </div>

            <h1 className="mt-5 font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Interactive learning games for teachers, SLPs, and students.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Create once, play everywhere. Build custom question sets, launch classroom games, assign activities, and track progress with a calm, student-safe experience that feels polished and fun.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('games')}
                className="flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                <Gamepad2 className="h-4 w-4" />
                Explore Games
              </button>
              <button
                onClick={() => setActiveTab('sets')}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <BookOpen className="h-4 w-4" />
                Browse Question Sets
              </button>
              <button
                onClick={() => setActiveTab('teacher-tools')}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <Wrench className="h-4 w-4" />
                Free Teacher Tools
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Safe & Ad-Free</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">No account friction</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Works on any device</span>
            </div>
          </div>

          <div className="flex items-center justify-center bg-slate-900/40 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md rounded-[1.7rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <div className="rounded-[1.25rem] bg-slate-950/80 p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300">Live classroom flow</p>
                    <h2 className="mt-1 text-lg font-black text-white">Create • Play • Track</h2>
                  </div>
                  <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300">
                    8 Game Modes
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { label: 'Question sets', icon: BookOpenCheck },
                    { label: 'Teacher tools', icon: Wrench },
                    { label: 'Student rewards', icon: Award },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                          <Icon className="h-4 w-4 text-sky-400" />
                          {item.label}
                        </div>
                        <CircleCheckBig className="h-4 w-4 text-emerald-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Multiplayer Quick Join Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-300/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner">
            ⚡
          </div>
          <div>
            <span className="inline-flex items-center gap-1 bg-white/20 text-yellow-100 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> Real-Time Multiplayer
            </span>
            <h2 className="text-xl sm:text-2xl font-black">Joining a Live Classroom Game?</h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
              Enter your teacher's 4-digit room code to join live scoreboards instantly!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('multiplayer-join')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-950 hover:bg-amber-50 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Enter Game Code <ChevronRight className="w-4 h-4 text-slate-950" />
          </button>
          <button
            onClick={() => setActiveTab('host-lobby')}
            className="hidden lg:flex px-5 py-3.5 bg-slate-950/40 hover:bg-slate-950/60 text-white font-bold text-sm rounded-2xl border border-white/20 transition items-center gap-2 whitespace-nowrap"
          >
            Host Room
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'One set, many games', body: 'Reuse the same questions across different playful formats without rebuilding everything.', icon: Zap },
          { title: 'Built for classroom flow', body: 'Assign, review, and reward without adding complexity for teachers or students.', icon: ShieldCheck },
          { title: 'Works for every learner', body: 'Teachers, SLPs, and parents can all use the same simple structure.', icon: GraduationCap },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">How it works</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Pick or create questions, choose a game, then play and track.</h2>
          </div>
          <button onClick={() => setActiveTab('sets')} className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 sm:inline-flex">
            Create a set
          </button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            { title: 'Pick or create questions', body: 'Build question sets with text, images, or audio-ready content that can be reused later.', icon: BookOpenCheck },
            { title: 'Choose a game', body: 'Switch between fun classroom gameplay modes like wheel spin, ship battle, and flashcards.', icon: Gamepad2 },
            { title: 'Play and track', body: 'Assign activities, monitor results, and reward students as they progress.', icon: MonitorSmartphone },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-sky-600">Step {index + 1}</div>
                <h3 className="mt-2 text-lg font-black text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">Built for everyone who teaches</p>
          <h2 className="mt-3 text-2xl font-black">Teachers, SLPs, and home learners all get their own path.</h2>
          <div className="mt-6 space-y-4">
            {[
              ['Teachers', 'Run engaging classroom activities, assign homework, and track student progress with confidence.'],
              ['SLPs', 'Use custom word lists for articulation, vocabulary, and review through playful game formats.'],
              ['Parents', 'Share practice activities on any device without heavy setup or account friction.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <h3 className="text-base font-black">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            <Wrench className="h-4 w-4" />
            Free teacher tools
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-900">No login needed for instant classroom tools.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Random Name Picker', icon: Users },
              { label: 'Star Chart', icon: Award },
              { label: 'Student Grouper', icon: Users },
              { label: 'Virtual Dice', icon: Dice5 },
              { label: 'Behavior Race', icon: Flag },
              { label: 'Noise Meter', icon: Volume2 },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button key={tool.label} onClick={() => setActiveTab('teacher-tools')} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-sky-600" />
                    {tool.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-sky-50 to-emerald-50 p-7 shadow-sm sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Play anywhere</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900">Works on desktop, tablet, and mobile without extra downloads.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">The experience stays lightweight so it can run on a smartboard, a classroom tablet, or a student device with the same polished feel.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-700">Responsive layout</span>
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-700">Touch-friendly controls</span>
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-700">No install required</span>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="rounded-[1.3rem] border border-white/10 bg-slate-900 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/20 p-2 text-sky-300">
                  <MonitorSmartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Cross-device classroom experience</h3>
                  <p className="text-sm text-slate-400">Smartboard, tablet, phone, or laptop</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {['Desktop', 'Tablet', 'Phone'].map((device) => (
                  <div key={device} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-slate-200">
                    {device}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:p-10">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
          <MessageCircleQuestion className="h-4 w-4" />
          Frequently asked questions
        </div>
        <div className="mt-6 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <span className="text-sm font-black text-slate-900">{faq.question}</span>
                  {isOpen ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                </button>
                {isOpen && <p className="px-4 pb-4 text-sm leading-7 text-slate-600">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-center text-white shadow-sm sm:p-10">
        <h2 className="text-2xl font-black sm:text-3xl">Ready to build a classroom game experience that feels modern and fun?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">This version brings the main feel of the reference product into your React + Tailwind + Vite app with a stronger landing experience, clearer navigation, and polished classroom-focused sections.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => setActiveTab('games')} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-400">
            Start exploring the games
          </button>
          <button onClick={() => setActiveTab('teacher-tools')} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
            Try the teacher tools
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Featured Games Catalog</h2>
          <button onClick={() => setActiveTab('games')} className="text-sm font-semibold text-sky-600 hover:underline">
            View all games →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gamesCatalog.slice(0, 4).map((game) => (
            <div
              key={game.id}
              onClick={() => {
                const firstSet = questionSets[0];
                if (firstSet) launchGameWithSet(game.slug, firstSet.id);
              }}
              className="cursor-pointer rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative flex h-36 items-end rounded-[1.1rem] bg-slate-900 p-3 text-white overflow-hidden">
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="relative z-10 rounded-full border border-white/20 bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em]">
                  {game.badge}
                </div>
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900">{game.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{game.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-sky-600">
                <span>Play game</span>
                <Play className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
