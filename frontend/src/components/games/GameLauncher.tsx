import React, { useState, useEffect } from 'react';
import { Game, QuestionSet, Assignment, QuestionAttemptAnswer } from '../../types';
import { useEduPlay } from '../../context/EduPlayContext';
import confetti from 'canvas-confetti';
import {
  playCorrectSound,
  playWrongSound,
  playCheerSound,
} from '../../utils/soundEffects';
import {
  ArrowLeft,
  Trophy,
  HelpCircle,
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

import { GameOverSummary } from './launcher/GameOverSummary';
import { QuestionModal } from './launcher/QuestionModal';

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
  const advanceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Helper to check if an option matches the target answer
  const isOptionCorrect = (opt: string, targetAnswer: string) => {
    if (!opt || !targetAnswer) return false;
    const normOpt = opt.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const normTarget = targetAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return normOpt === normTarget || opt.trim().toUpperCase() === targetAnswer.trim().toUpperCase();
  };

  // Elapsed timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Clean up advance timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const handleTriggerQuestion = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setSelectedOption(null);
    setFeedback(null);
    setShowHint(false);
    setIsQuestionModalOpen(true);
  };

  const advanceToNextQuestion = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setIsQuestionModalOpen(false);
    setSelectedOption(null);
    setFeedback(null);
    setShowHint(false);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  };

  const handleAnswerSubmit = (chosenAnswer: string) => {
    if (!currentQuestion || feedback !== null) return;

    const isCorrect = isOptionCorrect(chosenAnswer, currentQuestion.answer);

    const record: QuestionAttemptAnswer = {
      questionId: currentQuestion.id,
      questionPrompt: currentQuestion.promptText,
      studentAnswer: chosenAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
    };

    setAnswersHistory((prev) => [...prev, record]);

    if (isCorrect) {
      playCorrectSound();
      setFeedback('correct');
      setScore((prev) => prev + 100);
      setStreak((prev) => prev + 1);

      advanceTimerRef.current = setTimeout(() => {
        advanceToNextQuestion();
      }, 1200);
    } else {
      playWrongSound();
      setFeedback('wrong');
      setStreak(0);
    }
  };

  const finishGame = async () => {
    setIsGameOver(true);
    playCheerSound();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    const correctCount = answersHistory.filter((a) => a.isCorrect).length;
    const finalAccuracy =
      questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;

    try {
      await recordAttempt({
        assignmentId: assignment?.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        questionSetId: questionSet.id,
        questionSetTitle: questionSet.title,
        gameSlug: game.slug,
        score: score + 100,
        accuracy: finalAccuracy,
        totalQuestions: questions.length,
        correctCount,
        answers: answersHistory,
      });
    } catch {
      // ignore
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setAnswersHistory([]);
    setIsGameOver(false);
    setIsQuestionModalOpen(false);
    setSelectedOption(null);
    setFeedback(null);
    setTimerSeconds(0);
  };

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
            question={currentQuestion}
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
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium">Q:</span>
            <span className="font-bold text-white">
              {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
            </span>
          </div>

          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak}x Streak!</span>
            </div>
          )}

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
              className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              Exit to Games Catalog
            </button>
          </div>
        ) : !isGameOver ? (
          renderGameMechanic()
        ) : (
          <GameOverSummary
            game={game}
            score={score}
            questions={questions}
            answersHistory={answersHistory}
            timerSeconds={timerSeconds}
            onRestart={restartGame}
            onClaimSticker={() => setActiveTab('rewards')}
          />
        )}
      </main>

      {/* Universal Question Challenge Modal */}
      {currentQuestion && (
        <QuestionModal
          isOpen={isQuestionModalOpen && !isGameOver}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          showHint={showHint}
          setShowHint={setShowHint}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          feedback={feedback}
          isOptionCorrect={isOptionCorrect}
          onAnswerSubmit={handleAnswerSubmit}
          onAdvanceToNextQuestion={advanceToNextQuestion}
        />
      )}
    </div>
  );
};
