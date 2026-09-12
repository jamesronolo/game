import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw } from 'lucide-react';
import { playCheerSound } from '../../utils/soundEffects';
import {
  fetchProgrammingQuizQuestions,
  submitProgrammingQuiz,
  fetchProgrammingQuizAttempts,
} from '../../services/api';
import {
  ProgrammingQuizQuestion,
  ProgrammingQuizAnswerResult,
  ProgrammingQuizAttempt,
} from '../../types';
import { QuizIntroScreen } from './screens/QuizIntroScreen';
import { QuizQuestionScreen } from './screens/QuizQuestionScreen';
import { QuizFeedbackScreen } from './screens/QuizFeedbackScreen';
import { QuizResultsScreen } from './screens/QuizResultsScreen';
import { QuizHistoryModal } from './screens/QuizHistoryModal';

type Screen = 'intro' | 'quiz' | 'feedback' | 'results' | 'history';
type SelectedAnswers = Record<string, string>;

function useTimer(active: boolean): number {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return seconds;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export const CodingQuizView: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [questions, setQuestions] = useState<ProgrammingQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [feedbackResult, setFeedbackResult] = useState<ProgrammingQuizAnswerResult | null>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [liveScore, setLiveScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<ProgrammingQuizAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(false);

  const timerActive = screen === 'quiz' || screen === 'feedback';
  const elapsed = useTimer(timerActive);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length || 25;

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = await fetchProgrammingQuizQuestions();
      setQuestions(qs);
    } catch {
      setError('Failed to load questions. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAttempts = useCallback(async () => {
    setLoadingAttempts(true);
    try {
      const atts = await fetchProgrammingQuizAttempts();
      setAttempts(atts);
    } catch {
      // silently handle
    } finally {
      setLoadingAttempts(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleStartQuiz = () => {
    if (nameInput.trim()) {
      setStudentName(nameInput.trim());
    } else if (!studentName) {
      setStudentName('Student');
    }
    setSelectedAnswers({});
    setFeedbackResult(null);
    setQuizResults(null);
    setLiveScore(0);
    setStreak(0);
    setCurrentIdx(0);
    setScreen('quiz');
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (feedbackResult) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleConfirmAnswer = async () => {
    const q = currentQuestion;
    const selected = selectedAnswers[q.id];
    if (!selected) return;

    setSubmitting(true);
    setShowExplanation(false);
    try {
      const res = await submitProgrammingQuiz({
        answers: [{ questionId: q.id, selectedOption: selected }],
        studentName,
      });
      const gradedItem = res.graded[0];
      setFeedbackResult(gradedItem);

      if (gradedItem.isCorrect) {
        setLiveScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setScoreAnimation(true);
        setTimeout(() => setScoreAnimation(false), 1200);

        try {
          playCheerSound();
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
          });
        } catch {
          // ignore
        }
      } else {
        setStreak(0);
      }

      setScreen('feedback');
    } catch {
      setFeedbackResult({
        questionId: q.id,
        number: q.number,
        question: q.question,
        selectedOption: selected,
        correctOption: '?',
        correctAnswer: 'Server unavailable',
        explanation: 'Could not reach backend for grading.',
        isCorrect: false,
        points: 0,
      });
      setScreen('feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    const answerList = questions.map((q) => ({
      questionId: q.id,
      selectedOption: selectedAnswers[q.id] || 'X',
    }));
    setSubmitting(true);
    try {
      const res = await submitProgrammingQuiz({ answers: answerList, studentName });
      setQuizResults(res);
      setScreen('results');
      loadAttempts();
    } catch {
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    const isLast = currentIdx >= totalQuestions - 1;
    if (isLast) {
      handleFinalSubmit();
    } else {
      setFeedbackResult(null);
      setCurrentIdx((i) => i + 1);
      setScreen('quiz');
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setFeedbackResult(null);
    setQuizResults(null);
    setLiveScore(0);
    setStreak(0);
    setCurrentIdx(0);
    setNameInput('');
    setScreen('intro');
  };

  if (screen === 'intro') {
    return (
      <QuizIntroScreen
        studentName={studentName}
        nameInput={nameInput}
        setNameInput={setNameInput}
        onStartQuiz={handleStartQuiz}
        onOpenHistory={() => {
          loadAttempts();
          setScreen('history');
        }}
        loading={loading}
        error={error}
        onRetryLoad={loadQuestions}
      />
    );
  }

  if (screen === 'quiz' && currentQuestion) {
    return (
      <QuizQuestionScreen
        currentQuestion={currentQuestion}
        currentIdx={currentIdx}
        totalQuestions={totalQuestions}
        selectedAnswers={selectedAnswers}
        liveScore={liveScore}
        streak={streak}
        scoreAnimation={scoreAnimation}
        elapsed={elapsed}
        formatTime={formatTime}
        submitting={submitting}
        onSelectOption={handleSelectOption}
        onConfirmAnswer={handleConfirmAnswer}
      />
    );
  }

  if (screen === 'feedback' && feedbackResult) {
    return (
      <QuizFeedbackScreen
        feedbackResult={feedbackResult}
        currentQuestion={currentQuestion}
        currentIdx={currentIdx}
        totalQuestions={totalQuestions}
        liveScore={liveScore}
        showExplanation={showExplanation}
        setShowExplanation={setShowExplanation}
        submitting={submitting}
        onNextQuestion={handleNextQuestion}
      />
    );
  }

  if (screen === 'results' && quizResults) {
    return (
      <QuizResultsScreen
        quizResults={quizResults}
        studentName={studentName}
        onRestart={handleRestart}
        onViewHistory={() => {
          loadAttempts();
          setScreen('history');
        }}
      />
    );
  }

  if (screen === 'history') {
    return (
      <QuizHistoryModal
        attempts={attempts}
        loadingAttempts={loadingAttempts}
        onBack={() => setScreen('intro')}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64 text-slate-400">
      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
      <span>Loading questions...</span>
    </div>
  );
};
