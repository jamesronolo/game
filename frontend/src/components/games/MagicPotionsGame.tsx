import React, { useState } from 'react';
import { Question } from '../../types';
import { playPotionSound } from '../../utils/soundEffects';
import { Sparkles, Flame, Wand2 } from 'lucide-react';

interface MagicPotionsGameProps {
  question?: Question;
  onTriggerQuestion: () => void;
  isQuestionOpen: boolean;
}

const CREATURES = ['🐸 Frog', '🐉 Baby Dragon', '🦉 Spell Owl', '🦄 Unicorn', '🐱 Wizard Cat'];

export const MagicPotionsGame: React.FC<MagicPotionsGameProps> = ({
  onTriggerQuestion,
  isQuestionOpen,
}) => {
  const [creatureIndex, setCreatureIndex] = useState(0);
  const [isBrewing, setIsBrewing] = useState(false);

  const handleBrewPotion = () => {
    if (isBrewing || isQuestionOpen) return;

    setIsBrewing(true);
    playPotionSound();

    setTimeout(() => {
      setCreatureIndex((prev) => (prev + 1) % CREATURES.length);
      setIsBrewing(false);
      onTriggerQuestion();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-2xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-violet-400 flex items-center justify-center gap-2">
          <Wand2 className="w-6 h-6 text-violet-400" />
          <span>Magic Potion Alchemy!</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Add secret ingredients into the bubbling cauldron to transform magical creatures!
        </p>
      </div>

      {/* Cauldron Stage */}
      <div className="w-full h-72 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-2xl border-2 border-violet-800/80 p-6 relative overflow-hidden shadow-2xl flex flex-col items-center justify-between">
        {/* Creature Companion */}
        <div className="flex flex-col items-center">
          <div className="text-6xl animate-bounce duration-1000 my-2">
            {CREATURES[creatureIndex].split(' ')[0]}
          </div>
          <span className="text-xs font-bold text-violet-300 bg-violet-950/80 px-3 py-1 rounded-full border border-violet-800">
            Current Familiar: {CREATURES[creatureIndex]}
          </span>
        </div>

        {/* Bubbling Cauldron */}
        <div className="relative flex flex-col items-center">
          {/* Bubbles */}
          <div className="flex gap-2 mb-1">
            <span className="text-lg animate-ping">🫧</span>
            <span className="text-xl animate-bounce">✨</span>
            <span className="text-lg animate-ping">🫧</span>
          </div>

          <div className="text-6xl transform drop-shadow-2xl">
            🧪
          </div>
        </div>

        {/* Cauldron Flames */}
        <div className="flex items-center gap-2 text-amber-500 animate-pulse text-xs font-bold">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Potion Heat: Magical Balance</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={handleBrewPotion}
          disabled={isBrewing || isQuestionOpen}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:brightness-110 text-white font-black text-base shadow-xl shadow-violet-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{isBrewing ? 'Brewing Magic Potion...' : 'ADD INGREDIENT FOR QUESTION'}</span>
        </button>
      </div>
    </div>
  );
};
