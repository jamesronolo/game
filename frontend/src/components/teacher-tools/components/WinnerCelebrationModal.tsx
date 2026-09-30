import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { ClassStudent } from '../../../types';

interface WinnerCelebrationModalProps {
  winner: ClassStudent;
  onClose: () => void;
  onRewardStars?: (studentId: string, delta: number) => void;
  onExcludeStudent?: (studentId: string) => void;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  winner,
  onClose,
  onRewardStars,
  onExcludeStudent,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border-4 border-amber-400 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-amber-500 flex items-center justify-center text-5xl shadow-xl animate-bounce">
          {winner.avatar}
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-widest rounded-full border border-amber-300">
            Selected Winner!
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            {winner.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            It is your turn to speak, lead the team, or solve the challenge!
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          {onRewardStars && (
            <button
              onClick={() => {
                onRewardStars(winner.id, 2);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              Award +2 Bonus Stars!
            </button>
          )}

          <div className="flex gap-2">
            {onExcludeStudent && (
              <button
                onClick={() => {
                  onExcludeStudent(winner.id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
              >
                Skip for next spin
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
