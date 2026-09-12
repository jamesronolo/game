import React from 'react';
import {
  Volume2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Question } from '../../../types';
import { speakText } from '../../../utils/soundEffects';

interface QuestionModalProps {
  isOpen: boolean;
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  showHint: boolean;
  setShowHint: (val: boolean) => void;
  selectedOption: string | null;
  setSelectedOption: (opt: string) => void;
  feedback: 'correct' | 'wrong' | null;
  isOptionCorrect: (opt: string, targetAnswer: string) => boolean;
  onAnswerSubmit: (opt: string) => void;
  onAdvanceToNextQuestion: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  showHint,
  setShowHint,
  selectedOption,
  setSelectedOption,
  feedback,
  isOptionCorrect,
  onAnswerSubmit,
  onAdvanceToNextQuestion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl sm:max-w-4xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header / Type badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-950/90 px-3.5 py-1.5 rounded-full border border-sky-800/80 shadow-sm">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>

          <button
            onClick={() => speakText(currentQuestion.promptText)}
            className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
            title="Read question aloud"
          >
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>Listen Aloud</span>
          </button>
        </div>

        {/* Prompt Text */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-snug tracking-tight">
          {currentQuestion.promptText}
        </h3>

        {/* Hint toggler */}
        {currentQuestion.hint && (
          <div className="mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs sm:text-sm font-semibold text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
            {showHint && (
              <p className="mt-2 text-xs sm:text-sm font-medium text-amber-200 bg-amber-950/50 border border-amber-800/80 p-4 rounded-xl leading-relaxed">
                💡 Hint: {currentQuestion.hint}
              </p>
            )}
          </div>
        )}

        {/* Options List (Multiple Choice or Text Input) */}
        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isThisCorrect = isOptionCorrect(opt, currentQuestion.answer);

              let btnStyle =
                'bg-slate-800/90 border-slate-700/80 text-slate-100 hover:bg-slate-750 hover:border-sky-500/50';
              let badge = null;

              if (feedback) {
                if (isSelected && feedback === 'correct') {
                  btnStyle =
                    'bg-emerald-600 border-emerald-400 text-white font-black ring-4 ring-emerald-500/30 scale-[1.02] shadow-lg shadow-emerald-500/20';
                  badge = (
                    <span className="flex items-center gap-1 text-xs bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-lg font-extrabold ml-2 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      Correct
                    </span>
                  );
                } else if (isSelected && feedback === 'wrong') {
                  btnStyle =
                    'bg-rose-950/95 border-2 border-rose-500 text-rose-200 font-bold ring-4 ring-rose-500/30 line-through decoration-rose-400 decoration-2';
                  badge = (
                    <span className="flex items-center gap-1 text-xs bg-rose-900/90 border border-rose-600 px-2.5 py-1 rounded-lg text-rose-200 font-bold ml-2 shrink-0 not-italic no-underline">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      Your Pick (Wrong)
                    </span>
                  );
                } else if (feedback === 'wrong' && isThisCorrect) {
                  btnStyle =
                    'bg-emerald-600/95 border-2 border-emerald-300 text-white font-black ring-4 ring-emerald-400/50 scale-[1.03] shadow-xl shadow-emerald-500/30 animate-pulse';
                  badge = (
                    <span className="flex items-center gap-1 text-xs bg-emerald-800 text-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg font-black ml-2 shrink-0 shadow-sm animate-bounce">
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      ✨ Auto-Corrected
                    </span>
                  );
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => {
                    setSelectedOption(opt);
                    onAnswerSubmit(opt);
                  }}
                  className={`p-5 sm:p-6 rounded-2xl border-2 text-left text-base sm:text-lg font-bold transition-all duration-150 flex items-center justify-between shadow-md cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {badge}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedOption) onAnswerSubmit(selectedOption);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={selectedOption || ''}
                disabled={feedback !== null}
                onChange={(e) => setSelectedOption(e.target.value)}
                placeholder="Type your answer here..."
                className={`w-full bg-slate-950 border-2 rounded-2xl px-5 py-4 text-lg font-bold placeholder-slate-500 focus:outline-none shadow-inner ${
                  feedback === 'wrong'
                    ? 'border-rose-500 text-rose-300 line-through'
                    : feedback === 'correct'
                    ? 'border-emerald-500 text-emerald-300'
                    : 'border-slate-700 text-white focus:border-sky-500'
                }`}
              />
              <button
                type="submit"
                disabled={!selectedOption || feedback !== null}
                className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all cursor-pointer"
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}

        {/* Feedback & Auto-Correction Panel */}
        {feedback === 'correct' && (
          <div className="p-4 sm:p-5 rounded-2xl font-black text-center text-base sm:text-lg flex items-center justify-center gap-3 animate-in fade-in zoom-in-95 shadow-lg bg-emerald-950 text-emerald-200 border-2 border-emerald-600">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Brilliant! Correct Answer (+100 pts)</span>
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-emerald-950/90 border-2 border-amber-500/70 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base sm:text-lg">
                <XCircle className="w-6 h-6 shrink-0" />
                <span>Incorrect Selection</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40 font-black uppercase tracking-wider animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Auto-Correct Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800 shadow-inner">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                  The Correct Answer is:
                </p>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>{currentQuestion.answer}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakText(`The correct answer is: ${currentQuestion.answer}`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-300 bg-sky-950/90 hover:bg-sky-900 border border-sky-800 px-3.5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                  title="Read correct answer aloud"
                >
                  <Volume2 className="w-4 h-4 text-sky-400" />
                  <span>Listen</span>
                </button>
                <button
                  type="button"
                  onClick={onAdvanceToNextQuestion}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>

            {currentQuestion.hint && (
              <p className="text-xs sm:text-sm text-amber-200/90 bg-amber-950/40 p-3 rounded-xl border border-amber-900/50 leading-relaxed">
                💡 <span className="font-bold text-amber-300">Explanation / Note:</span> {currentQuestion.hint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
