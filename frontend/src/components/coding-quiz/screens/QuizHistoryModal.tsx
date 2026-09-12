import React from 'react';
import { RefreshCw, Award } from 'lucide-react';
import { ProgrammingQuizAttempt } from '../../../types';

interface QuizHistoryModalProps {
  attempts: ProgrammingQuizAttempt[];
  loadingAttempts: boolean;
  onBack: () => void;
}

const getScoreGradient = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 'from-emerald-500 to-teal-600';
  if (pct >= 70) return 'from-sky-500 to-blue-600';
  if (pct >= 50) return 'from-amber-500 to-orange-600';
  return 'from-red-500 to-rose-600';
};

const getScoreColor = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 'text-emerald-600';
  if (pct >= 70) return 'text-sky-600';
  if (pct >= 50) return 'text-amber-600';
  return 'text-red-600';
};

export const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({
  attempts,
  loadingAttempts,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div>
          <h2 className="font-black text-slate-800 dark:text-white text-lg">Attempt History</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {attempts.length} total attempt{attempts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loadingAttempts ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading...
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No attempts yet</p>
          <p className="text-sm">Take the quiz to see your history here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((a, i) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-sm bg-gradient-to-br ${getScoreGradient(
                  a.score,
                  a.totalQuestions
                )} shrink-0`}
              >
                <span className="text-lg leading-none">{a.score}</span>
                <span className="text-[10px] opacity-80 leading-none mt-0.5">/ {a.totalQuestions}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">
                  {a.studentName || 'Anonymous'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {a.correctCount}/{a.totalQuestions} correct ({a.score} pts) • {a.accuracy}% accuracy
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(a.completedAt).toLocaleString()}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-bold ${getScoreColor(a.score, a.totalQuestions)}`}>
                  {a.score / a.totalQuestions >= 0.9
                    ? '🏆'
                    : a.score / a.totalQuestions >= 0.7
                    ? '⭐'
                    : a.score / a.totalQuestions >= 0.5
                    ? '👍'
                    : '💪'}
                </span>
                {i === 0 && <p className="text-[10px] text-slate-400 mt-0.5">Latest</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
