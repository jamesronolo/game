import React from 'react';
import {
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  Target,
  BarChart3,
  RefreshCw,
  History,
} from 'lucide-react';
import { ProgrammingQuizAnswerResult } from '../../../types';

interface QuizResultsScreenProps {
  quizResults: any;
  studentName: string;
  onRestart: () => void;
  onViewHistory: () => void;
}

const getScoreGradient = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 'from-emerald-500 to-teal-600';
  if (pct >= 70) return 'from-sky-500 to-blue-600';
  if (pct >= 50) return 'from-amber-500 to-orange-600';
  return 'from-red-500 to-rose-600';
};

const getScoreLabel = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return '🏆 Outstanding Mastery!';
  if (pct >= 70) return '⭐ Great Job!';
  if (pct >= 50) return '👍 Good Effort!';
  return '💪 Keep Practicing!';
};

export const QuizResultsScreen: React.FC<QuizResultsScreenProps> = ({
  quizResults,
  studentName,
  onRestart,
  onViewHistory,
}) => {
  const { score, accuracy, correctCount, totalQuestions: total, graded } = quizResults;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Score Card */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreGradient(
          score,
          total
        )} text-white shadow-2xl p-8 mb-6 text-center`}
      >
        <div className="absolute inset-0 opacity-10 text-9xl leading-none font-black select-none flex items-center justify-center pointer-events-none">
          🏆
        </div>
        <div className="relative z-10">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-200" />
          <div className="text-6xl font-black mb-1">
            {score}
            <span className="text-3xl font-light opacity-80"> / {total} pts</span>
          </div>
          <p className="text-xl font-bold mb-1">{getScoreLabel(score, total)}</p>
          <p className="text-white/80 text-sm">
            {studentName && `${studentName} • `}
            {correctCount}/{total} Correct ({score} Points) • {accuracy}% Accuracy
          </p>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round((score / total) * 5)
                    ? 'text-yellow-300 fill-yellow-300'
                    : 'text-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {correctCount} <span className="text-xs font-semibold text-emerald-500">pts</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Points Earned</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-red-500 dark:text-red-400">{total - correctCount}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Missed (0 pts)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <Target className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accuracy</p>
        </div>
      </div>

      {/* Answer Review Table with Tatak Score per Question */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-5 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Full 25-Question Answer & Score Review
            </h3>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Total: {score}/{total} pts
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
          {graded.map((item: ProgrammingQuizAnswerResult, i: number) => (
            <div
              key={item.questionId}
              className={`flex items-start gap-3 px-5 py-3 ${
                item.isCorrect
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'bg-red-50/50 dark:bg-red-950/20'
              }`}
            >
              <div
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                  item.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {item.question}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {/* Tatak Score Badge */}
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      item.isCorrect ? 'bg-emerald-500 text-white shadow-xs' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.isCorrect ? '+1 Point' : '0 Points'}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300'
                    }`}
                  >
                    Your Answer: Option {item.selectedOption}
                  </span>
                  {!item.isCorrect && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      Correct: Option {item.correctOption} ({item.correctAnswer})
                    </span>
                  )}
                </div>
                {!item.isCorrect && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    💡 {item.explanation}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                {item.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          id="retry-quiz-btn"
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <History className="w-5 h-5" />
          History
        </button>
      </div>
    </div>
  );
};
