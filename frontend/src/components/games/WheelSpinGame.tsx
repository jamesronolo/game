import React, { useState } from 'react';
import { Question } from '../../types';
import { playSpinTick } from '../../utils/soundEffects';
import { Sparkles, Play, Award } from 'lucide-react';

interface WheelSpinGameProps {
  question?: Question;
  onTriggerQuestion: () => void;
  isQuestionOpen: boolean;
  score: number;
}

const SLICES = [
  { label: '100 PTS', color: '#f59e0b' },
  { label: '200 PTS', color: '#3b82f6' },
  { label: 'DOUBLE', color: '#10b981' },
  { label: '150 PTS', color: '#8b5cf6' },
  { label: 'SUPER', color: '#ec4899' },
  { label: '300 PTS', color: '#06b6d4' },
];

export const WheelSpinGame: React.FC<WheelSpinGameProps> = ({
  question,
  onTriggerQuestion,
  isQuestionOpen,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    if (isSpinning || isQuestionOpen) return;

    setIsSpinning(true);
    // Play ticks during rotation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playSpinTick();
      tickCount++;
      if (tickCount > 15) clearInterval(tickInterval);
    }, 120);

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    setRotation((prev) => prev + randomDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      onTriggerQuestion();
    }, 2200);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-300" />
          <span>Spin the Prize Wheel!</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Spin the wheel to land on a prize sector and unlock your next question challenge.
        </p>
      </div>

      {/* Wheel Stage */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
        {/* Top Pointer Needle */}
        <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-md" />

        {/* Outer Wheel Rim */}
        <div className="w-full h-full rounded-full border-8 border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden flex items-center justify-center">
          {/* Rotating Canvas container */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[2200ms] cubic-bezier(0.15, 0.85, 0.35, 1.0)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SLICES.map((slice, i) => {
              const angle = (360 / SLICES.length) * i;
              return (
                <div
                  key={i}
                  className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center"
                  style={{
                    backgroundColor: slice.color,
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                  }}
                >
                  <span
                    className="text-xs font-black text-white drop-shadow-md select-none transform rotate-45 translate-x-4 translate-y-4"
                  >
                    {slice.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || isQuestionOpen}
            className="absolute z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center shadow-xl border-4 border-slate-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
          >
            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
            <span>SPIN</span>
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={spinWheel}
          disabled={isSpinning || isQuestionOpen}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Award className="w-5 h-5 text-slate-950" />
          <span>{isSpinning ? 'Spinning Wheel...' : 'SPIN FOR QUESTION!'}</span>
        </button>
      </div>
    </div>
  );
};
