import React from 'react';
import {
  Sparkles,
  XCircle,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { ProgrammingQuizQuestion, ProgrammingQuizAnswerResult } from '../../../types';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

interface QuizFeedbackScreenProps {
  feedbackResult: ProgrammingQuizAnswerResult;
  currentQuestion: ProgrammingQuizQuestion | null;
  currentIdx: number;
  totalQuestions: number;
  liveScore: number;
  showExplanation: boolean;
  setShowExplanation: React.Dispatch<React.SetStateAction<boolean>>;
  submitting: boolean;
  onNextQuestion: () => void;
}

export const QuizFeedbackScreen: React.FC<QuizFeedbackScreenProps> = ({
  feedbackResult,
  currentQuestion,
  currentIdx,
  totalQuestions,
  liveScore,
  showExplanation,
  setShowExplanation,
  submitting,
  onNextQuestion,
}) => {
  const isLast = currentIdx >= totalQuestions - 1;
  const isCorrect = feedbackResult.isCorrect;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Result & Tatak Score Banner */}
      <div
        className={`rounded-3xl p-6 mb-5 text-center shadow-xl border-2 ${
          isCorrect
            ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 border-emerald-400 text-white shadow-emerald-600/30'
            : 'bg-gradient-to-br from-red-500 via-rose-600 to-red-700 border-red-400 text-white shadow-red-600/30'
        }`}
      >
        <div className="text-5xl mb-2">{isCorrect ? '🎉' : '❌'}</div>
        <p className="text-3xl font-black mb-1">{isCorrect ? 'CORRECT!' : 'INCORRECT'}</p>

        {/* Prominent Score Stamp ("Tatak na Score") */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 my-3 shadow-inner">
          {isCorrect ? (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="font-black text-lg tracking-wide text-yellow-200">
                +1 POINT EARNED!
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="text-sm font-bold text-white">
                Total Score: {liveScore} / {totalQuestions} pts
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-white/80" />
              <span className="font-bold text-base text-white/90">
                +0 Points (No point added)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="text-sm font-semibold text-white/90">
                Total Score: {liveScore} / {totalQuestions} pts
              </span>
            </>
          )}
        </div>

        <p className="text-white/80 text-xs mt-1">
          Question {feedbackResult.number} of {totalQuestions}
        </p>
      </div>

      {/* Question Recap with Correct Answer Highlight */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-4">
        <p className="font-semibold text-slate-800 dark:text-white text-sm mb-4 leading-relaxed">
          {feedbackResult.question}
        </p>

        <div className="space-y-2">
          {currentQuestion &&
            currentQuestion.options.map((opt, i) => {
              const label = OPTION_LABELS[i];
              const isSelected = feedbackResult.selectedOption === label;
              const isCorrectOpt = feedbackResult.correctOption === label;

              let style =
                'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400';
              let icon = null;
              let scoreBadge = null;

              if (isCorrectOpt) {
                style =
                  'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 shadow-sm font-semibold';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
                scoreBadge = (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-black tracking-wide">
                    +1 pt (Correct Answer)
                  </span>
                );
              } else if (isSelected && !isCorrect) {
                style =
                  'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 line-through';
                icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
                scoreBadge = (
                  <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[11px] font-bold">
                    0 pt (Your choice)
                  </span>
                );
              }

              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${style}`}
                >
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs
                    ${
                      isCorrectOpt
                        ? 'bg-emerald-500 text-white'
                        : isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {label}
                  </div>
                  <span className="text-sm font-medium flex-1">{opt}</span>
                  {scoreBadge}
                  {icon}
                </div>
              );
            })}
        </div>
      </div>

      {/* Auto Correction & Explanation accordion */}
      <button
        onClick={() => setShowExplanation((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors mb-4 font-semibold text-sm cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Auto Correction & Explanation
        </span>
        <ChevronRight className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
      </button>

      {showExplanation && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mb-4 text-sm text-amber-900 dark:text-amber-200 leading-relaxed animate-in fade-in duration-200">
          <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
            Why this answer:
          </p>
          {feedbackResult.explanation}
        </div>
      )}

      {/* Next Button */}
      <button
        id="next-question-btn"
        onClick={onNextQuestion}
        disabled={submitting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {submitting ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" /> Calculating Final Results...
          </>
        ) : isLast ? (
          <>
            <Trophy className="w-5 h-5 text-yellow-300" /> See Final Results ({liveScore} / {totalQuestions} pts)
          </>
        ) : (
          <>
            Next Question <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};
