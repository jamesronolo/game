import React, { useState } from 'react';
import { playDiceSound } from '../../../utils/soundEffects';

export const DiceTool: React.FC = () => {
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);
  const [isRolling, setIsRolling] = useState(false);

  const rollVirtualDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    let count = 0;
    const interval = setInterval(() => {
      setDiceResults(Array.from({ length: diceCount }, () => Math.floor(1 + Math.random() * 6)));
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 90);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl text-center flex flex-col items-center space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Virtual 3D Classroom Dice</h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Roll 1, 2, or 3 interactive dice for classroom math drills, turn-taking, or board game activities!
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Dice:</span>
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => {
              setDiceCount(num);
              setDiceResults(Array.from({ length: num }, () => Math.floor(1 + Math.random() * 6)));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              diceCount === num
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            {num} {num === 1 ? 'Die' : 'Dice'}
          </button>
        ))}
      </div>

      {/* Dice Display Stage */}
      <div className="flex flex-wrap items-center justify-center gap-8 my-8">
        {diceResults.map((val, idx) => (
          <div
            key={idx}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 text-slate-950 font-black text-5xl sm:text-6xl flex items-center justify-center shadow-2xl border-4 sm:border-8 border-slate-950 transition-all transform ${
              isRolling ? 'animate-bounce scale-105' : 'hover:scale-105'
            }`}
          >
            {val}
          </div>
        ))}
      </div>

      <button
        onClick={rollVirtualDice}
        disabled={isRolling}
        className="px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
      >
        {isRolling ? 'Rolling Dice...' : '🎲 ROLL DICE NOW'}
      </button>
    </div>
  );
};
