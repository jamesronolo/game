import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { playCorrectSound, playWrongSound, speakText } from '../../utils/soundEffects';
import { Rocket, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface AlienSpellingGameProps {
  question?: Question;
  onAnswerSubmit: (answer: string) => void;
  streak: number;
}

export const AlienSpellingGame: React.FC<AlienSpellingGameProps> = ({
  question,
  onAnswerSubmit,
}) => {
  const [constructedLetters, setConstructedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  const targetWord = (question?.answer || '').toUpperCase().trim();
  const cleanChars = targetWord.replace(/[^A-Z0-9]/g, '').split('');

  useEffect(() => {
    if (!targetWord) return;

    // Create scrambled letters + extra distractor letters
    const wordChars = cleanChars.length > 0 ? cleanChars : targetWord.split('');
    const distractors = ['A', 'E', 'I', 'O', 'U', 'S', 'T', 'R', 'L', 'N', 'M', 'P']
      .filter((c) => !wordChars.includes(c))
      .slice(0, 3);

    const allChars = [...wordChars, ...distractors].sort(() => Math.random() - 0.5);

    setAvailableLetters(allChars);
    setConstructedLetters([]);
  }, [question, targetWord]);

  const addLetter = (letter: string, index: number) => {
    setConstructedLetters((prev) => [...prev, letter]);
    setAvailableLetters((prev) => prev.filter((_, i) => i !== index));
    speakText(letter);
  };

  const removeLetter = (letter: string, index: number) => {
    setConstructedLetters((prev) => prev.filter((_, i) => i !== index));
    setAvailableLetters((prev) => [...prev, letter]);
  };

  const handleCheckSpelling = () => {
    const spelledWord = constructedLetters.join('');
    onAnswerSubmit(spelledWord);
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-3xl sm:max-w-4xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-purple-400 flex items-center justify-center gap-3">
          <Rocket className="w-8 h-8 text-purple-400" />
          <span>Alien Spelling Signals!</span>
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Help alien astronauts assemble cosmic letter tiles to spell the target word correctly!
        </p>
      </div>

      {/* Alien Cosmonaut Stage */}
      <div className="w-full bg-slate-900 border-2 border-purple-900/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-900/60">
          <div className="flex items-center gap-4">
            <span className="text-5xl sm:text-6xl animate-bounce">👾</span>
            <div className="text-left">
              <span className="text-sm font-extrabold text-purple-300 uppercase tracking-wider">Captain Cosmo</span>
              <p className="text-base sm:text-lg font-bold text-white leading-snug">
                "{question?.promptText || 'Spell the target word!'}"
              </p>
            </div>
          </div>

          <button
            onClick={() => speakText(question?.promptText || targetWord)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-200 bg-purple-950/90 border border-purple-700 px-4 py-2.5 rounded-xl hover:bg-purple-900 transition-colors shadow-sm"
          >
            <Volume2 className="w-5 h-5 text-purple-400" />
            <span>Hear Word</span>
          </button>
        </div>

        {/* Letter Slots Construction Area */}
        <div className="min-h-24 bg-slate-950 border-2 border-dashed border-purple-700/80 rounded-2xl p-4 sm:p-6 flex items-center justify-center gap-3 my-6 flex-wrap shadow-inner">
          {constructedLetters.length === 0 ? (
            <span className="text-sm text-slate-500 font-medium italic">Tap letter tiles below to spell target word...</span>
          ) : (
            constructedLetters.map((char, idx) => (
              <button
                key={idx}
                onClick={() => removeLetter(char, idx)}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl font-black text-2xl sm:text-3xl text-white shadow-xl border-2 border-purple-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                {char}
              </button>
            ))
          )}
        </div>

        {/* Available Scrambled Letter Tiles */}
        <div className="mt-8">
          <p className="text-xs uppercase font-extrabold text-slate-300 tracking-widest mb-3 text-center">
            Available Cosmic Letter Tiles:
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {availableLetters.map((char, idx) => (
              <button
                key={idx}
                onClick={() => addLetter(char, idx)}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 rounded-2xl font-black text-xl sm:text-2xl text-purple-200 hover:text-white hover:border-purple-400 active:scale-95 transition-all shadow-lg flex items-center justify-center"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Submit */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => {
            const wordChars = cleanChars.length > 0 ? cleanChars : targetWord.split('');
            const distractors = ['A', 'E', 'I', 'O', 'U', 'S', 'T', 'R', 'L', 'N', 'M', 'P']
              .filter((c) => !wordChars.includes(c))
              .slice(0, 3);
            setAvailableLetters([...wordChars, ...distractors].sort(() => Math.random() - 0.5));
            setConstructedLetters([]);
          }}
          className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors shadow-md border border-slate-700"
          title="Reset letters"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <button
          onClick={handleCheckSpelling}
          disabled={constructedLetters.length === 0}
          className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white font-black text-lg sm:text-xl shadow-2xl shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6 text-purple-200" />
          <span>CHECK SPELLING</span>
        </button>
      </div>
    </div>
  );
};
