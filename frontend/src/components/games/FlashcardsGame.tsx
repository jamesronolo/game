import React, { useState } from 'react';
import { Question } from '../../types';
import { speakText } from '../../utils/soundEffects';
import { Layers, RotateCw, Volume2, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface FlashcardsGameProps {
  questions: Question[];
  currentIndex: number;
  onAnswerSubmit: (answer: string) => void;
}

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({
  questions,
  currentIndex,
  onAnswerSubmit,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSelfGrade = (isCorrect: boolean) => {
    setIsFlipped(false);
    setShowHint(false);
    onAnswerSubmit(isCorrect ? currentQ.answer : 'INCORRECT');
  };

  if (!currentQ) return null;

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-sky-400 flex items-center justify-center gap-2">
          <Layers className="w-6 h-6 text-sky-400" />
          <span>Interactive 3D Flashcards</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tap the card to flip and reveal the answer. Self-mark your retention to master vocabulary!
        </p>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full h-72 sm:h-80 perspective cursor-pointer my-4 group"
      >
        <div
          className={`w-full h-full relative duration-500 rounded-2xl shadow-2xl transition-transform transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Prompt / Question) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border-2 border-sky-800/80 rounded-2xl p-6 flex flex-col justify-between text-center shadow-xl">
            <div className="flex items-center justify-between text-xs text-sky-300">
              <span className="font-bold">QUESTION / FRONT</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentQ.promptText);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sky-400"
                title="Speak text"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="my-auto px-4">
              <h3 className="text-2xl font-bold text-white leading-snug">
                {currentQ.promptText}
              </h3>
              {currentQ.hint && showHint && (
                <p className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800/60 p-2 rounded-lg mt-4">
                  💡 Hint: {currentQ.hint}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              {currentQ.hint ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              ) : (
                <span />
              )}
              <span className="flex items-center gap-1 text-sky-400 font-semibold">
                <RotateCw className="w-3.5 h-3.5" /> Tap card to flip answer
              </span>
            </div>
          </div>

          {/* Card Back (Answer / Definition) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-700/80 rounded-2xl p-6 flex flex-col justify-between text-center shadow-xl">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold">ANSWER / BACK</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentQ.answer);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-indigo-400"
                title="Speak answer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="my-auto px-4">
              <p className="text-xs uppercase text-indigo-300 tracking-wider font-bold mb-1">Target Answer:</p>
              <h3 className="text-3xl font-black text-amber-300 tracking-wide">
                {currentQ.answer}
              </h3>
            </div>

            <div className="text-[11px] text-slate-400">
              Self-grade your recall below to log progress
            </div>
          </div>
        </div>
      </div>

      {/* Self Grading Buttons (Visible when flipped or ready) */}
      <div className="mt-4 flex items-center justify-center gap-4 w-full">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            <span>FLIP CARD TO SEE ANSWER</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => handleSelfGrade(false)}
              className="flex-1 py-3.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Need Practice (Retry)</span>
            </button>
            <button
              onClick={() => handleSelfGrade(true)}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Got it Right!</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
