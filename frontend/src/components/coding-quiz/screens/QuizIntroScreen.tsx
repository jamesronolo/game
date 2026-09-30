import React from 'react';
import {
  Code2,
  BookOpen,
  Trophy,
  Zap,
  History,
  ChevronRight,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface QuizIntroScreenProps {
  studentName: string;
  nameInput: string;
  setNameInput: (val: string) => void;
  onStartQuiz: () => void;
  onOpenHistory: () => void;
  loading: boolean;
  error: string | null;
  onRetryLoad: () => void;
}

export const QuizIntroScreen: React.FC<QuizIntroScreenProps> = ({
  studentName,
  nameInput,
  setNameInput,
  onStartQuiz,
  onOpenHistory,
  loading,
  error,
  onRetryLoad,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-800 text-white shadow-2xl p-8 mb-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-4 left-8 text-8xl font-black">{'{}'}</div>
          <div className="absolute bottom-4 right-8 text-8xl font-black">{'</>'}</div>
        </div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 mb-4 shadow-xl">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">Programming Test</h1>
          <p className="text-blue-200 text-base font-medium">Basic Programming Concepts Quiz</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-blue-100 flex-wrap">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> 25 Questions
            </span>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-300" /> 1 Point per Correct Answer
            </span>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-300" /> Auto-graded
            </span>
          </div>
        </div>
      </div>

      {/* Scoring Rule Badge */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-5 flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
          +1
        </div>
        <div>
          <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
            Point System: 1 Point per Correct Answer
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            Get an answer right to earn +1 point immediately. Perfect score is 25 / 25 points!
          </p>
        </div>
      </div>

      {/* Topics Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-5">
        <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">
          Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            'HTML & CSS',
            'JavaScript',
            'PHP & SQL',
            'APIs',
            'Variables & Arrays',
            'Functions & Loops',
            'OOP',
            'Debugging',
            'IDE & Tools',
            'Version Control',
          ].map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Name Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
          Enter Your Name (for certificate & leaderboard)
        </label>
        <div className="relative mb-4">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onStartQuiz()}
            placeholder={studentName || 'e.g., Alex Johnson'}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={onRetryLoad}
              className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold hover:bg-red-200 transition"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onStartQuiz}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading Questions...</span>
              </>
            ) : (
              <>
                <span>Start Quiz</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 py-3.5 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
