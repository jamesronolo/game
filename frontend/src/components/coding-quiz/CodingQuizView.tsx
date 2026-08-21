wimport React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Code2,
  Trophy,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  BarChart3,
  BookOpen,
  Lightbulb,
  Star,
  Award,
  Target,
  Zap,
  AlertCircle,
  History,
  User,
  Sparkles,
  Flame,
} from 'lucide-react';
import { playCheerSound } from '../../utils/soundEffects';
import { fetchProgrammingQuizQuestions, submitProgrammingQuiz, fetchProgrammingQuizAttempts } from '../../services/api';
import { ProgrammingQuizQuestion, ProgrammingQuizAnswerResult, ProgrammingQuizAttempt } from '../../types';

type Screen = 'intro' | 'quiz' | 'feedback' | 'results' | 'history';
type SelectedAnswers = Record<string, string>; // questionId -> 'A'|'B'|'C'|'D'

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const OPTION_COLORS: Record<string, string> = {
  A: 'from-violet-500 to-purple-600',
  B: 'from-sky-500 to-blue-600',
  C: 'from-emerald-500 to-green-600',
  D: 'from-orange-500 to-amber-600',
};

const getScoreColor = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 'text-emerald-600';
  if (pct >= 70) return 'text-sky-600';
  if (pct >= 50) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreGradient = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return 'from-emerald-500 to-teal-600';
  if (pct >= 70) return 'from-sky-500 to-blue-600';
  if (pct >= 50) return 'from-amber-500 to-orange-600';
  return 'from-red-500 to-rose-600';
};

const getScoreLabel = (score: number, total: number = 25): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return '🏆 Outstanding Mastery!';
  if (pct >= 70) return '⭐ Great Job!';
  if (pct >= 50) return '👍 Good Effort!';
  return '💪 Keep Practicing!';
};

// ─── Timer Hook ─────────────────────────────────────────────────────────────
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

// ─── Main Component ──────────────────────────────────────────────────────────
export const CodingQuizView: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [questions, setQuestions] = useState<ProgrammingQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [feedbackResult, setFeedbackResult] = useState<ProgrammingQuizAnswerResult | null>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [liveScore, setLiveScore] = useState(0); // 1 point per correct answer
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

  // Load questions from API
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = await fetchProgrammingQuizQuestions();
      setQuestions(qs);
    } catch (_e: any) {
      setError('Failed to load questions. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load attempt history
  const loadAttempts = useCallback(async () => {
    setLoadingAttempts(true);
    try {
      const data = await fetchProgrammingQuizAttempts();
      setAttempts(data);
    } catch {
      // silently fail
    } finally {
      setLoadingAttempts(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
    loadAttempts();
  }, [loadQuestions, loadAttempts]);

  const handleStartQuiz = () => {
    const name = nameInput.trim() || 'Anonymous';
    setStudentName(name);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setFeedbackResult(null);
    setQuizResults(null);
    setLiveScore(0);
    setStreak(0);
    setScreen('quiz');
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (feedbackResult) return; // already answered
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
        setLiveScore((prev) => prev + 1); // 1 point for correct answer
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
          // ignore sound/confetti errors
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
    } catch (_e: any) {
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
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

  // ─── INTRO SCREEN ────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-800 text-white shadow-2xl p-8 mb-6">
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
            <div className="absolute top-4 left-8 text-8xl font-black">{'{}'}</div>
            <div className="absolute bottom-4 right-8 text-8xl font-black">{'</>'}</div>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 mb-4 shadow-xl">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Programming Test</h1>
            <p className="text-blue-200 text-base font-medium">Basic Programming Concepts Quiz</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-blue-100 flex-wrap">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> 25 Questions</span>
              <span className="w-1 h-1 rounded-full bg-blue-300" />
              <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-300" /> 1 Point per Correct Answer</span>
              <span className="w-1 h-1 rounded-full bg-blue-300" />
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-300" /> Auto-graded</span>
            </div>
          </div>
        </div>

        {/* Scoring Rule Badge */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-5 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            +1
          </div>
          <div>
            <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
              Point System: 1 Point per Correct Answer
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Get an answer right to earn +1 point immediately. Perfect score is 25 / 25 points!
            </p>
          </div>
        </div>

        {/* Topics Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-5">
          <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">Topics Covered</h2>
          <div className="flex flex-wrap gap-2">
            {['HTML & CSS', 'JavaScript', 'PHP & SQL', 'APIs', 'Variables & Arrays', 'Functions & Loops', 'OOP', 'Debugging', 'IDE & Tools', 'Version Control'].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-5">
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 text-sm">
            <User className="inline w-4 h-4 mr-1.5 text-indigo-500" />
            Your Name (optional)
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-400 focus:outline-none text-sm font-medium transition-colors"
            onKeyDown={(e) => { if (e.key === 'Enter') handleStartQuiz(); }}
          />
        </div>

        {/* Best Score */}
        {attempts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-5">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1">Your Best Score</p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-400">
              {Math.max(...attempts.map((a) => a.score))}<span className="text-base font-normal text-amber-600 dark:text-amber-500"> / 25 pts</span>
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{attempts.length} attempt{attempts.length !== 1 ? 's' : ''} total</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-5 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            id="start-quiz-btn"
            onClick={handleStartQuiz}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5 text-yellow-300" />
                Start Quiz (1 pt per question)
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          {attempts.length > 0 && (
            <button
              onClick={() => { loadAttempts(); setScreen('history'); }}
              className="flex items-center gap-2 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <History className="w-5 h-5" />
              History
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── QUIZ SCREEN ─────────────────────────────────────────────────────────
  if (screen === 'quiz' && currentQuestion) {
    const selected = selectedAnswers[currentQuestion.id];

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Top Header Bar with Live Score Counter Stamp */}
        <div className="flex items-center justify-between gap-3 mb-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Progress</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">
              Question {currentIdx + 1} <span className="text-slate-400 font-normal">of {totalQuestions}</span>
            </span>
          </div>

          {/* Live Tatak Score Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
            scoreAnimation
              ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
          }`}>
            <Trophy className={`w-4 h-4 ${scoreAnimation ? 'text-yellow-200 animate-bounce' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider block leading-none">Score</span>
              <span className="text-sm font-black leading-none">
                {liveScore} <span className="text-[11px] font-medium opacity-75">/ {totalQuestions} pts</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">{formatTime(elapsed)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[11px] text-slate-400">
            <span>{Object.keys(selectedAnswers).length} answered</span>
            {streak > 1 && (
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {streak} Streak!
              </span>
            )}
            <span>{totalQuestions - Object.keys(selectedAnswers).length} remaining</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              {currentQuestion.number}
            </div>
            <p className="text-slate-800 dark:text-white font-semibold text-base leading-relaxed pt-0.5">
              {currentQuestion.question}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((opt, i) => {
            const label = OPTION_LABELS[i];
            const isSelected = selected === label;
            return (
              <button
                key={label}
                id={`option-${label}`}
                onClick={() => handleSelectOption(currentQuestion.id, label)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-150 group cursor-pointer
                  ${isSelected
                    ? `border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 shadow-md shadow-indigo-100 dark:shadow-indigo-950 scale-[1.01]`
                    : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30`
                  }`}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all
                  ${isSelected
                    ? `bg-gradient-to-br ${OPTION_COLORS[label]} text-white shadow-sm`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                  {label}
                </div>
                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-indigo-800 dark:text-indigo-200 font-semibold' : 'text-slate-700 dark:text-slate-200'}`}>
                  {opt}
                </span>
                {isSelected && (
                  <CheckCircle2 className="ml-auto w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          id="confirm-answer-btn"
          onClick={handleConfirmAnswer}
          disabled={!selected || submitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Checking Answer...</>
          ) : (
            <>{selected ? 'Confirm Answer & Lock Score' : 'Select an Option'} <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    );
  }

  // ─── FEEDBACK SCREEN (WITH TATAK SCORE +1 POINT) ───────────────────────────
  if (screen === 'feedback' && feedbackResult) {
    const isLast = currentIdx >= totalQuestions - 1;
    const isCorrect = feedbackResult.isCorrect;

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Result & Tatak Score Banner */}
        <div className={`rounded-3xl p-6 mb-5 text-center shadow-xl border-2 ${isCorrect
          ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 border-emerald-400 text-white shadow-emerald-600/30'
          : 'bg-gradient-to-br from-red-500 via-rose-600 to-red-700 border-red-400 text-white shadow-red-600/30'
          }`}>
          <div className="text-5xl mb-2">{isCorrect ? '🎉' : '❌'}</div>
          <p className="text-3xl font-black mb-1">{isCorrect ? 'CORRECT!' : 'INCORRECT'}</p>

          {/* Prominent Score Stamp ("Tatak na Score") */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 my-3 shadow-inner">
            {isCorrect ? (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="font-black text-lg tracking-wide text-yellow-200">
                  +1 POINT EARNED!
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-sm font-bold text-white">
                  Total Score: {liveScore} / {totalQuestions} pts
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-white/80" />
                <span className="font-bold text-base text-white/90">
                  +0 Points (No point added)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-sm font-semibold text-white/90">
                  Total Score: {liveScore} / {totalQuestions} pts
                </span>
              </>
            )}
          </div>

          <p className="text-white/80 text-xs mt-1">Question {feedbackResult.number} of {totalQuestions}</p>
        </div>

        {/* Question Recap with Correct Answer Highlight */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-4">
          <p className="font-semibold text-slate-800 dark:text-white text-sm mb-4 leading-relaxed">{feedbackResult.question}</p>

          <div className="space-y-2">
            {currentQuestion && currentQuestion.options.map((opt, i) => {
              const label = OPTION_LABELS[i];
              const isSelected = feedbackResult.selectedOption === label;
              const isCorrectOpt = feedbackResult.correctOption === label;

              let style = 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400';
              let icon = null;
              let scoreBadge = null;

              if (isCorrectOpt) {
                style = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 shadow-sm font-semibold';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
                scoreBadge = (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-black tracking-wide">
                    +1 pt (Correct Answer)
                  </span>
                );
              } else if (isSelected && !isCorrect) {
                style = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 line-through';
                icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
                scoreBadge = (
                  <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[11px] font-bold">
                    0 pt (Your choice)
                  </span>
                );
              }

              return (
                <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${style}`}>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs
                    ${isCorrectOpt ? 'bg-emerald-500 text-white' : isSelected && !isCorrect ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    {label}
                  </div>
                  <span className="text-sm font-medium flex-1">{opt}</span>
                  {scoreBadge}
                  {icon}
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto Correction & Explanation accordion */}
        <button
          onClick={() => setShowExplanation((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors mb-4 font-semibold text-sm cursor-pointer"
        >
          <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Auto Correction & Explanation</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
        </button>
        {showExplanation && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mb-4 text-sm text-amber-900 dark:text-amber-200 leading-relaxed animate-in fade-in duration-200">
            <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Why this answer:</p>
            {feedbackResult.explanation}
          </div>
        )}

        {/* Next Button */}
        <button
          id="next-question-btn"
          onClick={handleNextQuestion}
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Calculating Final Results...</>
          ) : isLast ? (
            <><Trophy className="w-5 h-5 text-yellow-300" /> See Final Results ({liveScore} / {totalQuestions} pts)</>
          ) : (
            <>Next Question <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    );
  }

  // ─── RESULTS SCREEN ──────────────────────────────────────────────────────
  if (screen === 'results' && quizResults) {
    const { score, accuracy, correctCount, totalQuestions: total, graded } = quizResults;

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Score Card */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreGradient(score, total)} text-white shadow-2xl p-8 mb-6 text-center`}>
          <div className="absolute inset-0 opacity-10 text-9xl leading-none font-black select-none flex items-center justify-center pointer-events-none">🏆</div>
          <div className="relative z-10">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-200" />
            <div className="text-6xl font-black mb-1">
              {score}
              <span className="text-3xl font-light opacity-80"> / {total} pts</span>
            </div>
            <p className="text-xl font-bold mb-1">{getScoreLabel(score, total)}</p>
            <p className="text-white/80 text-sm">
              {studentName && `${studentName} • `}{correctCount}/{total} Correct ({score} Points) • {accuracy}% Accuracy
            </p>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round((score / total) * 5) ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{correctCount} <span className="text-xs font-semibold text-emerald-500">pts</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Points Earned</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-red-500 dark:text-red-400">{total - correctCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Missed (0 pts)</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
            <Target className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accuracy</p>
          </div>
        </div>

        {/* Answer Review Table with Tatak Score per Question */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-5 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Full 25-Question Answer & Score Review</h3>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Total: {score}/{total} pts
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {graded.map((item: ProgrammingQuizAnswerResult, i: number) => (
              <div key={item.questionId} className={`flex items-start gap-3 px-5 py-3 ${item.isCorrect ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-red-50/50 dark:bg-red-950/20'}`}>
                <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${item.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{item.question}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {/* Tatak Score Badge */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      item.isCorrect
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.isCorrect ? '+1 Point' : '0 Points'}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300'}`}>
                      Your Answer: Option {item.selectedOption}
                    </span>
                    {!item.isCorrect && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        Correct: Option {item.correctOption} ({item.correctAnswer})
                      </span>
                    )}
                  </div>
                  {!item.isCorrect && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                      💡 {item.explanation}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {item.isCorrect
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <XCircle className="w-4 h-4 text-red-400" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            id="retry-quiz-btn"
            onClick={handleRestart}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() => { loadAttempts(); setScreen('history'); }}
            className="flex items-center gap-2 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <History className="w-5 h-5" />
            History
          </button>
        </div>
      </div>
    );
  }

  // ─── HISTORY SCREEN ───────────────────────────────────────────────────────
  if (screen === 'history') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setScreen('intro')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div>
            <h2 className="font-black text-slate-800 dark:text-white text-lg">Attempt History</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{attempts.length} total attempt{attempts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loadingAttempts ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading...
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No attempts yet</p>
            <p className="text-sm">Take the quiz to see your history here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((a, i) => (
              <div key={a.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-sm bg-gradient-to-br ${getScoreGradient(a.score, a.totalQuestions)} shrink-0`}>
                  <span className="text-lg leading-none">{a.score}</span>
                  <span className="text-[10px] opacity-80 leading-none mt-0.5">/ {a.totalQuestions}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{a.studentName || 'Anonymous'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {a.correctCount}/{a.totalQuestions} correct ({a.score} pts) • {a.accuracy}% accuracy
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(a.completedAt).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold ${getScoreColor(a.score, a.totalQuestions)}`}>
                    {(a.score / a.totalQuestions) >= 0.9 ? '🏆' : (a.score / a.totalQuestions) >= 0.7 ? '⭐' : (a.score / a.totalQuestions) >= 0.5 ? '👍' : '💪'}
                  </span>
                  {i === 0 && <p className="text-[10px] text-slate-400 mt-0.5">Latest</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Loading fallback
  return (
    <div className="flex items-center justify-center min-h-64 text-slate-400">
      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
      <span>Loading questions...</span>
    </div>
  );
};
