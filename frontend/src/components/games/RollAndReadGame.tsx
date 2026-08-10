import React, { useState } from 'react';
import { Question } from '../../types';
import { playDiceSound, speakText } from '../../utils/soundEffects';
import { Dices, Volume2, CheckCircle2, Sparkles } from 'lucide-react';

interface RollAndReadGameProps {
  question?: Question;
  questions?: Question[];
  onTriggerQuestion?: () => void;
  onAnswerSubmit: (answer: string) => void;
}

export const RollAndReadGame: React.FC<RollAndReadGameProps> = ({
  question,
  questions = [],
  onAnswerSubmit,
}) => {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  const activeQ = question || questions[0];

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    playDiceSound();

    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(1 + Math.random() * 6));
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalVal = Math.floor(1 + Math.random() * 6);
        setDiceValue(finalVal);
        setIsRolling(false);
        setHasRolled(true);

        if (activeQ) {
          speakText(activeQ.promptText);
        }
      }
    }, 100);
  };

  const handleMarkReadAloud = (isCorrect: boolean) => {
    if (!activeQ) return;
    onAnswerSubmit(isCorrect ? activeQ.answer : 'INCORRECT');
    setHasRolled(false);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-2xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-orange-400 flex items-center justify-center gap-2">
          <Dices className="w-6 h-6 text-orange-400" />
          <span>Roll & Read Articulation Drills</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Roll the 3D dice to select a target row. Read the word or articulation prompt out loud!
        </p>
      </div>

      {/* Dice & Active Item Stage */}
      <div className="w-full bg-slate-900 border border-orange-800/60 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
        {/* Dice Cube Graphic */}
        <div
          onClick={rollDice}
          className={`w-24 h-24 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 border-4 border-amber-200 text-slate-950 font-black text-4xl flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all my-2 ${
            isRolling ? 'animate-spin' : ''
          }`}
        >
          {diceValue !== null ? diceValue : '🎲'}
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {isRolling
            ? 'Rolling dice...'
            : diceValue === null
            ? 'Tap the dice to roll!'
            : `Rolled a ${diceValue}!`}
        </p>

        {/* Selected Word Card */}
        {hasRolled && activeQ && (
          <div className="w-full bg-slate-950 border border-orange-700/60 rounded-xl p-5 my-4 text-center animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-xs text-orange-400 mb-2">
              <span className="font-bold">Target Reading Prompt (Dice #{diceValue}):</span>
              <button
                onClick={() => speakText(activeQ.promptText)}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Listen TTS</span>
              </button>
            </div>

            <h3 className="text-2xl font-extrabold text-white my-3">
              "{activeQ.promptText}"
            </h3>

            {activeQ.hint && (
              <p className="text-xs text-amber-300 italic mb-3">
                💡 SLP Articulation Note: {activeQ.hint}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => handleMarkReadAloud(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Read Aloud Correctly!</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Roll Button */}
      <div className="mt-6">
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-base shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Dices className="w-5 h-5 text-slate-950" />
          <span>{isRolling ? 'Rolling Dice...' : 'ROLL DICE FOR TARGET'}</span>
        </button>
      </div>
    </div>
  );
};
