import React, { useState, useEffect } from 'react';
import { Game, QuestionSet, Assignment, QuestionAttemptAnswer } from '../../types';
import { useEduPlay } from '../../context/EduPlayContext';
import confetti from 'canvas-confetti';
import {
  playCorrectSound,
  playWrongSound,
  playCheerSound,
  speakText,
} from '../../utils/soundEffects';
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  HelpCircle,
  Clock,
  Zap,
} from 'lucide-react';

// Import individual game mechanics
import { WheelSpinGame } from './WheelSpinGame';
import { ShipBattleGame } from './ShipBattleGame';
import { AlienSpellingGame } from './AlienSpellingGame';
import { CraneGame } from './CraneGame';
import { MagicPotionsGame } from './MagicPotionsGame';
import { FlashcardsGame } from './FlashcardsGame';
import { RollAndReadGame } from './RollAndReadGame';
import { OceanQuestGame } from './OceanQuestGame';

interface GameLauncherProps {
  game: Game;
  questionSet: QuestionSet;
  assignment?: Assignment | null;
  onExit: () => void;
}

export const GameLauncher: React.FC<GameLauncherProps> = ({
  game,
  questionSet,
  assignment,
  onExit,
}) => {
  const { currentUser, recordAttempt, setActiveTab, rewards } = useEduPlay();

  // Game Progress State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<QuestionAttemptAnswer[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const questions = questionSet.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Elapsed timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Trigger question modal when game mechanic requests a question check
  const handleTriggerQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setShowHint(false);
    setIsQuestionModalOpen(true);
  };

  // Process Answer submitted in modal or directly by game
  const handleAnswerSubmit = (studentAnswer: string) => {
    if (!currentQuestion) return;

    const normStudent = studentAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const normTarget = currentQuestion.answer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    const isCorrect =
      normStudent === normTarget ||
      studentAnswer.trim().toUpperCase() === currentQuestion.answer.trim().toUpperCase();

    if (isCorrect) {
      playCorrectSound();
      setFeedback('correct');
      const pointBonus = 100 + streak * 20;
      setScore((prev) => prev + pointBonus);
      setStreak((prev) => prev + 1);
    } else {
      playWrongSound();
      setFeedback('wrong');
      setStreak(0);
    }

    // Save answer record
    const record: QuestionAttemptAnswer = {
      questionId: currentQuestion.id,
      questionPrompt: currentQuestion.promptText,
      studentAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
    };
    setAnswersHistory((prev) => [...prev, record]);

    // Delay to show feedback before closing modal & advancing
    setTimeout(() => {
      setIsQuestionModalOpen(false);
      setFeedback(null);

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // All questions completed!
        finishGame();
      }
    }, 1200);
  };

  const finishGame = () => {
    setIsGameOver(true);
    playCheerSound();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const correctCount = answersHistory.filter((a) => a.isCorrect).length;
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;

    // Record attempt in context
    recordAttempt({
      assignmentId: assignment?.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      questionSetId: questionSet.id,
      questionSetTitle: questionSet.title,
      gameSlug: game.slug,
      score: score + 100, // completion bonus
      accuracy,
      totalQuestions: questions.length,
      correctCount,
      answers: answersHistory,
    });
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setAnswersHistory([]);
    setIsGameOver(false);
    setIsQuestionModalOpen(false);
    setTimerSeconds(0);
  };

  // Render specific game component
  const renderGameMechanic = () => {
    switch (game.slug) {
      case 'wheel-spin':
        return (
          <WheelSpinGame
            question={currentQuestion}
            onTriggerQuestion={handleTriggerQuestion}
            isQuestionOpen={isQuestionModalOpen}
            score={score}
          />
        );
      case 'ship-battle':
        return (
          <ShipBattleGame
            question={currentQuestion}
            onTriggerQuestion={handleTriggerQuestion}
            isQuestionOpen={isQuestionModalOpen}
            streak={streak}
          />
        );
      case 'alien-spelling':
        return (
          <AlienSpellingGame
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSubmit}
            streak={streak}
          />
        );
      case 'crane-game':
        return (
          <CraneGame
            question={currentQuestion}
            onTriggerQuestion={handleTriggerQuestion}
            isQuestionOpen={isQuestionModalOpen}
          />
        );
      case 'magic-potions':
        return (
          <MagicPotionsGame
            question={currentQuestion}
            onTriggerQuestion={handleTriggerQuestion}
            isQuestionOpen={isQuestionModalOpen}
          />
        );
      case 'flashcards':
        return (
          <FlashcardsGame
            questions={questions}
            currentIndex={currentQuestionIndex}
            onAnswerSubmit={handleAnswerSubmit}
          />
        );
      case 'roll-and-read':
        return (
          <RollAndReadGame
            questions={questions}
            onTriggerQuestion={handleTriggerQuestion}
            onAnswerSubmit={handleAnswerSubmit}
          />
        );
      case 'ocean-quest':
        return (
          <OceanQuestGame
            question={currentQuestion}
            onTriggerQuestion={handleTriggerQuestion}
            isQuestionOpen={isQuestionModalOpen}
          />
        );
      default:
        return (
          <WheelSpinGame
            question={currentQuestion}
            onTriggerQuestion={handleTriggerQuestion}
            isQuestionOpen={isQuestionModalOpen}
            score={score}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Game Top Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Game</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-sky-400">{game.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-300 truncate max-w-[180px] sm:max-w-xs">
                {questionSet.title}
              </span>
            </div>
            {assignment && (
              <span className="inline-block text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                Assignment Code: {assignment.joinCode}
              </span>
            )}
          </div>
        </div>

        {/* HUD Metrics */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Question Counter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium">Q:</span>
            <span className="font-bold text-white">
              {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
            </span>
          </div>

          {/* Streak Counter */}
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak}x Streak!</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-lg text-sm font-black">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{score} pts</span>
          </div>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-7xl mx-auto min-h-[80vh]">
        {questions.length === 0 ? (
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl my-auto">
            <HelpCircle className="w-14 h-14 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-white mb-2">No Questions Found</h2>
            <p className="text-sm text-slate-400 mb-6">
              The question set "<span className="text-sky-400 font-semibold">{questionSet?.title || 'Selected Set'}</span>" contains no questions yet.
            </p>
            <button
              onClick={onExit}
              className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all"
            >
              Exit to Games Catalog
            </button>
          </div>
        ) : !isGameOver ? (
          renderGameMechanic()
        ) : (
          /* Game Over Victory Screen */
          <div className="w-full max-w-3xl sm:max-w-4xl bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
            <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-amber-500/30 mb-6 animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>

            <h2 className="text-4xl font-black text-white mb-2">Lesson Completed!</h2>
            <p className="text-slate-300 text-base mb-8">
              Awesome work playing <span className="text-sky-400 font-bold">{game.name}</span>!
            </p>

            {/* Score Summary Box */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Score</p>
                <p className="text-2xl font-black text-amber-400">{score + 100}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Accuracy</p>
                <p className="text-2xl font-black text-emerald-400">
                  {questions.length > 0
                    ? Math.round(
                        (answersHistory.filter((a) => a.isCorrect).length / questions.length) * 100
                      )
                    : 100}
                  %
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Time</p>
                <p className="text-2xl font-black text-sky-400">{timerSeconds}s</p>
              </div>
            </div>

            {/* Rewards Notification */}
            <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-3 mb-6 flex items-center gap-3 text-left">
              <Award className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-purple-200">Rewards Progress Updated!</p>
                <p className="text-[11px] text-purple-300/80">
                  You earned +{score + 100} points towards unlocking new sticker tickets!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={restartGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Claim Sticker</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Universal Question Challenge Modal (Used by games that spin/interact to trigger questions) */}
      {isQuestionModalOpen && currentQuestion && !isGameOver && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl sm:max-w-4xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header / Type badge */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-950/90 px-3.5 py-1.5 rounded-full border border-sky-800/80 shadow-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>

              <button
                onClick={() => speakText(currentQuestion.promptText)}
                className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
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
                  className="text-xs sm:text-sm font-semibold text-amber-400 hover:underline flex items-center gap-1.5"
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
                  let btnStyle = 'bg-slate-800/90 border-slate-700/80 text-slate-100 hover:bg-slate-750 hover:border-sky-500/50';

                  if (feedback && isSelected) {
                    btnStyle =
                      feedback === 'correct'
                        ? 'bg-emerald-600 border-emerald-400 text-white font-black ring-4 ring-emerald-500/30 scale-[1.02]'
                        : 'bg-rose-600 border-rose-400 text-white font-black ring-4 ring-rose-500/30 scale-[1.02]';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={feedback !== null}
                      onClick={() => {
                        setSelectedOption(opt);
                        handleAnswerSubmit(opt);
                      }}
                      className={`p-5 sm:p-6 rounded-2xl border-2 text-left text-base sm:text-lg font-bold transition-all duration-150 flex items-center justify-between shadow-md ${btnStyle}`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {feedback && isSelected && (
                        feedback === 'correct' ? (
                          <CheckCircle2 className="w-6 h-6 text-white shrink-0 ml-2" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white shrink-0 ml-2" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Text Input fallback */
              <div className="mb-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedOption) handleAnswerSubmit(selectedOption);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={selectedOption || ''}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-2xl px-5 py-4 text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!selectedOption || feedback !== null}
                    className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all"
                  >
                    Submit Answer
                  </button>
                </form>
              </div>
            )}

            {/* Instant Feedback Notice */}
            {feedback && (
              <div
                className={`p-4 sm:p-5 rounded-2xl font-black text-center text-base sm:text-lg flex items-center justify-center gap-3 animate-in fade-in zoom-in-95 shadow-lg ${
                  feedback === 'correct'
                    ? 'bg-emerald-950 text-emerald-200 border-2 border-emerald-600'
                    : 'bg-rose-950 text-rose-200 border-2 border-rose-600'
                }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <span>Brilliant! Correct Answer (+100 pts)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    <span>Nice try! Correct was: {currentQuestion.answer}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
