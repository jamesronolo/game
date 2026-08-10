import React, { useState } from 'react';
import { Question } from '../../types';
import { playCannonSound } from '../../utils/soundEffects';
import { Ship, Crosshair, Flame } from 'lucide-react';

interface ShipBattleGameProps {
  question?: Question;
  onTriggerQuestion: () => void;
  isQuestionOpen: boolean;
  streak: number;
}

export const ShipBattleGame: React.FC<ShipBattleGameProps> = ({
  onTriggerQuestion,
  isQuestionOpen,
}) => {
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isFiring, setIsFiring] = useState(false);

  const handleFireCannons = () => {
    if (isFiring || isQuestionOpen) return;

    setIsFiring(true);
    playCannonSound();

    setTimeout(() => {
      setEnemyHealth((prev) => Math.max(10, prev - 25));
      setIsFiring(false);
      onTriggerQuestion();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-2xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-blue-400 flex items-center justify-center gap-2">
          <Ship className="w-6 h-6 text-blue-400" />
          <span>Naval Ship Battle!</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Aim your cannons at the enemy vessel. Fire to answer the question and sink the opponent!
        </p>
      </div>

      {/* Sea Battle Canvas / Scene */}
      <div className="w-full h-64 bg-gradient-to-b from-slate-900 via-blue-950 to-blue-900 rounded-2xl border border-blue-800/60 p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Sky / Moon */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-300 font-bold">Enemy Ship HP:</span>
            <div className="w-28 sm:w-36 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                style={{ width: `${enemyHealth}%` }}
              />
            </div>
            <span className="text-xs text-rose-400 font-black">{enemyHealth}%</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-amber-100/20 border border-amber-200/40 shadow-inner" />
        </div>

        {/* Ocean Waves & Ships */}
        <div className="relative h-32 flex items-end justify-between px-6 z-10">
          {/* Player Ship */}
          <div className="relative group">
            <div className="text-5xl sm:text-6xl transform -scale-x-100 drop-shadow-xl animate-bounce duration-1000">
              ⛵
            </div>
            <span className="absolute -bottom-4 left-0 right-0 text-[10px] font-bold text-center text-sky-300">
              Your Frigate
            </span>
            {isFiring && (
              <div className="absolute top-2 -right-8 animate-ping text-2xl">
                💥
              </div>
            )}
          </div>

          {/* Cannonball projectile in flight */}
          {isFiring && (
            <div className="absolute bottom-10 left-20 right-20 h-8 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-orange-600 animate-pulse transition-all duration-500 translate-x-12 -translate-y-8" />
            </div>
          )}

          {/* Enemy Galleon */}
          <div className="relative">
            <div className="text-5xl sm:text-6xl drop-shadow-xl animate-pulse">
              🏴‍☠️
            </div>
            <span className="absolute -bottom-4 left-0 right-0 text-[10px] font-bold text-center text-rose-400">
              Pirate Flagship
            </span>
          </div>
        </div>

        {/* Animated Water Surface */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-blue-600/30 backdrop-blur-2xs rounded-b-xl border-t border-blue-400/30 flex items-center justify-around opacity-60">
          <div className="text-xl opacity-40">🌊</div>
          <div className="text-xl opacity-40">🌊</div>
          <div className="text-xl opacity-40">🌊</div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={handleFireCannons}
          disabled={isFiring || isQuestionOpen}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Crosshair className="w-5 h-5 text-amber-300" />
          <span>{isFiring ? 'Cannons Firing!' : 'FIRE CANNONS FOR QUESTION'}</span>
          <Flame className="w-4 h-4 text-orange-400" />
        </button>
      </div>
    </div>
  );
};
