import React from 'react';
import { CheckCircle2, Zap, GraduationCap, Trophy } from 'lucide-react';

interface ProgressSummaryCardsProps {
  totalCompleted: number;
  avgAccuracy: number;
  masteryRate: number;
  masteryCount: number;
  totalScore: number;
}

export const ProgressSummaryCards: React.FC<ProgressSummaryCardsProps> = ({
  totalCompleted,
  avgAccuracy,
  masteryRate,
  masteryCount,
  totalScore,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-13 h-13 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-inner shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Submissions
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {totalCompleted}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Games & Code Quizzes</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-inner shrink-0">
          <Zap className="w-7 h-7" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Average Accuracy
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {avgAccuracy}%
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Classroom Overall</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-13 h-13 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-inner shrink-0">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Mastery Rate (≥80%)
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {masteryRate}%
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{masteryCount} of {totalCompleted} passed</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-13 h-13 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-inner shrink-0">
          <Trophy className="w-7 h-7" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Score Points
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-500 mt-0.5">{totalScore}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Cumulative Rewards</p>
        </div>
      </div>
    </div>
  );
};
