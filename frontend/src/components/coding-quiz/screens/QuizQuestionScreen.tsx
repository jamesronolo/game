import React from 'react';
import { Trophy, Clock, Flame, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';
import { ProgrammingQuizQuestion } from '../../../types';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const OPTION_COLORS: Record<string, string> = {
  A: 'from-violet-500 to-purple-600',
  B: 'from-sky-500 to-blue-600',
  C: 'from-emerald-500 to-green-600',
  D: 'from-orange-500 to-amber-600',
};

interface QuizQuestionScreenProps {
  currentQuestion: ProgrammingQuizQuestion;
  currentIdx: number;
  totalQuestions: number;
  selectedAnswers: Record<string, string>;
  liveScore: number;
  streak: number;
  scoreAnimation: boolean;
  elapsed: number;
  formatTime: (s: number) => string;
  submitting: boolean;
  onSelectOption: (questionId: string, option: string) => void;
  onConfirmAnswer: () => void;
}

export const QuizQuestionScreen: React.FC<QuizQuestionScreenProps> = ({
  currentQuestion,
  currentIdx,
  totalQuestions,
  selectedAnswers,
  liveScore,
  streak,
  scoreAnimation,
  elapsed,
  formatTime,
  submitting,
  onSelectOption,
  onConfirmAnswer,
}) => {
  const selected = selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top Header Bar with Live Score Counter Stamp */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Progress
          </span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-white">
            Question {currentIdx + 1} <span className="text-slate-400 font-normal">of {totalQuestions}</span>
          </span>
        </div>

        {/* Live Tatak Score Badge */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
            scoreAnimation
              ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          <Trophy
            className={`w-4 h-4 ${
              scoreAnimation ? 'text-yellow-200 animate-bounce' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider block leading-none">Score</span>
            <span className="text-sm font-black leading-none">
              {liveScore} <span className="text-[11px] font-medium opacity-75">/ {totalQuestions} pts</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span className="font-mono font-semibold">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[11px] text-slate-400">
          <span>{Object.keys(selectedAnswers).length} answered</span>
          {streak > 1 && (
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {streak} Streak!
            </span>
          )}
          <span>{totalQuestions - Object.keys(selectedAnswers).length} remaining</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            {currentQuestion.number}
          </div>
          <p className="text-slate-800 dark:text-white font-semibold text-base leading-relaxed pt-0.5">
            {currentQuestion.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((opt, i) => {
          const label = OPTION_LABELS[i];
          const isSelected = selected === label;
          return (
            <button
              key={label}
              id={`option-${label}`}
              onClick={() => onSelectOption(currentQuestion.id, label)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-150 group cursor-pointer
                ${
                  isSelected
                    ? `border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 shadow-md shadow-indigo-100 dark:shadow-indigo-950 scale-[1.01]`
                    : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30`
                }`}
            >
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all
                ${
                  isSelected
                    ? `bg-gradient-to-br ${OPTION_COLORS[label]} text-white shadow-sm`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                }`}
              >
                {label}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isSelected ? 'text-indigo-800 dark:text-indigo-200 font-semibold' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {opt}
              </span>
              {isSelected && (
                <CheckCircle2 className="ml-auto w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Confirm Button */}
      <button
        id="confirm-answer-btn"
        onClick={onConfirmAnswer}
        disabled={!selected || submitting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {submitting ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" /> Checking Answer...
          </>
        ) : (
          <>
            {selected ? 'Confirm Answer & Lock Score' : 'Select an Option'} <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};
