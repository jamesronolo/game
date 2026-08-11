import React, { useState } from 'react';
import { Question } from '../../types';
import { playClawSound } from '../../utils/soundEffects';
import { Box, ArrowDown, Sparkles, MoveLeft, MoveRight } from 'lucide-react';

interface CraneGameProps {
  question?: Question;
  onTriggerQuestion: () => void;
  isQuestionOpen: boolean;
}

export const CraneGame: React.FC<CraneGameProps> = ({
  onTriggerQuestion,
  isQuestionOpen,
}) => {
  const [clawX, setClawX] = useState(50); // percentage 10% - 90%
  const [isDropping, setIsDropping] = useState(false);

  const moveClaw = (direction: 'left' | 'right') => {
    if (isDropping || isQuestionOpen) return;
    setClawX((prev) => {
      if (direction === 'left') return Math.max(15, prev - 15);
      return Math.min(85, prev + 15);
    });
  };

  const dropClaw = () => {
    if (isDropping || isQuestionOpen) return;

    setIsDropping(true);
    playClawSound();

    setTimeout(() => {
      setIsDropping(false);
      onTriggerQuestion();
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-3xl sm:max-w-4xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 flex items-center justify-center gap-3">
          <Box className="w-8 h-8 text-emerald-400" />
          <span>Arcade Claw Machine!</span>
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Position the arcade claw over prize boxes and press DROP to lift a question box!
        </p>
      </div>

      {/* Claw Arcade Machine Cabinet */}
      <div className="w-full h-96 sm:h-[420px] bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 rounded-3xl border-4 sm:border-8 border-emerald-600/80 p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Overhead Gantry Rail */}
        <div className="w-full h-6 bg-slate-800 rounded-full relative border-2 border-slate-700">
          {/* Moving Claw Assembly */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
            style={{ left: `${clawX}%` }}
          >
            {/* Cable Line */}
            <div
              className={`w-1.5 bg-slate-300 transition-all duration-700 ${
                isDropping ? 'h-56' : 'h-10'
              }`}
            />
            {/* Claw Tongs */}
            <div className="text-4xl sm:text-5xl transform -translate-y-2 animate-pulse">
              🦾
            </div>
          </div>
        </div>

        {/* Prize Boxes Floor */}
        <div className="relative h-28 bg-emerald-950/50 rounded-2xl border-2 border-emerald-800/50 flex items-center justify-around px-6">
          <div className="text-5xl sm:text-6xl animate-bounce duration-1000">🎁</div>
          <div className="text-5xl sm:text-6xl animate-bounce duration-700">📦</div>
          <div className="text-5xl sm:text-6xl animate-bounce duration-1200">🎁</div>
          <div className="text-5xl sm:text-6xl animate-bounce duration-800">📦</div>
        </div>
      </div>

      {/* Arcade Joystick Controls */}
      <div className="mt-8 flex items-center gap-6">
        <button
          onClick={() => moveClaw('left')}
          disabled={isDropping || isQuestionOpen}
          className="p-5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-2xl transition-all shadow-lg border border-slate-700"
          title="Move Claw Left"
        >
          <MoveLeft className="w-8 h-8" />
        </button>

        <button
          onClick={dropClaw}
          disabled={isDropping || isQuestionOpen}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-lg sm:text-xl shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-3"
        >
          <ArrowDown className="w-6 h-6 text-slate-950 animate-bounce" />
          <span>{isDropping ? 'Lifting Prize...' : 'DROP CLAW FOR QUESTION'}</span>
        </button>

        <button
          onClick={() => moveClaw('right')}
          disabled={isDropping || isQuestionOpen}
          className="p-5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-2xl transition-all shadow-lg border border-slate-700"
          title="Move Claw Right"
        >
          <MoveRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
