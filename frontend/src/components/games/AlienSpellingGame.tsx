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
    <div className="flex flex-col items-center justify-center my-auto w-full py-4 max-w-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-purple-400 flex items-center justify-center gap-2">
          <Rocket className="w-6 h-6 text-purple-400" />
          <span>Alien Spelling Signals!</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Help alien astronauts assemble cosmic letter tiles to spell the target word correctly!
        </p>
      </div>

      {/* Alien Cosmonaut Stage */}
      <div className="w-full bg-slate-900 border border-purple-900/60 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-4xl">👾</span>
            <div className="text-left">
              <span className="text-xs font-bold text-purple-300">Captain Cosmo</span>
              <p className="text-xs text-slate-400">"{question?.promptText || 'Spell the word'}"</p>
            </div>
          </div>

          <button
            onClick={() => speakText(question?.promptText || targetWord)}
            className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/80 border border-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-900 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>Hear Word</span>
          </button>
        </div>

        {/* Letter Slots Construction Area */}
        <div className="min-h-16 bg-slate-950 border-2 border-dashed border-purple-800/80 rounded-xl p-3 flex items-center justify-center gap-2 my-4 flex-wrap">
          {constructedLetters.length === 0 ? (
            <span className="text-xs text-slate-500 italic">Tap letter tiles below to spell target word...</span>
          ) : (
            constructedLetters.map((char, idx) => (
              <button
                key={idx}
                onClick={() => removeLetter(char, idx)}
                className="w-11 h-11 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl font-black text-lg text-white shadow-lg border border-purple-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                {char}
              </button>
            ))
          )}
        </div>

        {/* Available Scrambled Letter Tiles */}
        <div className="mt-6">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
            Available Cosmic Letter Tiles:
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {availableLetters.map((char, idx) => (
              <button
                key={idx}
                onClick={() => addLetter(char, idx)}
                className="w-11 h-11 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold text-base text-purple-200 hover:text-white hover:border-purple-400 active:scale-95 transition-all shadow-md flex items-center justify-center"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Submit */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => {
            const wordChars = cleanChars.length > 0 ? cleanChars : targetWord.split('');
            const distractors = ['A', 'E', 'I', 'O', 'U', 'S', 'T', 'R', 'L', 'N', 'M', 'P']
              .filter((c) => !wordChars.includes(c))
              .slice(0, 3);
            setAvailableLetters([...wordChars, ...distractors].sort(() => Math.random() - 0.5));
            setConstructedLetters([]);
          }}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          title="Reset letters"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleCheckSpelling}
          disabled={constructedLetters.length === 0}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-purple-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-purple-200" />
          <span>CHECK SPELLING</span>
        </button>
      </div>
    </div>
  );
};
