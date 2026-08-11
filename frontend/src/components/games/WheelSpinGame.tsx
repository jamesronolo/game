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

    // Realistic decelerating tick sounds over 9 seconds (fast initial spin, 4-second slow crawl at end)
    const tickDelays = [
      80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1060, 1170, 1290,
      1420, 1560, 1720, 1900, 2100, 2320, 2560, 2820, 3110, 3430, 3780, 4170, 4600,
      5080, 5600, 6180, 6820, 7520, 8250, 8750
    ];
    tickDelays.forEach((delay) => {
      setTimeout(() => {
        playSpinTick();
      }, delay);
    });

    // 9 full 360-degree spins + random slice landing offset
    const randomDegrees = 3240 + Math.floor(Math.random() * 360);
    setRotation((prev) => prev + randomDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      onTriggerQuestion();
    }, 9000);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-300" />
          <span>Spin the Prize Wheel!</span>
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
          Spin the wheel to land on a prize sector and unlock your next question challenge.
        </p>
      </div>

      {/* Wheel Stage */}
      <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] my-6 flex items-center justify-center">
        {/* Top Pointer Needle */}
        <div className="absolute -top-5 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[38px] border-t-amber-400 drop-shadow-xl" />

        {/* Outer Wheel Rim */}
        <div className="w-full h-full rounded-full border-8 sm:border-[12px] border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden flex items-center justify-center">
          {/* Rotating Canvas container */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[9000ms] cubic-bezier(0.08, 0.8, 0.15, 1.0)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SLICES.map((slice, i) => {
              const sliceAngle = 360 / SLICES.length;
              const startAngle = sliceAngle * i;
              const bisectorAngle = startAngle + sliceAngle / 2;

              return (
                <React.Fragment key={i}>
                  {/* Slice Polygon */}
                  <div
                    className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left"
                    style={{
                      backgroundColor: slice.color,
                      transform: `rotate(${startAngle}deg)`,
                      clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                    }}
                  />
                  {/* Centered Label */}
                  <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-0 origin-left flex items-center justify-center pl-10 sm:pl-16 z-10 pointer-events-none"
                    style={{
                      transform: `rotate(${bisectorAngle - 90}deg)`,
                    }}
                  >
                    <span className="text-sm sm:text-lg font-black text-white drop-shadow-md select-none whitespace-nowrap">
                      {slice.label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Center Hub Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || isQuestionOpen}
            className="absolute z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-sm sm:text-lg uppercase tracking-wider flex flex-col items-center justify-center shadow-2xl border-4 sm:border-8 border-slate-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-0.5" />
            <span>SPIN</span>
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8">
        <button
          onClick={spinWheel}
          disabled={isSpinning || isQuestionOpen}
          className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold text-lg sm:text-xl shadow-2xl shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-3"
        >
          <Award className="w-6 h-6 text-slate-950" />
          <span>{isSpinning ? 'Spinning Wheel...' : 'SPIN FOR QUESTION!'}</span>
        </button>
      </div>
    </div>
  );
};
