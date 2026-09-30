import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Attempt } from '../../../types';

interface AttemptDetailModalProps {
  attempt: Attempt | null;
  onClose: () => void;
}

export const AttemptDetailModal: React.FC<AttemptDetailModalProps> = ({
  attempt,
  onClose,
}) => {
  if (!attempt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Game Response Inspector
            </span>
            <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
              {attempt.studentName}
            </h3>
            <p className="text-xs text-slate-500">
              Set: {attempt.questionSetTitle} • Game: {attempt.gameSlug} • Score: {attempt.score} pts ({attempt.accuracy}%)
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
            Individual Question Breakdown ({attempt.answers?.length || 0})
          </h4>

          {attempt.answers && attempt.answers.length > 0 ? (
            attempt.answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  ans.isCorrect
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                }`}
              >
                <div>
                  <p className="font-bold text-xs">{ans.questionPrompt}</p>
                  <p className="text-[11px] mt-1">
                    Student: <span className="font-bold">{ans.studentAnswer}</span> | Correct:{' '}
                    <span className="font-bold">{ans.correctAnswer}</span>
                  </p>
                </div>

                <div className="shrink-0">
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
