import React from 'react';
import { Trophy, Award, RotateCcw, Sparkles } from 'lucide-react';
import { Game, QuestionAttemptAnswer, Question } from '../../../types';

interface GameOverSummaryProps {
  game: Game;
  score: number;
  questions: Question[];
  answersHistory: QuestionAttemptAnswer[];
  timerSeconds: number;
  onRestart: () => void;
  onClaimSticker: () => void;
}

export const GameOverSummary: React.FC<GameOverSummaryProps> = ({
  game,
  score,
  questions,
  answersHistory,
  timerSeconds,
  onRestart,
  onClaimSticker,
}) => {
  return (
    <div className="w-full max-w-3xl sm:max-w-4xl bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
      <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-amber-500/30 mb-6 animate-bounce">
        <Trophy className="w-12 h-12" />
      </div>

      <h2 className="text-4xl font-black text-white mb-2">Lesson Completed!</h2>
      <p className="text-slate-300 text-base mb-8">
        Awesome work playing <span className="text-sky-400 font-bold">{game.name}</span>!
      </p>

      {/* Score Summary Box */}
      <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Score</p>
          <p className="text-2xl font-black text-amber-400">{score + 100}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Accuracy</p>
          <p className="text-2xl font-black text-emerald-400">
            {questions.length > 0
              ? Math.round(
                  (answersHistory.filter((a) => a.isCorrect).length / questions.length) * 100
                )
              : 100}
            %
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Time</p>
          <p className="text-2xl font-black text-sky-400">{timerSeconds}s</p>
        </div>
      </div>

      {/* Rewards Notification */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-3 mb-6 flex items-center gap-3 text-left">
        <Award className="w-8 h-8 text-purple-400 shrink-0" />
        <div>
          <p className="text-xs font-bold text-purple-200">Rewards Progress Updated!</p>
          <p className="text-[11px] text-purple-300/80">
            You earned +{score + 100} points towards unlocking new sticker tickets!
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
        <button
          onClick={onClaimSticker}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Claim Sticker</span>
        </button>
      </div>
    </div>
  );
};
