import React, { useState, useEffect, useMemo } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { Attempt, ProgrammingQuizAttempt } from '../../types';
import { fetchProgrammingQuizAttempts } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Trophy,
  CheckCircle2,
  Clock,
  User,
  Download,
  BookOpen,
  Award,
  Zap,
  Eye,
  Check,
  X,
  FileText,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Code2,
  Sparkles,
  TrendingUp,
  ArrowUpDown,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

type FilterCategory = 'all' | 'games' | 'programming-quiz' | 'high-accuracy' | 'needs-help';
type SortOption = 'recent' | 'score-desc' | 'score-asc' | 'accuracy-desc';

export const ProgressView: React.FC = () => {
  const { attempts, currentUser, setActiveTab } = useEduPlay();
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [selectedCodingAttempt, setSelectedCodingAttempt] = useState<ProgrammingQuizAttempt | null>(null);
  const [programmingAttempts, setProgrammingAttempts] = useState<ProgrammingQuizAttempt[]>([]);
  const [loadingCodingAttempts, setLoadingCodingAttempts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [exporting, setExporting] = useState(false);

  // Load Programming Quiz attempts from backend
  const loadCodingAttempts = async () => {
    setLoadingCodingAttempts(true);
    try {
      const data = await fetchProgrammingQuizAttempts();
      setProgrammingAttempts(data || []);
    } catch {
      // silently handle
    } finally {
      setLoadingCodingAttempts(false);
    }
  };

  useEffect(() => {
    loadCodingAttempts();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCodingAttempts();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter game attempts based on role
  const roleGameAttempts = useMemo(() => {
    return currentUser.role === 'student'
      ? attempts.filter((a) => a.studentId === currentUser.id)
      : attempts;
  }, [attempts, currentUser]);

  // Unified items list for display
  const combinedList = useMemo(() => {
    type UnifiedItem = {
      id: string;
      studentName: string;
      title: string;
      type: 'game' | 'programming-quiz';
      gameSlug?: string;
      score: number;
      maxScore: number;
      accuracy: number;
      completedAt: string;
      originalGameAttempt?: Attempt;
      originalCodingAttempt?: ProgrammingQuizAttempt;
    };

    const gameItems: UnifiedItem[] = roleGameAttempts.map((a) => ({
      id: a.id,
      studentName: a.studentName,
      title: a.questionSetTitle,
      type: 'game',
      gameSlug: a.gameSlug,
      score: a.score,
      maxScore: a.totalQuestions * 10,
      accuracy: a.accuracy,
      completedAt: a.completedAt,
      originalGameAttempt: a,
    }));

    const codingItems: UnifiedItem[] = programmingAttempts.map((a) => ({
      id: a.id,
      studentName: a.studentName || 'Anonymous',
      title: 'Basic Programming Quiz (25 Questions)',
      type: 'programming-quiz',
      score: a.score,
      maxScore: a.totalQuestions || 25,
      accuracy: a.accuracy,
      completedAt: a.completedAt,
      originalCodingAttempt: a,
    }));

    let list = [...gameItems, ...codingItems];

    // Filter by Category
    if (filterCategory === 'games') {
      list = list.filter((i) => i.type === 'game');
    } else if (filterCategory === 'programming-quiz') {
      list = list.filter((i) => i.type === 'programming-quiz');
    } else if (filterCategory === 'high-accuracy') {
      list = list.filter((i) => i.accuracy >= 80);
    } else if (filterCategory === 'needs-help') {
      list = list.filter((i) => i.accuracy < 75);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.studentName.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.gameSlug && i.gameSlug.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      if (sortBy === 'score-desc') return b.score - a.score;
      if (sortBy === 'score-asc') return a.score - b.score;
      if (sortBy === 'accuracy-desc') return b.accuracy - a.accuracy;
      return 0;
    });

    return list;
  }, [roleGameAttempts, programmingAttempts, filterCategory, searchQuery, sortBy]);

  // Overall Stats
  const totalCompleted = combinedList.length;
  const avgAccuracy =
    totalCompleted > 0
      ? Math.round(combinedList.reduce((acc, a) => acc + a.accuracy, 0) / totalCompleted)
      : 100;
  const totalScore = combinedList.reduce((acc, a) => acc + a.score, 0);

  // Recharts Chart Data Prep
  const chartData = combinedList.slice(0, 10).map((a, idx) => ({
    name: a.studentName.split(' ')[0] || `Student ${idx + 1}`,
    score: a.score,
    accuracy: a.accuracy,
    type: a.type === 'programming-quiz' ? 'Prog Quiz' : a.gameSlug || 'Game',
  }));

  const exportGradebookCSV = () => {
    setExporting(true);
    const headers = ['Student Name', 'Activity / Question Set', 'Type', 'Score', 'Accuracy %', 'Date Completed'];
    const rows = combinedList.map((a) => [
      `"${a.studentName}"`,
      `"${a.title}"`,
      a.type === 'programming-quiz' ? 'Programming Quiz' : (a.gameSlug || 'Game'),
      a.score,
      `${a.accuracy}%`,
      new Date(a.completedAt).toLocaleString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QuizGame_Gradebook_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setExporting(false), 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Enhanced Action Buttons Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-indigo-800/80 shadow-2xl text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-black uppercase tracking-widest">
              Live Gradebook & Diagnostics
            </span>
            <span className="text-xs font-bold text-slate-300">Unified Classroom Reports</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400" />
            <span>Progress & Gradebook Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time analytics for classroom game activities, Programming Quizzes (1 pt/question), student accuracy rates, and item diagnostics.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Programming Test Launcher Button */}
          <button
            onClick={() => setActiveTab('coding-quiz')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-indigo-900/40 border border-indigo-400/40 transition active:scale-95 cursor-pointer"
            title="Launch Programming Quiz"
          >
            <Code2 className="w-4 h-4 text-yellow-300" />
            <span>Programming Test</span>
          </button>

          {/* Export CSV Gradebook Button */}
          <button
            onClick={exportGradebookCSV}
            disabled={exporting || combinedList.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 border border-emerald-400/40 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Download CSV report"
          >
            <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          {/* Print Gradebook Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95 cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Live Sync Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95 cursor-pointer"
            title="Refresh All Records"
          >
            <RefreshCw className={`w-4 h-4 text-sky-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Tests & Games</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">{totalCompleted}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorded completions</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-inner">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Average Accuracy</p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{avgAccuracy}%</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all student submissions</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Score Points</p>
            <h3 className="text-3xl font-black text-amber-500 mt-0.5">{totalScore}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Cumulative earned points</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-500" />
              <span>Recent Performance & Accuracy Trends</span>
            </h2>
            <span className="text-xs text-slate-400">Top 10 Recent Submissions</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#0284c7" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 100]} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="score" fill="#0284c7" radius={[6, 6, 0, 0]} name="Score" />
                <Bar yAxisId="right" dataKey="accuracy" fill="#10b981" radius={[6, 6, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter Buttons, Search & Gradebook Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4">
        {/* Filter Toolbar & Search Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Submission Log & Gradebook</h2>
              <p className="text-xs text-slate-500">Showing {combinedList.length} filtered records</p>
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-indigo-400 text-slate-900 dark:text-white w-52 sm:w-64 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score-desc">Highest Score</option>
                  <option value="score-asc">Lowest Score</option>
                  <option value="accuracy-desc">Highest Accuracy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'all', label: 'All Records', count: roleGameAttempts.length + programmingAttempts.length },
              { id: 'programming-quiz', label: 'Programming Quizzes', count: programmingAttempts.length, icon: Code2 },
              { id: 'games', label: 'Interactive Games', count: roleGameAttempts.length },
              { id: 'high-accuracy', label: 'High Accuracy (≥80%)', count: combinedList.filter(i => i.accuracy >= 80).length },
              { id: 'needs-help', label: 'Needs Practice (<75%)', count: combinedList.filter(i => i.accuracy < 75).length },
            ].map((tab) => {
              const isActive = filterCategory === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id as FilterCategory)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Attempt Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Activity & Topic</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Score Awarded</th>
                <th className="px-6 py-3.5">Accuracy</th>
                <th className="px-6 py-3.5">Date Completed</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {combinedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No submissions found matching filter criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try resetting search or take a quiz to generate scores.</p>
                  </td>
                </tr>
              ) : (
                combinedList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs flex items-center justify-center">
                        {item.studentName.charAt(0)}
                      </div>
                      <span>{item.studentName}</span>
                    </td>

                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold max-w-xs truncate">
                      {item.title}
                    </td>

                    <td className="px-6 py-4">
                      {item.type === 'programming-quiz' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                          <Code2 className="w-3 h-3" /> Prog Quiz (1 pt/Q)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 uppercase">
                          {item.gameSlug}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-black">
                      {item.type === 'programming-quiz' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                          {item.score} <span className="text-xs font-semibold text-slate-400">/ 25 pts</span>
                        </span>
                      ) : (
                        <span className="text-amber-500 font-black text-sm">
                          {item.score} <span className="text-xs font-semibold text-slate-400">pts</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg font-black text-[11px] ${
                          item.accuracy >= 80
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : item.accuracy >= 60
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {item.accuracy}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(item.completedAt).toLocaleDateString()} {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (item.originalGameAttempt) setSelectedAttempt(item.originalGameAttempt);
                          if (item.originalCodingAttempt) setSelectedCodingAttempt(item.originalCodingAttempt);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                        title="Inspect detailed question answers"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL 1: Game Attempt Question Inspector ───────────────────────────── */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">Game Response Inspector</span>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedAttempt.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  Set: {selectedAttempt.questionSetTitle} • Game: {selectedAttempt.gameSlug} • Score: {selectedAttempt.score} pts ({selectedAttempt.accuracy}%)
                </p>
              </div>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Individual Question Breakdown ({selectedAttempt.answers?.length || 0})
              </h4>

              {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                selectedAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                      ans.isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{ans.questionPrompt}</p>
                      <p className="text-[11px] mt-1">
                        Student: <span className="font-bold">{ans.studentAnswer}</span> | Correct:{' '}
                        <span className="font-bold">{ans.correctAnswer}</span>
                      </p>
                    </div>

                    <div className="shrink-0">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <X className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No question breakdown recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Programming Quiz Attempt Inspector ────────────────────────── */}
      {selectedCodingAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">Programming Quiz Inspector</span>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedCodingAttempt.studentName || 'Anonymous'}
                </h3>
                <p className="text-xs text-slate-500">
                  Score: <span className="font-black text-emerald-600">{selectedCodingAttempt.score} / {selectedCodingAttempt.totalQuestions} pts</span> • {selectedCodingAttempt.accuracy}% Accuracy • {new Date(selectedCodingAttempt.completedAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedCodingAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                25 Questions Breakdown ({selectedCodingAttempt.answers?.length || 0})
              </h4>

              {selectedCodingAttempt.answers && selectedCodingAttempt.answers.length > 0 ? (
                selectedCodingAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      ans.isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-800 dark:text-white">{idx + 1}. {ans.question}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${ans.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {ans.isCorrect ? '+1 Point' : '0 Points'}
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300">
                          Selected: Option {ans.selectedOption} | Correct: Option {ans.correctOption} ({ans.correctAnswer})
                        </span>
                      </div>
                      {!ans.isCorrect && ans.explanation && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                          💡 {ans.explanation}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <X className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No question breakdown recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
