import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { ProgrammingQuizAttempt } from '../../../types';

interface CodingAttemptDetailModalProps {
  attempt: ProgrammingQuizAttempt | null;
  onClose: () => void;
}

export const CodingAttemptDetailModal: React.FC<CodingAttemptDetailModalProps> = ({
  attempt,
  onClose,
}) => {
  if (!attempt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Programming Quiz Inspector
            </span>
            <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
              {attempt.studentName || 'Anonymous'}
            </h3>
            <p className="text-xs text-slate-500">
              Score:{' '}
              <span className="font-black text-emerald-600">
                {attempt.score} / {attempt.totalQuestions} pts
              </span>{' '}
              • {attempt.accuracy}% Accuracy • {new Date(attempt.completedAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            25 Questions Breakdown ({attempt.answers?.length || 0})
          </h4>

          {attempt.answers && attempt.answers.length > 0 ? (
            attempt.answers.map((ans: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                  ans.isCorrect
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-white">
                    {idx + 1}. {ans.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        ans.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {ans.isCorrect ? '+1 Point' : '0 Points'}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300">
                      Selected: Option {ans.selectedOption} | Correct: Option {ans.correctOption} ({ans.correctAnswer})
                    </span>
                  </div>
                  {!ans.isCorrect && ans.explanation && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                      💡 {ans.explanation}
                    </p>
                  )}
                </div>

                <div className="shrink-0 mt-0.5">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <X className="w-5 h-5 text-rose-600" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No question breakdown recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};
