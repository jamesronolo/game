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

    // Realistic decelerating tick sound sequence timed over exactly 8 seconds (8000ms)
    const tickDelays = [
      70, 150, 230, 310, 390, 470, 550, 630, 710, 790, 880, 980, 1090, 1210, 1340,
      1480, 1630, 1800, 1980, 2180, 2400, 2640, 2900, 3180, 3480, 3810, 4170, 4560,
      4990, 5460, 5970, 6530, 7140, 7700
    ];
    tickDelays.forEach((delay) => {
      setTimeout(() => {
        playSpinTick();
      }, delay);
    });

    // 9 full 360-degree spins + random slice landing offset
    const randomDegrees = 3240 + Math.floor(Math.random() * 360);
    setRotation((prev) => prev + randomDegrees);

    // Wheel comes to a complete stop at exactly 8 seconds (8000ms)
    setTimeout(() => {
      setIsSpinning(false);
      onTriggerQuestion();
    }, 8000);
  };

  // Helper to generate SVG pie slice path d attribute (center at 250,250, radius 240)
  const getSlicePath = (index: number, totalSlices: number) => {
    const anglePerSlice = 360 / totalSlices;
    const startAngle = (index * anglePerSlice - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSlice - 90) * (Math.PI / 180);

    const x1 = 250 + 240 * Math.cos(startAngle);
    const y1 = 250 + 240 * Math.sin(startAngle);
    const x2 = 250 + 240 * Math.cos(endAngle);
    const y2 = 250 + 240 * Math.sin(endAngle);

    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

    return `M 250 250 L ${x1} ${y1} A 240 240 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 px-2">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
          <span>Spin the Prize Wheel!</span>
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
          Spin the wheel to land on a prize sector and unlock your next question challenge.
        </p>
      </div>

      {/* Wheel Stage - Responsive & Centered Container */}
      <div className="relative w-full max-w-[320px] sm:max-w-[460px] md:max-w-[500px] aspect-square my-4 flex items-center justify-center">
        {/* Top Pointer Needle - Centered precisely */}
        <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[18px] sm:border-l-[24px] border-l-transparent border-r-[18px] sm:border-r-[24px] border-r-transparent border-t-[32px] sm:border-t-[44px] border-t-amber-400 drop-shadow-2xl" />

        {/* Outer Wheel Container */}
        <div className="w-full h-full rounded-full border-8 sm:border-[12px] border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden flex items-center justify-center">
          {/* Rotating Vector SVG Wheel */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[8000ms] cubic-bezier(0.08, 0.8, 0.15, 1.0)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 500 500" className="w-full h-full">
              {SLICES.map((slice, i) => {
                const anglePerSlice = 360 / SLICES.length;
                const midAngle = (i * anglePerSlice + anglePerSlice / 2 - 90) * (Math.PI / 180);
                const textRadius = 150;
                const textX = 250 + textRadius * Math.cos(midAngle);
                const textY = 250 + textRadius * Math.sin(midAngle);
                const textRotation = i * anglePerSlice + anglePerSlice / 2;

                return (
                  <g key={i}>
                    {/* SVG Pie Slice */}
                    <path
                      d={getSlicePath(i, SLICES.length)}
                      fill={slice.color}
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    {/* Centered Label */}
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="22"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      className="select-none font-black drop-shadow-lg"
                    >
                      {slice.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button - Centered precisely */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || isQuestionOpen}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 font-black text-xs sm:text-base uppercase tracking-wider flex flex-col items-center justify-center shadow-2xl border-4 sm:border-8 border-slate-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
          >
            <Play className="w-7 h-7 sm:w-10 sm:h-10 fill-slate-950 ml-0.5" />
            <span>{isSpinning ? 'SPINNING' : 'SPIN'}</span>
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={spinWheel}
          disabled={isSpinning || isQuestionOpen}
          className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 text-slate-950 font-extrabold text-base sm:text-xl shadow-2xl shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-60"
        >
          <Award className="w-6 h-6 text-slate-950" />
          <span>{isSpinning ? 'Wheel Spinning (8s)...' : 'SPIN FOR QUESTION!'}</span>
        </button>
      </div>
    </div>
  );
};

