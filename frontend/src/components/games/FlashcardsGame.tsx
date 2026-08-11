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
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-3xl sm:max-w-4xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-sky-400 flex items-center justify-center gap-3">
          <Layers className="w-8 h-8 text-sky-400" />
          <span>Interactive 3D Flashcards</span>
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Tap the card to flip and reveal the answer. Self-mark your retention to master vocabulary!
        </p>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full h-96 sm:h-[420px] perspective cursor-pointer my-6 group"
      >
        <div
          className={`w-full h-full relative duration-500 rounded-3xl shadow-2xl transition-transform transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Prompt / Question) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border-2 border-sky-700/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-center shadow-2xl">
            <div className="flex items-center justify-between text-xs sm:text-sm text-sky-300">
              <span className="font-extrabold tracking-wider">QUESTION / FRONT</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentQ.promptText);
                }}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sky-400 transition"
                title="Speak text"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="my-auto px-4">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-snug tracking-tight">
                {currentQ.promptText}
              </h3>
              {currentQ.hint && showHint && (
                <p className="text-sm text-amber-200 bg-amber-950/70 border border-amber-800/80 p-3 rounded-xl mt-4 leading-relaxed">
                  💡 Hint: {currentQ.hint}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              {currentQ.hint ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-1.5 font-bold"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              ) : (
                <span />
              )}
              <span className="flex items-center gap-1.5 text-sky-400 font-bold text-xs sm:text-sm">
                <RotateCw className="w-4 h-4" /> Tap card to flip answer
              </span>
            </div>
          </div>

          {/* Card Back (Answer / Definition) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-600/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-center shadow-2xl">
            <div className="flex items-center justify-between text-xs sm:text-sm text-indigo-300">
              <span className="font-extrabold tracking-wider">ANSWER / BACK</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentQ.answer);
                }}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-indigo-400 transition"
                title="Speak answer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="my-auto px-4">
              <p className="text-xs sm:text-sm uppercase text-indigo-300 tracking-widest font-extrabold mb-2">Target Answer:</p>
              <h3 className="text-4xl sm:text-5xl font-black text-amber-300 tracking-wide">
                {currentQ.answer}
              </h3>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              Self-grade your recall below to log progress
            </div>
          </div>
        </div>
      </div>

      {/* Self Grading Buttons (Visible when flipped or ready) */}
      <div className="mt-6 flex items-center justify-center gap-4 w-full">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-sky-600/25 transition-all flex items-center justify-center gap-2"
          >
            <RotateCw className="w-5 h-5" />
            <span>FLIP CARD TO SEE ANSWER</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => handleSelfGrade(false)}
              className="flex-1 py-4 rounded-2xl bg-rose-950/90 hover:bg-rose-900 border-2 border-rose-700 text-rose-200 font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Need Practice (Retry)</span>
            </button>
            <button
              onClick={() => handleSelfGrade(true)}
              className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>Got it Right!</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
