import React, { useState } from 'react';
import { Question } from '../../types';
import { playCorrectSound } from '../../utils/soundEffects';
import { Waves, Compass, Sparkles } from 'lucide-react';

interface OceanQuestGameProps {
  question?: Question;
  onTriggerQuestion: () => void;
  isQuestionOpen: boolean;
}

export const OceanQuestGame: React.FC<OceanQuestGameProps> = ({
  onTriggerQuestion,
  isQuestionOpen,
}) => {
  const [depthMeter, setDepthMeter] = useState(150); // meters
  const [isDiving, setIsDiving] = useState(false);

  const handleDiveForChest = () => {
    if (isDiving || isQuestionOpen) return;

    setIsDiving(true);
    playCorrectSound();

    setTimeout(() => {
      setDepthMeter((prev) => prev + 50);
      setIsDiving(false);
      onTriggerQuestion();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-2xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-cyan-400 flex items-center justify-center gap-2">
          <Waves className="w-6 h-6 text-cyan-400" />
          <span>Ocean Quest Sunken Treasure!</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Submerge your submarine into deep waters to open sunken treasure chests!
        </p>
      </div>

      {/* Ocean Stage */}
      <div className="w-full h-72 bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-950 rounded-2xl border-2 border-cyan-700/80 p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Depth Meter HUD */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-800">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300">Depth: {depthMeter} Meters</span>
          </div>
          <span className="text-xs text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
            Submarine Battery 100%
          </span>
        </div>

        {/* Ocean Sea Floor & Submarine */}
        <div className="relative h-36 flex items-center justify-between px-6 z-10">
          {/* Submarine */}
          <div className={`text-6xl transform transition-transform duration-1000 ${isDiving ? 'translate-y-8 scale-110' : ''}`}>
            🟡🤿
          </div>

          {/* Glowing Sunken Chest */}
          <div className="text-6xl animate-bounce duration-1000">
            💎🏴‍☠️
          </div>
        </div>

        {/* Sea Life Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-around">
          <span className="text-2xl animate-pulse">🐬</span>
          <span className="text-2xl animate-bounce">🐙</span>
          <span className="text-2xl animate-pulse">🐠</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={handleDiveForChest}
          disabled={isDiving || isQuestionOpen}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-base shadow-xl shadow-cyan-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-cyan-200" />
          <span>{isDiving ? 'Diving to Ocean Floor...' : 'DIVE FOR TREASURE CHEST'}</span>
        </button>
      </div>
    </div>
  );
};
